import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ResizerModule } from './resizer/resizer.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ResizerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
