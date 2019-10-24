import { AppService } from './../../_services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpRequest, HttpClient, HttpEventType } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  file: any;
  categoryData: any;
  category_id: any = null;

  progress: number;
  message: string;
    formG = new FormGroup({
      category :  new FormControl('', Validators.required)
    });

  constructor(
    private http: HttpClient,
    private _service: AppService
    ) { }

  ngOnInit() {
      this.getData();
  }


  onSubmit() {
    const data = {
      category_name: this.formG.value.category,
      username: 'Admin'
    };
    if (this.category_id != null) {
      this._service.putData('/category/' + this.category_id, data).subscribe((res) => {
        Swal.fire(
          'แก้ไขข้อมูลเรียบร้อย.',
          'กดปุ่มเพื่อปิด',
          'success'
        );
        this.getData();
        this.reset();
      });
    } else {
      this._service.postData('/category', data).subscribe((res) => {
        Swal.fire(
          'เพิ่มข้อมูลเรียบร้อย.',
          'กดปุ่มเพื่อปิด',
          'success'
        );
        this.getData();
      });
    }

  }



  onUpdate(id: any) {
    this._service.getData('/category/' + id).subscribe((res) => {
     this.formG.controls.category.setValue(res.data.category_name);
     this.category_id = res.data.id;
    });
  }
  onDelete(id: any) {
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
        this._service.delData('/category/' + id).subscribe((res) => {
          Swal.fire(
            'ลบข้อมูลเรียบร้อย!',
            '',
            'success'
          );
          this.getData();
        });

      }
    });

  }


  getData() {
    this._service.getData('/category').subscribe((res) => {
      this.categoryData = res.data;
    });
  }
  reset() {
    this.formG.reset();
    this.category_id = null;
  }

  // uploadFile (files) {
  //      const formData = new FormData();
  //   if (files) {
  //     for (const file of files) {
  //       console.log('File : ', file);
  //       formData.append(file.name, file);
  //     }
  //   }

  //   const uploadReq = new HttpRequest('POST', 'https://localhost:8000/api/category', formData, {
  //     reportProgress: true,
  //   });

  //   this.http.request(uploadReq).subscribe(event => {
  //     if (event.type === HttpEventType.UploadProgress) {
  //       this.progress = Math.round(100 * event.loaded / event.total);
  //       console.log(this.progress);
  //     } else if (event.type === HttpEventType.Response) {
  //       this.message = event.body.toString();

  //     }
  //   });

  // }

}
