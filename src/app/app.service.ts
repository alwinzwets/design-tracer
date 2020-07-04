import { Injectable } from '@angular/core';
import { Rect } from './resizer/resize-element/resize-element.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public imageRect: BehaviorSubject<Rect> = new BehaviorSubject({ x: 0, y: 0 });

  constructor() { }

}
