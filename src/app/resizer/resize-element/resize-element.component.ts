import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

export interface Rect {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

@Component({
  selector: 'app-resize-element',
  templateUrl: './resize-element.component.html',
  styleUrls: ['./resize-element.component.scss']
})
export class ResizeElementComponent implements OnInit {

  @Input() src: string;

  @Output() moved = new EventEmitter();

  @ViewChild('container') container: ElementRef;
  @ViewChild('img') img: ElementRef;

  startingDimensions: Rect;
  startingPosition: Rect;
  transformGui: Rect;
  corner: string;
  containerRect: Rect = { x: 0, y: 0 };


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

  started(e): void {
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
    console.log(e);
  }

  dragged(e): void {

    // Calculate distance between starting point and current point.
    const diagonalLength =  Math.sqrt( Math.pow(this.startingPosition.width, 2) + Math.pow(this.startingPosition.height, 2));
    const distance = Math.sqrt( Math.pow(e.distance.x, 2) + Math.pow(e.distance.y, 2));

    const f = distance / diagonalLength;

    let scale;

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

  ended(e): void {
    // Persist translated matrix sizes to image.
    const rect = this.img.nativeElement.getBoundingClientRect();
    console.log(rect);
    this.img.nativeElement.width = Math.round(rect.width); // We don't want fractional pixels
    this.img.nativeElement.height = Math.round(rect.height); // We don't want fractional pixels

    // Clean up matrix.
    this.img.nativeElement.style.transform = null;
    this.container.nativeElement.style.transform = `translate3d(${rect.x}px, ${rect.y}px, 0)`;
    this.endedContainer();
    this.setGui();

    e.source.element.nativeElement.style.transform = null;
  }

  endedContainer(e?): void {
    const rect: Rect = this.container.nativeElement.getBoundingClientRect() as Rect;
    this.containerRect = {
      x: Math.round( rect.x ),
      y: Math.round( rect.y ),
      width: Math.round( rect.width ),
      height: Math.round( rect.height )
    };
    this.moved.emit(this.containerRect);
  }

  movedContainer(e?): void {
    this.moved.emit(this.container.nativeElement.getBoundingClientRect() as Rect);
  }

  private lockAspectRatio(p: Rect): void {

    this.img.nativeElement.width = p.width;
    this.img.nativeElement.height = p.width * this.startingPosition.height / this.startingPosition.width;

  }

  getTranslateGrid(): string {
    return `translate(${this.transformGui.x}px, ${this.transformGui.y}px)`;
  }

}
