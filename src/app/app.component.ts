import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'design-tracer';

  constructor( public app: AppService )
  {
  }

  imageMoved(e): void {
    this.app.imageRect.next(e);
  }
}
