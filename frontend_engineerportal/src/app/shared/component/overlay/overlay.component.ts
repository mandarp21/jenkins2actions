import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'overlay-component',
  styleUrls: ['overlay.component.sass'],
  templateUrl: 'overlay.component.html'
})

/**
 * @internal
 * This class is a  component that displays the Overlay component.
 */
export class OverlayComponent {
  @Input()
  active: boolean;
  @Output()
  eventClick = new EventEmitter();

  toggleOverlay() {
    // this.active = false;
    this.eventClick.emit();
  }
}
