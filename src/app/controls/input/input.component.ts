import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Rect } from 'src/app/resizer/resize-element/resize-element.component';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() label: string;
  positionModel: Rect;

  constructor( public controls: ControlsService ) { }

  ngOnInit(): void {
  }

}
