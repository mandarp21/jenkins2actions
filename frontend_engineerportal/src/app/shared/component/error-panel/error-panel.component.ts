import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'converse-error-panel',
  templateUrl: 'error-panel.component.html',
  styleUrls: ['error-panel.component.sass'],
})
export class ErrorPanelComponent implements OnInit {

  @Input() message: string;
  @Output() closeErrorPanel = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  //  TODO to be input
    // this.message = 'Error';
  }

  close() {
    this.closeErrorPanel.emit();
  }
}
