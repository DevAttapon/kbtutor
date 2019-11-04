import { Component, OnInit } from '@angular/core';
import { AppService } from '../_services';
import { FormControl, FormGroup } from '@angular/forms';
declare var $: any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetChk =  false;
  constructor(
    private _serveice : AppService
  ) { }

  resetForm = new FormGroup({
    email : new  FormControl()
  });

  ngOnInit() {   
   
  }
  modalHide() {
    $('#exampleModalCenter').modal('hide');
    $('#reSetModal').appendTo("body").modal('show');
  }
  // getImage(url: string):any {
  //   return new Promise(resolve => {
  //     this.http.get(this._BASE_API + url).subscribe((res: any) => {
  //       resolve(this._BASE_API_FILE +res.path);
  //     });
  //   });
  getUser(email: any) {
    return new Promise(resolve => {
      this._serveice.postData('/getEmail',{email: email}).subscribe((res: any)=> {
        console.log(res.data.length );
        if(res.data.length > 0) {
          resolve(  this.resetChk = false);
        }else{
          resolve(  this.resetChk = true);
        }
      });
    });
  }
  resetPass(){
    this.getUser(this.resetForm.value.email).then(()=>{
      console.log(this.resetChk);
      if(this.resetChk === false){
        this._serveice.postData('/sendPasswordResetLink',{email: this.resetForm.value.email}).subscribe((res)=>{
          Swal.fire(
            'สำเร็จ',
            'Link สำหรับเปลี่ยนรหัสผ่านได้ส่งไปที่ อีเมลล์ของท่าน กรุณาตรวจสอบอีเมลล์ของท่าน.',
            'success'
          ).then((result)=> {
            window.location.href = '/';
          });
         
        });
      }
    });
  
  }

}
