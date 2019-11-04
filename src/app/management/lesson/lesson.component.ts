import { Component, OnInit } from '@angular/core';
import { AppService } from './../../_services/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpRequest, HttpClient, HttpEventType } from '@angular/common/http';
import { containerRefreshEnd } from '@angular/core/src/render3';
import { SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/_services';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit {

  courseData: SelectItem[];
  courseDataTmp: any;
  lessonData: any;
  lessonDataView: any;
  lesson_id: any = null;
  imgView: any ;
  imgData: any ;

  progress: number;
  message: string;
    formG = new FormGroup({
      course_id :  new FormControl(),
      lesson_name :  new FormControl('', Validators.required),
      lesson_detail : new FormControl(),
      username : new FormControl(),
    });
  userAuth: boolean;
  currentUser: User;

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
   this.courseData = gg;
    this.getData();
}


onSubmit() {

  const data = {
    course_id: this.formG.value.course_id,
    lesson_name: this.formG.value.lesson_name,
    lesson_price: this.formG.value.lesson_price,
    lesson_price_pro: this.formG.value.lesson_price_pro,
    lesson_detail: btoa(this.formG.value.lesson_detail),
    lesson_pic: this.formG.value.lesson_pic,
    username: this.currentUser.id
  };

if ( this.lesson_id === null ) {
  this._service.postData('/lesson', data).subscribe((res) => {
    Swal.fire(
      'เพิ่มข้อมูลเรียบร้อย.',
      'กดปุ่มเพื่อปิด',
      'success'
    );
    this.getData();
    this.reset();
  });
} else {
  this._service.putData('/lesson/' + this.lesson_id, data).subscribe((res) => {
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
  this._service.getData('/lesson/' + id).subscribe((res) => {
  //  this.formG.controls.lesson.setValue(res.data.lesson_name);
   this.lesson_id = res.data.id;
   this.formG.controls.lesson_name.setValue(res.data.lesson_name);
   this.formG.controls.lesson_detail.setValue(atob(res.data.lesson_detail));
   this.formG.controls.username.setValue(res.data.username);
   this.formG.controls.course_id.setValue(res.data.course_id);
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
      this._service.delData('/lesson/' + id).subscribe((res) => {
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
  this._service.getData('/course').subscribe((res: any) => {
    this.courseDataTmp = res.data;
    this.courseData = [];
    for ( let i = 0 ; i <  this.courseDataTmp.length; i ++) {
      const item = {label:  this.courseDataTmp[i].course_name, value:  this.courseDataTmp[i].id};
      this.courseData.push(item);
    }
  });
  return this.courseData;
}
getData() {
  this._service.getData('/lesson').subscribe((res) => {
    this.lessonData = res.data;
    for ( let i = 0 ; i < this.lessonData.length; i ++) {
      this.lessonData[i].lesson_detail =  atob(this.lessonData[i].lesson_detail);
    }
  });
}
reset() {
  this.formG.reset();
  this.imgView = null;
  this.imgData = null;
  this.lesson_id = null;
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
  this.courseData =  this.getDataCategery();
}

courseView(event: any) {
  this._service.getData('/lessonByCourse/' + event.value).subscribe((res) => {
    this.lessonData = res.data;
    for ( let i = 0 ; i < this.lessonData.length; i ++) {
      this.lessonData[i].lesson_detail =  atob(this.lessonData[i].lesson_detail);
    }
  });
}
}
