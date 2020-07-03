import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizeElementComponent } from './resize-element/resize-element.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [ResizeElementComponent],
  imports: [
    CommonModule,
    DragDropModule
  ],
  exports: [
    ResizeElementComponent
  ]
})
export class ResizerModule { }
