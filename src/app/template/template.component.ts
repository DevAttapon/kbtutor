import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import {MenuItem} from 'primeng/api';
import $ from 'jquery';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';
import { first } from 'rxjs/operators';
import { AppService } from '../_services';
import { formControlBinding } from '@angular/forms/src/directives/ng_model';



@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  passConfirm: boolean = false;
  currentUser: User;
  loginError: any = null;
  items: MenuItem[];
  chkForm = true;
  userAuth = false;
  forbiddenUsernames: any[] = ['bamossza', 'admin', 'superadmin'];
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
    console.log('comfiem', this.registerForm);
     if ( this.registerForm.value.password !== this.registerForm.value.password_confirmation) {
       this.passConfirm = true;
     }else {
       this.passConfirm = false;
     }
  }


}
