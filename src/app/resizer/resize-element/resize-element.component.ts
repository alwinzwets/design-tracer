import { Component, OnInit, Input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-resize-element',
  templateUrl: './resize-element.component.html',
  styleUrls: ['./resize-element.component.scss']
})
export class ResizeElementComponent implements OnInit {

  @Input() src: string;

  constructor() { }

  ngOnInit(): void {
  }

  moved(e): void {
    const cdkDrag: CdkDrag = e.source;
    console.log(e, cdkDrag);
  }

}
