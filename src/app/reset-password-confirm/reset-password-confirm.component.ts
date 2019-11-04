import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService, AuthenticationService } from '../_services';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.scss']
})
export class ResetPasswordConfirmComponent implements OnInit {
  resetPassConfirm: boolean = false;
  emailToken: any;
  UserEmail: any;
  reseetPaswordForm = new FormGroup({
    new_pass: new FormControl(null,[Validators.required,Validators.minLength(6)]),
    new_pass_comfrim: new FormControl(null,Validators.required)
  });
  constructor(
    private _service : AppService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.emailToken = this.route.snapshot.paramMap.get('id');

  }

  resetpassword() { 
    this.getEmailWithRefeshToken();
 
      const  data = {
        email: this.UserEmail,
        resetToken:  this.emailToken,
        password: this.reseetPaswordForm.value.new_pass,
      };
      this._service.postData('/resetPassword', data).subscribe((res)=> {     
        if(res.data){
          Swal.fire(
            'เปลี่ยนรหัสผ่านเรียบร้อย!',
            'กรุณาเข้าสู่ระบบใหม่อีกครั้ง.',
            'success'
          );
          this.authenticationService.logout();        
        }    
           
        });

  }
  resetPasswordConfirm() {
     if ( this.reseetPaswordForm.value.new_pass !== this.reseetPaswordForm.value.new_pass_comfrim) {
       this.resetPassConfirm = true;
     }else {
       this.resetPassConfirm = false;
     }
  }

  getEmailWithRefeshToken() {
    this._service.getData('/getEmailWithRefrashToken/'+ this.emailToken).subscribe((res: any)=> {
      if(res.data.length > 0){
        this.UserEmail = res.data[0].email;
      }
      
    });
  }

}
