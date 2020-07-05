import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { ResizeElementComponent } from './resizer/resize-element/resize-element.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'design-tracer';
  opacity: number;
  image = 'https://source.unsplash.com/random/800x600';

  @ViewChild('resize') resize: ResizeElementComponent;

  constructor( public app: AppService )
  {
  }

  imageMoved(e): void {
    this.app.imageRect.next(e);
  }

  changeOpacity(e: number): void {
    console.log(e);
    this.opacity = e;
  }

  changeImage(e: string): void {
    this.image = e;
  }

  setFullsize(): void {
    this.resize.setFullsize();
  }
}
