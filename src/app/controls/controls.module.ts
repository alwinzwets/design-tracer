import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DrawerComponent } from './drawer/drawer.component';


@NgModule({
  declarations: [DrawerComponent],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  exports: [
    DrawerComponent
  ]
})
export class ControlsModule { }
