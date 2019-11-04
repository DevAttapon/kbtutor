import { Component, OnInit } from '@angular/core';
import { AppService, AuthenticationService } from '../_services';
import { User } from '../_models/user';
declare var $: any;
@Component({
  selector: 'app-user-course',
  templateUrl: './user-course.component.html',
  styleUrls: ['./user-course.component.scss']
})
export class UserCourseComponent implements OnInit {
  currentUser: User;
  userAuth = false;
  mycourse: any;
  constructor(
    private _service: AppService,
    private authenticationService: AuthenticationService,
  ) { 

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if(this.currentUser) {
      this.userAuth = true;
    }
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getmyCourse();
  }

  getmyCourse() {
    this._service.getData('/courseByUsername/'+this.currentUser.id).subscribe((res)=> {
          // console.log('my course : ', res);
          this.mycourse = res.data[0];
          for(let i =0 ;i< res.data.length;i++) {         
            this._service.getImage('/getImage/'+res.data[i].course_pic).then((value) =>  this.mycourse[i].course_pic  = value);        
          }    
    });
  }

}
