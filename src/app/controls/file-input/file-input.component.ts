import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ControlsService } from '../controls.service';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {

  @ViewChild('file') file: ElementRef;

  constructor( private controls: ControlsService ) { }

  ngOnInit(): void {
  }

  browse(): void {
    this.file.nativeElement.click();
  }

  changeImage(): void {

    const files = this.file.nativeElement.files;
    if (files.length === 0) { return; }

    const file = files[0];

    if (!file.type.match(/image\/*/)) { return; }

    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onload = () => {
      this.controls.image.next( reader.result.toString() );
    };

  }
}
