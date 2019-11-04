import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services';
import { AppService } from './../../_services/app.service';
import { User } from 'src/app/_models/user';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashborad',
  templateUrl: './dashborad.component.html',
  styleUrls: ['./dashborad.component.scss']
})
export class DashboradComponent implements OnInit {

  visibleSidebar1 = true;
  currentUser: User;
  userAuth: boolean;
    imgView: any;
  payData: any;
  payDataConfirm: any;
  constructor( 
    private _service : AppService,
    private authenticationService: AuthenticationService,
    ) {

      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      if(this.currentUser) {
        this.userAuth = true;
      }
     }
  ngOnInit() {
    this.getPaydata ();
    this.getPaydataConfirm ();
  }

  getPaydata (){
    this._service.getData('/PayList').subscribe((res: any)=> {
        this.payData  = res.data;

        for(let i =0 ;i< res.data.length;i++) {         
          this._service.getImage('/getImage/'+res.data[i].pay_pic).then((value) =>  this.payData[i].updated_at  = value);        
        }         
    });
  }
  getPaydataConfirm (){
    this._service.getData('/PayListConfirm').subscribe((res: any)=> {
        this.payDataConfirm  = res.data;

        for(let i =0 ;i< res.data.length;i++) {         
          this._service.getImage('/getImage/'+res.data[i].pay_pic).then((value) =>  this.payDataConfirm[i].updated_at  = value);        
        }         
    });
  }
  showImg(img: any){
      this.imgView = img;
  }


   paymentConfiem(id: any){
    Swal.fire({
      title: 'ต้องการยืนยันการชำระเงิน หรือไม่?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f821b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        const data = {
          id: id,
          pay_status: 1
        }
        this._service.postData('/payStatus', data).subscribe((res) => {
          Swal.fire(
            'ยืนยันการชำระเงินเรียบร้อย!',
            '',
            'success'
          );
          this.getPaydata ();
          this.getPaydataConfirm ();
        });
      
      }
    });
   } 
}
