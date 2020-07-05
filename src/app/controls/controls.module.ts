import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DrawerComponent } from './drawer/drawer.component';
import { SliderComponent } from './slider/slider.component';
import { InputComponent } from './input/input.component';
import { FileInputComponent } from './file-input/file-input.component';


@NgModule({
  declarations: [
    DrawerComponent,
    SliderComponent,
    InputComponent,
    FileInputComponent
  ],
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
