import { Component, OnInit, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AppService, AppAction } from './app.service';
import { ResizeElementComponent} from './resizer/resize-element/resize-element.component';
import { Rect } from './interfaces/rect.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'design-tracer';
  opacity: number;
  image;
  show = true;
  showInterface = true;

  @ViewChild('resize') resize: ResizeElementComponent;

  constructor( public app: AppService )
  {
  }

  ngOnInit(): void {
    this.app.appEvent$
      .pipe(
        filter( (action: AppAction) => [AppAction.ENABLE_EDIT, AppAction.DISABLE_EDIT].includes(action) )
      )
      .subscribe({
        next: (action: AppAction) => {
          this.setInterface( action === AppAction.ENABLE_EDIT );
        }
      });

    this.app.appEvent$
      .pipe(
        filter( (action: AppAction) => [AppAction.SHOW_INTERFACE, AppAction.HIDE_INTERFACE].includes(action) ),
        // delayWhen( (action: AppAction) => action === AppAction.HIDE_INTERFACE ? timer(1000) : of(action) )
      )
      .subscribe({
        next: (action: AppAction) => {
          console.log('setting visibility');
          this.setVisibility( action === AppAction.SHOW_INTERFACE );
        }
      });
  }

  imageMoved(e: Rect): void {
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

  toggleInterface(): void {
    this.showInterface = !this.showInterface;
  }

  toggleVisibility(): void {
    this.show = !this.show;
  }

  setInterface( state: boolean ): void {
    this.showInterface = state;
  }

  setVisibility( state: boolean ): void {
    this.show = state;
  }
}
