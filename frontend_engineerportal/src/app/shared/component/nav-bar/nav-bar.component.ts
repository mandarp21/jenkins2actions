import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'nav-bar',
  styleUrls: ['nav-bar.component.sass'],
  templateUrl: 'nav-bar.component.html'
})
export class NavBarComponent {
  @Input()
  title: string;
  @Input()
  prevpage: string;
  @Input()
  selectedChannel: string;
  @Output()
  backclick = new EventEmitter<string>();

  back() {
    this.backclick.emit();
  }
}
