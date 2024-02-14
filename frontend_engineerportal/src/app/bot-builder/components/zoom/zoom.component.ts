import { Component, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'zoom',
  styleUrls: ['zoom.component.sass'],
  templateUrl: 'zoom.component.html'
})

/**
 * @internal
 * This class is a  component that displays the Zoom component.
 */
export class ZoomComponent {
  @Output() eventClick = new EventEmitter();

  handleClick(action) {
    this.eventClick.emit(action);
  }
  
}
