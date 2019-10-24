import { Component, OnInit,Input } from '@angular/core';
import { AppService } from '../_services';
declare var $: any;
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  @Input() videoType: any;
  @Input() videoSrc: any;
  @Input() videoTitle: any;
  videoPlayer: any;
  constructor(
    private _service : AppService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.videoPath(this.videoSrc);
  }

  videoPath(filename: any) {
    this._service.getImage('/getBearer/'+filename).then((value) =>  this.videoPlayer  = value);      
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
