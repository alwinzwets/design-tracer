import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Rect } from 'app/interfaces/rect.interface';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {

  public imageRect: Rect = { x: 0, y: 0 };
  public opacity: BehaviorSubject<number> = new BehaviorSubject(1);
  public image: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() { }

}
