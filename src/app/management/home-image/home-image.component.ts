import { AppService } from './../../_services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpRequest, HttpClient, HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/_services';
import { User } from 'src/app/_models/user';
@Component({
  selector: 'app-home-image',
  templateUrl: './home-image.component.html',
  styleUrls: ['./home-image.component.scss']
})
export class HomeImageComponent implements OnInit {

  file: any;
  uploadResponse = { status: '', message: '', filePath: '' };
  Uploading: boolean = false;
  UploadData: any;
  currentUser: User;
  userAuth = false;
  
  dataImage: any;
  imgView: any;

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
    this.getData ();
      
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.UploadData = file;
    }
  }
  onUpload() {

    this.Uploading = true;
     const formData = new FormData();
     formData.append('image',  this.UploadData);
    
   
     this._service.upload('/newTitleImage', formData).subscribe(
       (res) => {
       
         if (res.message === 100) {
           this.Uploading = false;
           this.uploadResponse.status = 'success';
           Swal.fire(
             'เพิ่มข้อมูลเรียบร้อย.',
             'กดปุ่มเพื่อปิด',
             'success'
           );
           this.getData ();
         }
       } ,
       (err) => {}
     );
   }

   getData (){
     this._service.getData('/TitleImage').subscribe((res: any)=> {
          this.dataImage = res.data;
          for(let i =0 ;i< res.data.length;i++) {         
            this._service.getImage('/getImage/'+res.data[i].title_image).then((value) =>  this.dataImage[i].updated_at  = value);        
          }   
     });
   }
   onDelete(id : any){
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
      
        this._service.getData('/TitleImageDel/' + id).subscribe((res: any)=> {
          Swal.fire(
            'ลบข้อมูลเรียบร้อย!',
            '',
            'success'
          );
          this.getData ();
         
        });
      
      }
    });
   
   }

   showImg(img: any){
    this.imgView = img;
}
}
