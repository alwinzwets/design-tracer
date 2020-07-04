import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Rect } from 'src/app/resizer/resize-element/resize-element.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {

  @Input() position: BehaviorSubject<Rect>;

  @ViewChild('movementArea') movementArea: ElementRef;
  @ViewChild('handle') handle: ElementRef;

  positionModel: Rect;
  opacity: number;

  constructor() { }

  ngOnInit(): void {

    this.position.subscribe({
      next: (p: Rect) => this.positionModel = p
    });

  }

  movedHandle(e): void {
    const handleRect = this.handle.nativeElement.getBoundingClientRect();
    const movementAreaRect = this.movementArea.nativeElement.getBoundingClientRect();
    this.opacity = (handleRect.x - movementAreaRect.x) / (movementAreaRect.width - handleRect.width);
  }

  getClipPath(): string {
    return `polygon(0 0, ${this.opacity * 100}% 0, ${this.opacity * 100}% 100%, 0% 100%)`;
  }

}
