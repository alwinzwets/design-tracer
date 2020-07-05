import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
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

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent): void {
    switch (e.key){
      case '+':
        this.changeOpacity(.1);
        break;
      case '-':
        this.changeOpacity(-.1);
        break;
    }
  }

  constructor( private controls: ControlsService ) { }

  ngAfterViewInit(): void {

    this.setSliderPosition();
    // TODO: Sometimes the slider is not properly calculated at this point.
    // Quick fix for now is to calculate a second time after a delay.
    // Should be fixed properly.
    timer(500).subscribe(() => this.setSliderPosition());
  }

  setSliderPosition(): void {
    const handleRect = this.handle.nativeElement.getBoundingClientRect();
    const movementAreaRect = this.movementArea.nativeElement.getBoundingClientRect();
    this.handlePosition = {
      x: Math.floor(handleRect.width / 2 + ( (movementAreaRect.width - (handleRect.width)) * this.controls.opacity.getValue())),
      y: 0
    };
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

  changeOpacity(n: number): void {
    const rounded = Math.round( this.controls.opacity.getValue() * 10 ) / 10;
    let next = rounded + n;
    next = next < 0 ? 0 : next > 1 ? 1 : next;
    this.controls.opacity.next( next );
    this.setSliderPosition();
  }

}
