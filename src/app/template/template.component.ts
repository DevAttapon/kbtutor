import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import {MenuItem} from 'primeng/api';
declare var $: any;
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';
import { first } from 'rxjs/operators';
import { AppService } from '../_services';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  passConfirm: boolean = false;
  resetPassConfirm: boolean = false;
  old_pass_chk = false;
  old_pass_chk_text: any;
  currentUser: User;
  loginError: any = null;
  items: MenuItem[];
  chkForm = true;
  userAuth = false;
  userAdmin: any
  forbiddenUsernames: any[] = ['bamossza', 'admin', 'superadmin'];
  historyData: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private _service: AppService,
) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if(this.currentUser) {
      this.userAuth = true;
      this. history();
    }
    
}

loginForm = new FormGroup({
  username : new FormControl(),
  password: new FormControl()
}
);

registerForm = new FormGroup({
  name : new FormControl(null,[Validators.required,this.forbiddenNames.bind(this)]),
  surname : new FormControl(),
  email: new FormControl(null,Validators.required),
  password: new FormControl(null,[Validators.required,Validators.minLength(6)]),
  password_confirmation: new FormControl(null,Validators.required)
});

reseetPaswordForm = new FormGroup({
  old_pass: new FormControl(null,Validators.required),
  new_pass: new FormControl(null,[Validators.required,Validators.minLength(6)]),
  new_pass_comfrim: new FormControl(null,Validators.required)
});

searchFrom = new FormGroup({
  text: new FormControl()
});
  ngOnInit() {
    this.items = [
      {
          label: 'File',
          items: [{
                  label: 'New',
                  icon: 'pi pi-fw pi-plus',
                  items: [
                      {label: 'Project'},
                      {label: 'Other'},
                  ]
              },
              {label: 'Open'},
              {label: 'Quit'}
          ]
      },
      {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          items: [
              {label: 'Delete', icon: 'pi pi-fw pi-trash'},
              {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
          ]
      }
  ];
  }

  history(){
      this._service.getData('/orderHistory/'+ this.currentUser.id).subscribe((res)=> {
          this.historyData = res.pay;
      });
  }
  search() {
    const toUrl = '/search';
    this.router.navigate([toUrl,this.searchFrom.value.text]);
    this.searchFrom.reset();   
  
  }

  userLogin (): void {

    const username =  this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.loginAuthen(username, password);

  }
  userLogout(): void {
    this.authenticationService.logout();
    this.userAuth = false;
   // this.router.navigate(['/']);
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
          
          }
          
      },
      error => {
        //  error condition here
      });
}

  myFunction () {
    const x = document.getElementById('myTopnav');
    if (x.className === 'topnav') {
      x.className += ' responsive';
      // $('.topnav.responsive a ').slideDown(1000);

    } else {
      x.className = 'topnav';
    }
  }


  formToggle () {
      if (this.chkForm) {
        this.chkForm = false;
      } else {
        this.chkForm = true;
      }
  }

  passwordConfirm() {
     if ( this.registerForm.value.password !== this.registerForm.value.password_confirmation) {
       this.passConfirm = true;
     }else {
       this.passConfirm = false;
     }
  }

  resetpassword() { Swal.fire({
    title: 'ต้องการเปลี่ยนรหัสผ่าน หรือไม่?',
    text: '',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f821b',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.value) {
      const  data = {
        current: this.reseetPaswordForm.value.old_pass,
        password: this.reseetPaswordForm.value.new_pass
      };
      this._service.postData('/changePassword', data).subscribe((res)=> {
          if(res.errors) {
            this.old_pass_chk = true;
            this.old_pass_chk_text = res.errors.current[0];
          }else {
            this.old_pass_chk = false;
            this.old_pass_chk_text = null;


            Swal.fire(
              'เปลี่ยนรหัสผ่านเรียบร้อย!',
              'กรุณาเข้าสู่ระบบใหม่อีกครั้ง.',
              'success'
            );

            this.authenticationService.logout();
          } 


      });
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

  modalHide() {
    $('#exampleModalCenter').modal('dispose');
    // $('#exampleModalCenter').modal('hide')
  }

}
