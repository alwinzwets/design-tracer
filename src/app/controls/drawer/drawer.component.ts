import { Component, Input, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ControlsService } from "./../controls.service";
import { Rect } from "app/interfaces/rect.interface";
@Component({
  selector: "app-drawer",
  templateUrl: "./drawer.component.html",
  styleUrls: ["./drawer.component.scss"],
})
export class DrawerComponent {
  @Input() set position(rect: BehaviorSubject<Rect>) {
    rect.subscribe({
      next: (p: Rect) => (this.controlsService.imageRect = p),
    });
  }

  @Output() opacity = new EventEmitter();
  @Output() image = new EventEmitter();
  @Output() fullsize = new EventEmitter();

  constructor(private controlsService: ControlsService) {
    this.controlsService.opacity.subscribe({
      next: (o: number) => this.opacity.emit(o),
    });

    this.controlsService.image.subscribe({
      next: (i: string) => this.image.emit(i),
    });
  }

  setFullSize(): void {
    this.fullsize.emit(true);
  }
}
