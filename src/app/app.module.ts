import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ResizerModule } from './resizer/resizer.module';
import { ControlsModule } from './controls/controls.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ResizerModule,
    ControlsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
