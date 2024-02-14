import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
@Component({
  templateUrl: 'tooltip-container.component.html',
  styleUrls: ['./tooltip-container.component.sass']
})
export class TooltipContainerComponent {
  top : string;
  @ViewChild('containerToolTip', { read: ElementRef }) private tooltipContainer;

  constructor( @Inject('tooltipConfig') private config ) {
  }
}

