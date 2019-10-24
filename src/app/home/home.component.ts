import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const slider: any = document.querySelector('.items');
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e: any) => {
          isDown = true;
          slider.classList.add('active');
          startX = e.pageX - slider.offsetLeft;
          scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
          isDown = false;
          slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
          isDown = false;
          slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e: any) => {
          if ( !isDown) { return; }
          e.preventDefault();
          const x = e.pageX - slider.offsetLeft;
          const walk = (x - startX) * 1;
          slider.scrollLeft = scrollLeft - walk;

        });



        ///////////////////////////////////////////////////////////////////////

        const slider2: any = document.querySelector('.items.items-2');
        let isDown2 = false;
        let startX2;
        let scrollLeft2;

        slider2.addEventListener('mousedown', (e : any) => {
          isDown2 = true;
          slider2.classList.add('active');
          startX2 = e.pageX - slider2.offsetLeft;
          scrollLeft2 = slider2.scrollLeft;
        });
        slider2.addEventListener('mouseleave', () => {
          isDown2 = false;
          slider2.classList.remove('active');
        });
        slider2.addEventListener('mouseup', () => {
          isDown2 = false;
          slider2.classList.remove('active');
        });
        slider2.addEventListener('mousemove', (e: any) => {
          if ( !isDown2) { return; }
          e.preventDefault();
          const x = e.pageX - slider2.offsetLeft;
          const walk = (x - startX2) * 2;
          slider2.scrollLeft = scrollLeft2 - walk;
        });
;

  }

}
