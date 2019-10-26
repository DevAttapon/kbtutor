import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AppService } from '../_services';
@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.scss']
})
export class SearchDetailComponent implements OnInit {
    courseData: any[] ;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _service: AppService
  ) {
   
   }

  ngOnInit() {
    window.scrollTo(0, 0);
    let name = this.route.snapshot.paramMap.get('name');
    this.searchData(name);
  }

  searchData(search: any) {
    
    this._service.getData('/courseByName/'+ search).subscribe((res) => {
      this.courseData = res.data;   
      for(let i =0 ;i< res.data.length;i++) {         
        this._service.getImage('/getImage/'+res.data[i].course_pic).then((value) =>  this.courseData[i].course_pic  = value);        
      }  
    });
  }

}
