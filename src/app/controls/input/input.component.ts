import { Component, OnInit, Input } from '@angular/core';
import { ControlsService } from '../controls.service';
import { Rect } from 'app/interfaces/rect.interface';

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
