import { Component, OnInit, Input } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { AppService, AuthenticationService } from '../_services';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { formControlBinding } from '@angular/forms/src/directives/reactive_directives/form_control_directive';
declare var $: any;


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
    pay_time: new FormControl(),
    pay_pic: new FormControl()
  });

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private _service: AppService,
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
  this.getBank()
  }
getBank() {
  this._service.getData('/bank').subscribe((res)=> {
    this.bankData = res[0];
  });
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

}
