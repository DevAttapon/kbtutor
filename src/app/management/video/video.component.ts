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
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  form: FormGroup;
  error: string;
  userId: number = 1;
  uploadResponse = { status: '', message: '', filePath: '' };
  Uploading: boolean = false;

  videoPath: any;
  videoType: any;
  videoPlayer: any;

  courseData: SelectItem[];
  lessonData: SelectItem[];
  courseDataTmp: any;
  lessonDataTmp: any;
  videoData: any;
  video_id: any = null;
  imgView: any ;
  imgData: any ;
  videoUploadData: any;

  progress: number;
  message: string;
    formG = new FormGroup({
      course_id :  new FormControl(),
      lesson_id :  new FormControl(),
      video_name :  new FormControl('', Validators.required),
      video_detail : new FormControl(),
      video_link : new FormControl(),
      username : new FormControl(),
    });
  formBuilder: any;
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
    video_name: this.formG.value.video_name,
    video_price: this.formG.value.video_price,
    video_price_pro: this.formG.value.video_price_pro,
    video_detail: this.formG.value.video_name,
    video_pic: this.formG.value.video_pic,
    username: this.currentUser.id
  };
if ( this.video_id === null ) {
  this._service.postData('/video', data).subscribe((res) => {
    Swal.fire(
      'แก้ไขข้อมูลเรียบร้อย.',
      'กดปุ่มเพื่อปิด',
      'success'
    );
    this.getData();
    this.reset();
  });
} else {
  this._service.putData('/video/' + this.video_id, data).subscribe((res) => {
    Swal.fire(
      'เพิ่มข้อมูลเรียบร้อย.',
      'กดปุ่มเพื่อปิด',
      'success'
    );
    this.getData();
    this.reset();
  });
}

}

onUpdate(id: any) {

  this._service.getData('/video/' + id).subscribe((res) => {
  //  this.formG.controls.video.setValue(res.data.video_name);
  this._service.getImage('/getImage/'+res.data.video_link).then((value) =>  this.videoPath  = value);   
  this.videoPlayer  = ' <video id="player" width="550" controls  controlsList="nodownload" > <source src="'+this.videoPath+'" type="'+this.videoType+'"> </video>';
   this.videoType = res.data.video_type;
   this.video_id = res.data.id;
   this.getDatalesson(res.data.course_id);
   this.formG.controls.video_name.setValue(res.data.video_detail);
   this.formG.controls.video_detail.setValue(atob(res.data.video_detail));
   this.formG.controls.username.setValue(res.data.username);
   this.formG.controls.course_id.setValue(res.data.course_id);
   this.formG.controls.lesson_id.setValue(res.data.lesson_id);
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
      this._service.delData('/video/' + id).subscribe((res) => {
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
getDatalesson(id : any): any {
  this._service.getData('/lessonByCourse/' + id).subscribe((res: any) => {
    this.lessonDataTmp = res.data;
    this.lessonData = [];
    for ( let i = 0 ; i <  this.lessonDataTmp.length; i ++) {
      const item = {label:  this.lessonDataTmp[i].lesson_name, value:  this.lessonDataTmp[i].id};
      this.lessonData.push(item);
    }
  });
  return this.courseData;
}
getData() {
  this._service.getData('/video').subscribe((res) => {
    this.videoData = res.data;
    // for ( let i = 0 ; i < this.videoData.length; i ++) {
    //   this.videoData[i].video_detail =  atob(this.videoData[i].video_detail);
    // }
  });
}
reset() {
  this.formG.reset();
  this.imgView = null;
  this.imgData = null;
  this.video_id = null;
}

onFileChanged(event) {
  this.imgData = event[0];
  const reader = new FileReader();
  // if (event.target.files && event.target.files.length > 0) {
    const file = event[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
     this.imgView = reader.result;
      console.log(reader.result);
    };
}
onFileChange(event) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.videoUploadData = file;
  }
}

onUpload() {

 this.Uploading = true;
  const formData = new FormData();
  formData.append('video_link',  this.videoUploadData);
  formData.append('video_detail', this.formG.value.video_name);
  formData.append('video_status', 'status');
  formData.append('username', 'Admin');
  formData.append('course_id', this.formG.value.course_id);
  formData.append('lesson_id', this.formG.value.lesson_id);
  // formData.append('file', this.form.get('avatar').value);

  this._service.upload('/video', formData).subscribe(
    (res) => {
      this.uploadResponse = res;
      if (res.message === 100) {
        this.Uploading = false;
        this.uploadResponse.status = 'success';
        Swal.fire(
          'เพิ่มข้อมูลเรียบร้อย.',
          'กดปุ่มเพื่อปิด',
          'success'
        );
      }
    } ,
    (err) => this.error = err
  );
}
AddRow() {

}
dropClickCourse(event :any ) {
  this.courseData = this.getDataCategery();
  this.getDatalesson(event.value);
}

  dropClickLesson(event: any) {
    this._service.getData('/videoByLesson/ ' + event.value).subscribe((res) => {
      this.videoData = res.data;    
    });
  }
}
