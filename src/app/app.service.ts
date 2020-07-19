import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { ipcRenderer } from 'electron';
import { Rect } from './interfaces/rect.interface';

export enum AppAction {
  ENABLE_EDIT,
  DISABLE_EDIT,
  HIDE_INTERFACE,
  SHOW_INTERFACE
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public imageRect: BehaviorSubject<Rect> = new BehaviorSubject({ x: 0, y: 0 });
  private appEventSource: Subject<AppAction> = new Subject();
  public appEvent$: Observable<AppAction> = this.appEventSource.asObservable();

  constructor( zone: NgZone ) {

    ipcRenderer.on('action', (e, message: AppAction) => {
      // Coming from Electron, force to run in Angular zone.
      zone.run(() => {
        this.appEventSource.next( message );
      });
    });

  }

}
