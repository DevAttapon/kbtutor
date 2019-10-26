import { Component, OnInit, Input } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { AppService, AuthenticationService } from '../_services';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { formControlBinding } from '@angular/forms/src/directives/reactive_directives/form_control_directive';
import { HttpRequest, HttpEventType, HttpClient } from '@angular/common/http';
declare var $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders-modal',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  @Input() modalID: any;
  @Input() active: number;
  items: MenuItem[];
  activeStepIndex: any;
  uploadedFiles: any[] = [];
  courseData : any;
  currentUser: User;
  userAuth = false;
  passConfirm: boolean = false;
  loginError: any = null;
  chkForm = true;
  bankData: any;
  bankItem: any;
  imgData: any;
  imgView: any;
  forbiddenUsernames: any[] = ['bamossza', 'admin', 'superadmin'];
  loginForm = new FormGroup({
    username : new FormControl('m@gmail.com'),
    password: new FormControl('m12345')
  }
  );
  
  registerForm = new FormGroup({
    name : new FormControl(null,[Validators.required,this.forbiddenNames.bind(this)]),
    surname : new FormControl(),
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,[Validators.required,Validators.minLength(6)]),
    password_confirmation: new FormControl(null,Validators.required)
  });

  orderForm = new FormGroup({ 
    price: new FormControl(),
    pay_date: new FormControl(),
    pay_time: new FormControl({hour: 13, minute: 30}),
    pay_pic: new FormControl()
  });

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private _service: AppService,
    private http: HttpClient,
  ) { 
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if(this.currentUser) {
      this.userAuth = true;
    }
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.activeStepIndex = 0;
    $('#sec2').hide();
    $('#sec3').hide();

    this.items = [
      {label: 'รายละเอียดการซื้อ'},
      {label: 'ชำระเงิน'},
      {label: 'ยืนยัน'}
  ];
  
  this.getData(this.modalID);
  this.getBank();
  }


order() {
  let time = this.orderForm.value.pay_time.hour+':'+this.orderForm.value.pay_time.minute;
  const formData = new FormData();
  formData.append('pay_price',this.courseData.course_price_pro);
  formData.append('pay_datetime',this.formatDate(this.orderForm.value.pay_date)+' '+time);
  formData.append('pay_bank',this.bankItem.id);
  formData.append('course_id',this.modalID);
  formData.append('username',this.currentUser.id+'');
  formData.append('pay_status','');
  if (this.imgData) {
  formData.append('pay_pic',  this.imgData);
  } 

  const uploadReq = new HttpRequest('POST', 'http://127.0.0.1:8000/api/pay', formData, {
    reportProgress: true,
  });
   this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event.type === HttpEventType.Response) {
        Swal.fire({
          title: 'ยืนการการชำระเรียบร้อย.',
          text: "กรุณาตรวจสอบสถานะการชำระเงินที่ เมนูประวัติการสั่งซื้อ",
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.value) {
            location.reload();
          }
        })
       
      }
    });
}
onFileChanged(event) {
  this.imgData = event[0];
  const reader = new FileReader();
  // if (event.target.files && event.target.files.length > 0) {
    const file = event[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
     this.imgView = reader.result;
    };
}


getBank() {
  this._service.getData('/bank').subscribe((res)=> {
    this.bankData = res.data;
  });
}
bankSelectItem(item: any) {
  this.bankItem = item;
}

  userLogin (): void {

    const username =  this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.loginAuthen(username, password);

  }
  loginAuthen (username , password) {
    this.authenticationService.login(username, password).pipe(first())
    .subscribe(
        dataRes => {
            // condition here
            if(dataRes.access_token){
             
              this.userAuth = true;
              location.reload(true);
            }else {
              this.loginError = dataRes.error;
              console.log(dataRes);
            }
            
        },
        error => {
          //  error condition here
        });
  }
  register() {
    const  data = {
      name: this.registerForm.value.name + ' ' + this.registerForm.value.surname,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      password_confirmation : this.registerForm.value.password_confirmation
    };
    this._service.postData('/signup', data).subscribe((res) => {
      if (res) {
        console.log(res);
        const username =  this.registerForm.value.email;
        const password = this.registerForm.value.password;
          this.loginAuthen(username, password);
  
        /// development
  
  
      }
    });
  }
  



  forbiddenNames(control: FormControl): { [s: string]: boolean } {
  
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'forbiddenNames': true};
    }
 
  
  return null;
}

  getData(id: any){
    this._service.getData('/fullCourse/'+id).subscribe((res: any)=> {
     
           this.courseData = res.course[0];
               
             this._service.getImage('/getImage/'+res.course[0].course_pic).then((value) =>  this.courseData.course_pic  = value);        
        
    });
  }

  confirmOrder (): void {
        this.activeStepIndex =  1;
        $('#sec1').hide();
        $('#sec2').show();
        $('#sec3').hide();
  }

  onUpload(event) {
        this.uploadedFiles.push(event.file);
    }
     formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
  
      return [year, month, day].join('-');
  }
}
