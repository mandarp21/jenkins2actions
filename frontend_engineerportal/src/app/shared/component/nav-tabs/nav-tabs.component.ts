import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'converse-nav-tabs',
  styleUrls: ['nav-tabs.component.sass'],
  templateUrl: 'nav-tabs.component.html'
})
export class NavTabComponent {
  @Input() sideBarLinks: any;
  @Output() clickEventEmitter = new EventEmitter<string>();

  navigateToChild(id?): void {
    this.clickEventEmitter.emit(id);
  }
}
