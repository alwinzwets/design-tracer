import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { CdkDragMove, CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Rect } from 'app/interfaces/rect.interface';

@Component({
  selector: 'app-resize-element',
  templateUrl: './resize-element.component.html',
  styleUrls: ['./resize-element.component.scss']
})
export class ResizeElementComponent implements OnInit {


  // Inputs
  @Input() set src(s: string) {

    // if(!s) return;

    this.source = s;

    // On changing source image, load the image in a
    // shadow element to get the original dimensions.
    const sampler = new Image();
    sampler.src = s;
    sampler.onload = () => {
      this.originalResolution = {
        width: sampler.width,
        height: sampler.height
      };

      this.calculateMaximumDimensions();
    };
  }
  @Input() opacity: number;
  @Input() showInterface = true;

  // Outputs
  @Output() moved = new EventEmitter();

  @ViewChild('container') container: ElementRef;
  @ViewChild('img') img: ElementRef;

  source: string;
  originalResolution: Rect;
  startingDimensions: Rect;
  startingPosition: Rect;
  transformGui: Rect;
  corner: string;
  containerRect: Rect = { x: 0, y: 0 };

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent): void {

    const amplifier = e.shiftKey ? 10 : 1;
    switch (e.key){
      case 'ArrowLeft':
        this.move(-1 * amplifier, 0);
        break;
      case 'ArrowUp':
        this.move(0, -1 * amplifier);
        break;
      case 'ArrowRight':
        this.move(1 * amplifier, 0);
        break;
      case 'ArrowDown':
        this.move(0, 1 * amplifier);
        break;
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

  setGui(): void {

    const rect = this.img.nativeElement.getBoundingClientRect();

    this.transformGui = {
      x: rect.x - this.containerRect.x,
      y: rect.y - this.containerRect.y,
      width: rect.width,
      height: rect.height,
    };

  }

  started(e: CdkDragStart): void {
    this.startingPosition = {
      x: this.img.nativeElement.offsetX,
      y: this.img.nativeElement.offsetY,
      width: this.img.nativeElement.width,
      height: this.img.nativeElement.height,
    };

    if ( e.source.element.nativeElement.classList.contains('tl') ) {
      this.corner = 'tl';
      this.img.nativeElement.style.transformOrigin = 'bottom right';
    }
    else if ( e.source.element.nativeElement.classList.contains('tr') ) {
      this.corner = 'tr';
      this.img.nativeElement.style.transformOrigin = 'bottom left';
    }
    else if ( e.source.element.nativeElement.classList.contains('bl') ) {
      this.corner = 'bl';
      this.img.nativeElement.style.transformOrigin = 'top right';
    }
    else if ( e.source.element.nativeElement.classList.contains('br') ) {
      this.corner = 'br';
      this.img.nativeElement.style.transformOrigin = 'top left';
    }
  }

  dragged(e: CdkDragMove): void {

    // Calculate distance between starting point and current point.
    const diagonalLength =  Math.sqrt( Math.pow(this.startingPosition.width, 2) + Math.pow(this.startingPosition.height, 2));
    const distance = Math.sqrt( Math.pow(e.distance.x, 2) + Math.pow(e.distance.y, 2));

    const f = distance / diagonalLength;

    let scale: number;

    switch ( this.corner ) {
      case 'tl':
        scale = e.distance.x < 0 && e.distance.y < 0 ? 1 + f : 1 - f;
        break;
      case 'tr':
        scale = e.distance.x > 0 && e.distance.y < 0 ? 1 + f : 1 - f;
        break;
      case 'bl':
        scale = e.distance.x < 0 && e.distance.y > 0 ? 1 + f : 1 - f;
        break;
      case 'br':
        scale = e.distance.x > 0 && e.distance.y > 0 ? 1 + f : 1 - f;
        break;
    }

    this.img.nativeElement.style.transform = `matrix(${scale}, 0, 0, ${scale}, 0, 0)`;
    this.setGui();

  }

  ended(e: CdkDragEnd): void {
    // Persist translated matrix sizes to image.
    const rect: Rect = this.img.nativeElement.getBoundingClientRect();
    this.img.nativeElement.width = Math.round(rect.width); // We don't want fractional pixels
    this.img.nativeElement.height = Math.round(rect.height); // We don't want fractional pixels

    // Clean up matrix.
    this.img.nativeElement.style.transform = null;
    this.container.nativeElement.style.transform = `translate3d(${rect.x}px, ${rect.y}px, 0)`;
    this.endedContainer();
    this.setGui();

    e.source.element.nativeElement.style.transform = null;
  }

  endedContainer(): void {
    const rect: Rect = this.container.nativeElement.getBoundingClientRect() as Rect;
    this.containerRect = {
      x: Math.round( rect.x ),
      y: Math.round( rect.y ),
      width: Math.round( rect.width ),
      height: Math.round( rect.height )
    };
    this.moved.emit(this.containerRect);
  }

  movedContainer(): void {
    this.moved.emit(this.container.nativeElement.getBoundingClientRect() as Rect);
  }

  public setFullsize(): void {
    this.img.nativeElement.width = this.originalResolution.width;
    this.img.nativeElement.height = this.originalResolution.height;
    this.setGui();
  }

  private calculateMaximumDimensions(): void {

    const target: Rect = {
      width: this.img.nativeElement.width,
      height: this.img.nativeElement.height
    };

    const dominantWidth: Rect = {
      width: target.width,
      height: this.originalResolution.height * target.width / this.originalResolution.width
    };

    const dominantHeight: Rect = {
      height: target.height,
      width: this.originalResolution.width * target.height / this.originalResolution.height
    };

    const strategy: Rect = dominantWidth.height > target.height ? dominantHeight : dominantWidth;

    this.img.nativeElement.width = strategy.width;
    this.img.nativeElement.height = strategy.height;

  }

  private move(x: number, y: number): void {
    this.containerRect = {
      x: this.containerRect.x + x,
      y: this.containerRect.y + y
    };
  }

  getTranslateGrid(): string {
    return `translate(${this.transformGui.x}px, ${this.transformGui.y}px)`;
  }

}
