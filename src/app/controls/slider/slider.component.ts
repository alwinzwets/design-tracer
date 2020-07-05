import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ControlsService } from '../controls.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements AfterViewInit {

  @ViewChild('movementArea') movementArea: ElementRef;
  @ViewChild('handle') handle: ElementRef;

  handlePosition: { x: number, y: number } = { x: 0, y: 0 };

  constructor( private controls: ControlsService ) { }


  ngAfterViewInit(): void {
    this.setSliderPosition();
  }

  setSliderPosition(): void {
    const handleRect = this.handle.nativeElement.getBoundingClientRect();
    const movementAreaRect = this.movementArea.nativeElement.getBoundingClientRect();
    this.handlePosition.x = Math.floor(movementAreaRect.width + handleRect.width / 2) * this.controls.opacity.getValue();
  }

  movedHandle(e): void {
    const handleRect = this.handle.nativeElement.getBoundingClientRect();
    const movementAreaRect = this.movementArea.nativeElement.getBoundingClientRect();
    this.controls.opacity.next( (handleRect.x - movementAreaRect.x) / (movementAreaRect.width - handleRect.width) );
  }

  getClipPath(): string {
    const opacity = this.controls.opacity.getValue();
    return `polygon(0 0, ${opacity * 100}% 0, ${opacity * 100}% 100%, 0% 100%)`;
  }

}
