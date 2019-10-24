import { Component, OnInit,Input } from '@angular/core';
import { AppService } from 'src/app/_services';

@Component({
  selector: 'app-course-categoey',
  templateUrl: './course-categoey.component.html',
  styleUrls: ['./course-categoey.component.scss']
})
export class CourseCategoeyComponent implements OnInit {
@Input() categoryID: any;
courseData: any;
  constructor(
    private _service: AppService
  ) {
   this.callMethod(1);
   }

  ngOnInit() {
  }
  
  callMethod(id: any ){
    this._service.getData('/courseByCategory/'+id).subscribe((res: any) => {
      this.courseData = res.data;
        for(let i =0 ;i< res.data.length;i++) {         
          this._service.getImage('/getImage/'+res.data[i].course_pic).then((value) =>  this.courseData[i].course_pic  = value);        
        }         
    });
  }

}
