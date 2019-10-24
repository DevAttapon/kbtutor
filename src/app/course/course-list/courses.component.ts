import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/_services';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  visibleSidebar2: any;
  courseList: any;
  categoryID: any;
  constructor(
    private _service: AppService
  ) { }

  ngOnInit() {
    this.getCategoryList();
  }

  getCategoryList() {
    this._service.getData('/category').subscribe((res: any) => {
      console.log(res.data);    
      this.courseList = res.data;
    });
  }

  selectCategory(item: any) {
        this.categoryID = item.id;
  }

}
