import { Component, OnInit } from '@angular/core';
import { AppService, AuthenticationService } from '../_services';
import { User } from '../_models/user';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit {
  currentUser: User;
  addressData: any;
  constructor(
    private authenticationService: AuthenticationService,
    private _service : AppService
  ) { 

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  profileForm = new FormGroup({
    email: new FormControl(),
    name: new FormControl(),
    address: new FormControl(),
    tumbon: new FormControl(),
    amphur: new FormControl(),
    province: new FormControl(),
    postCode: new FormControl(),
    tel: new FormControl()
  });

  ngOnInit() {
    this.getUser();
    this.getAddress();
  }


  getUser() {
    this._service.getData('/manageUser/'+this.currentUser.id).subscribe((res: any)=> {
        this.profileForm.controls.name.setValue(res.data.name);
        this.profileForm.controls.email.setValue(res.data.email);
    });
  }

getAddress()
{
  this._service.getData('/addressByUsername/'+this.currentUser.id).subscribe((res: any)=>{
     this.addressData = res.data;
    
      if(res.data.length > 0 ){
         this.profileForm.controls.address.setValue(res.data[0].address);
         this.profileForm.controls.tumbon.setValue(res.data[0].subdistrict);
         this.profileForm.controls.amphur.setValue(res.data[0].	district);
         this.profileForm.controls.province.setValue(res.data[0].province);
         this.profileForm.controls.postCode.setValue(res.data[0].	zipcode);
         this.profileForm.controls.tel.setValue(res.data[0].tel);
      }

  });
}

  updateProfile() {
    const data = {
      name: this.profileForm.value.name
    }
    this._service.putData('/manageUser/'+this.currentUser.id,data).subscribe(res=> {
      if(res.message === 'Update Profile Success') {
            const dataAddress = {
              address: this.profileForm.value.address,
              subdistrict: this.profileForm.value.tumbon,
              district: this.profileForm.value.amphur,
              province: this.profileForm.value.province,
              zipcode: this.profileForm.value.postCode,
              tel: this.profileForm.value.tel,
              username: this.currentUser.id
            };
            if(this.addressData.length > 0){
              this._service.putData('/address/'+this.addressData[0].id, dataAddress).subscribe((res: any) => {
                Swal.fire(
                  'แก้ไขข้อมูลเรียบร้อย.',
                  'กดปุ่มเพื่อปิด',
                  'success'
                );
                this.currentUser.user = this.profileForm.value.name;
                this.getUser();
                this.getAddress();
              });
            }else{
              this._service.postData('/address', dataAddress).subscribe((res: any) => {
                Swal.fire(
                  'แก้ไขข้อมูลเรียบร้อย.',
                  'กดปุ่มเพื่อปิด',
                  'success'
                );
                this.currentUser.user = this.profileForm.value.name;
                this.getUser();
                this.getAddress();
              });
            }
         
       
      }
     
    });
  }
}

