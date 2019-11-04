import { AppService } from './../../_services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpRequest, HttpClient, HttpEventType } from '@angular/common/http';
import { containerRefreshEnd } from '@angular/core/src/render3';
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/_services';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  categoryData: SelectItem[];
  categoryDataTmp: any;
  courseData: any;
  courseDataview: any[]
  course_pic;
  course_id: any = null;
  imgView: any ;
  imgData: any ;

  progress: number;
  message: string;
    formG = new FormGroup({
      category_id :  new FormControl(),
      course_name :  new FormControl('', Validators.required),
      course_price : new FormControl(),
      course_price_pro : new FormControl(),
      course_detail : new FormControl(),
      course_pic : new FormControl(),
      username : new FormControl(),
    });
  currentUser: User;
  userAuth: boolean;

  constructor(
    private http: HttpClient,
    private _service: AppService,
    private authenticationService: AuthenticationService,
    ) {

      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      if(this.currentUser) {
        this.userAuth = true;
      }
     }

  ngOnInit() {

   const gg =  this.getDataCategery();
   this.categoryData = gg;
    this.getData();
}


onSubmit() {

  const formData = new FormData();

        // formData.append(file.name, file);
        formData.append('course_name', this.formG.value.course_name);
        formData.append('course_price', this.formG.value.course_price);
        formData.append('course_price_pro', this.formG.value.course_price_pro);
        formData.append('course_detail', this.formG.value.course_detail) ;
        if (this.imgData) {
          formData.append('course_pic',  this.imgData);
        } else {
          formData.append('course_pic', '');
        }

        formData.append('username',''+this.currentUser.id);
        formData.append('category_id', this.formG.value.category_id);

if ( this.course_id === null ) {
  const uploadReq = new HttpRequest('POST', 'http://127.0.0.1:8000/api/course', formData, {
    reportProgress: true,
  });
   this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
      } else if (event.type === HttpEventType.Response) {
        this.message = event.body.toString();
        Swal.fire(
          'เพิ่มข้อมูลเรียบร้อย.',
          'กดปุ่มเพื่อปิด',
          'success'
        );
        this.getData();
        this.reset();
      }
    });
} else {
  const data = {
    category_id: this.formG.value.category_id,
    course_name: this.formG.value.course_name,
    course_price: this.formG.value.course_price,
    course_price_pro: this.formG.value.course_price_pro,
    course_detail: this.formG.value.course_detail,
    course_pic: this.formG.value.course_pic,
    username: this.formG.value.username
  };
  this._service.putData('/course/' + this.course_id, data).subscribe((res) => {
    Swal.fire(
      'แก้ไขข้อมูลเรียบร้อย.',
      'กดปุ่มเพื่อปิด',
      'success'
    );
    this.getData();
    this.reset();
  });
}

}



onUpdate(id: any) {
  this._service.getData('/course/' + id).subscribe((res) => {
  //  this.formG.controls.course.setValue(res.data.course_name);
   this.course_id = res.data.id;
   this.formG.controls.course_name.setValue(res.data.course_name);
   this.formG.controls.course_price.setValue(res.data.course_price);
   this.formG.controls.course_price_pro.setValue(res.data.course_price_pro);
   this.formG.controls.course_detail.setValue(res.data.course_detail);
  //  this.formG.controls.course_pic.setValue(res.data.course_pic);
   this.imgView  = 'http://localhost:8000/storage/' + res.data.course_pic;
  //  console.log( res.data.course_pic);
  //  console.log( this.course_pic);
   this.formG.controls.username.setValue(res.data.username);
   this.formG.controls.category_id.setValue(res.data.category_id);
  });
}
onDelete(id: any) {
  Swal.fire({
    title: 'ต้องการลบข้อมูล หรือไม่?',
    text: '',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f821b',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.value) {
      this._service.delData('/course/' + id).subscribe((res) => {
        Swal.fire(
          'ลบข้อมูลเรียบร้อย!',
          '',
          'success'
        );
        this.getData();
      });

    }
  });

}


getDataCategery(): any {
  this._service.getData('/category').subscribe((res: any) => {
    this.categoryDataTmp = res.data;
    this.categoryData = [];
    for ( let i = 0 ; i <  this.categoryDataTmp.length; i ++) {
      const item = {label:  this.categoryDataTmp[i].category_name, value:  this.categoryDataTmp[i].id};
      this.categoryData.push(item);
    }
  });
  return this.categoryData;
}
getData() {
  this._service.getData('/course').subscribe((res) => {
    this.courseData = res.data;
    this.courseDataview = res.data;
  });
}
reset() {
  this.formG.reset();
  this.imgView = null;
  this.imgData = null;
  this.course_id = null;
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
dropClick() {
  this.categoryData =  this.getDataCategery();
}
coursedataByID (event :any){
  this.courseDataview = [];
  this._service.getData('/course/' + event.value).subscribe((res) => {
    this.courseDataview.push(res.data);
  });
}


}
