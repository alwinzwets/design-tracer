import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Rect } from 'src/app/resizer/resize-element/resize-element.component';
import { BehaviorSubject } from 'rxjs';
import { ControlsService } from './../controls.service';
@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {

  @Input() set position(rect: BehaviorSubject<Rect>) {
    rect.subscribe({
      next: (p: Rect) => this.controlsService.imageRect = p
    });
  }

  @Output() opacity = new EventEmitter();

  constructor( private controlsService: ControlsService ) {
    this.controlsService.opacity.subscribe({
      next: (o: number) => this.opacity.emit(o)
    });
  }

  ngOnInit(): void {
  }


}
