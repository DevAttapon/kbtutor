import { Component, OnInit } from '@angular/core';
import { AppService, AuthenticationService } from 'src/app/_services';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from 'src/app/_models/user';
declare var $: any;
@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
    courseData : any;
    currentUser: User;
    userAuth = false;
    myCourse: any;
    videoRule = false;
  constructor(
    private _service: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { 
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if(this.currentUser) {
      this.userAuth = true;
    }
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    let id = this.route.snapshot.paramMap.get('id');
    this.getData(id);
    this. getMycourse (id);

  }
  testVideo(){
    this._service.VideoPlayer('/getBearer/4hxoXf039WbALTT30Gh0W7Ulde1GujIIx2Q72tOv.mp4').subscribe((res: any)=> {
      console.log(res);
    });
  }
  getData(id: any){
    this._service.getData('/fullCourse/'+id).subscribe((res: any)=> {
           this.courseData = res.course[0];               
          this._service.getImage('/getImage/'+res.course[0].course_pic).then((value) =>  this.courseData.course_pic  = value);        
        
    });
  }

 getMycourse (courseID: any){
  this._service.getData('/orderHistory/'+ this.currentUser.id).subscribe((res)=> {
    this.myCourse = res.pay;
    this.myCourse.forEach(ele => {
      console.log('courseID : '+ele.course[0].id);
      console.log('courseID : '+courseID);
      console.log('pay_status : '+ele.pay_status);
      if(ele.course[0].id == courseID && ele.pay_status == '1'){
        console.log('in if ');
        this.videoRule = true;
      }    
    });
  });
 }


  detailTaggle(event: any): void {
    if (event) {
      $('#detail-content').css('height', 'auto');
      $('#detail-content').css('-webkit-mask-image', '-webkit-linear-gradient(top, #ffff 100%, #ffff 100%, #0000 100%)');
      $('.readhide').show();
      $('.readmore').hide();
    } else {
      $('#detail-content').css('height', '250px');
      $('#detail-content').css('-webkit-mask-image', '-webkit-linear-gradient(top, #ffff 20%, #ffff 20%, #0000 90%)');
      $('.readhide').hide();
      $('.readmore').show();
    }

  }

  closeModal (): void {
    $('#player').attr('src', 'https://www.youtube.com/embed/2KAoS9fHGlY');
  }


}
