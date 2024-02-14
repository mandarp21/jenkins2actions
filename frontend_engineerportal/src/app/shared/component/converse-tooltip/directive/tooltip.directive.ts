import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, HostListener, Injector, Input, ReflectiveInjector, Renderer2, TemplateRef, Type, ViewContainerRef, ViewRef } from '@angular/core';
import { TooltipContainerComponent } from '../tooltip-container.component';
import { TOOLTIPS } from '../../../../app-constant';

@Directive({
  selector: '[converse-tooltip]'
})

/**
 * @description - Directive to create Tooltip
 * @param {string} contentId - key for fetching tooltip text
 * @param {boolean} activateToolTip - to enable/disable tooltip for a control
 * @param {string} mode - mode of activating tooltip - hover/click
 * @param {string} placement - placement of tooltip - top, bottom, none
 */
export class TooltipConverseDirective {
  @Input('converse-tooltip') contentId : string;
  @Input() activateToolTip : boolean;
  @Input() mode : string;
  @Input() placement : string;
  placementPos : string;
  private componentRef : ComponentRef<TooltipContainerComponent>;
  offset = 10;

  constructor( private element : ElementRef,
               private renderer : Renderer2,
               private injector: Injector,
               private resolver : ComponentFactoryResolver,
               private vcr : ViewContainerRef ) {
  }
  /**
   * @description - Method - Handler to create the tooltip on mouse enter
   * @returns - void
   */
  @HostListener('mouseenter')
  onMouseEnter() : void {
    if (this.activateToolTip && this.mode !== 'click') {
      if (this.componentRef) return;
      const factory = this.resolver.resolveComponentFactory(TooltipContainerComponent);
      const injector = ReflectiveInjector.resolveAndCreate([
        {
          provide: 'tooltipConfig',
          useValue: {
            host: this.element.nativeElement
          }
        }
      ]);
      this.componentRef = this.vcr.createComponent(factory, 0, injector, this.generateNgContent());
      this.renderer.appendChild(document.body, this.componentRef['_component'].tooltipContainer.nativeElement);
      if (this.placement) {
        this.setPosition(this.placement);
      }
    }
  }
  /**
   * @description - Method - To generate the content for the Tooltip
   * @returns - the element with text for the Tooltip
   */
  generateNgContent(): Array<any>[] {
    if (this.contentId) {
      const element = this.renderer.createText(TOOLTIPS[this.contentId]);
      return [ [ element ] ];
    }
  }
  /**
   * @description - Method - Handler to remove the tooltip on mouse leave
   * @returns - void
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.activateToolTip) {
      this.destroy();
    }
  }
  /**
   * @description - Method - Handler to generate the tooltip on click
   * @returns - void
   */
  @HostListener('click')
  onClick(): void {
    if (this.activateToolTip && event.type === 'click') {
      if (this.componentRef) return;
      const factory = this.resolver.resolveComponentFactory(TooltipContainerComponent);
      const injector = ReflectiveInjector.resolveAndCreate([
        {
          provide: 'tooltipConfig',
          useValue: {
            host: this.element.nativeElement
          }
        }
      ]);
      this.componentRef = this.vcr.createComponent(factory, 0, injector, this.generateNgContent());
      this.renderer.appendChild(document.body, this.componentRef['_component'].tooltipContainer.nativeElement);
      if (this.placement) {
        this.setPosition(this.placement);
      }
    } else if (!this.activateToolTip && event.type === 'click') {
      this.destroy();
    }
  }
  /**
   * @description - Method - To remove the tooltip element from DOM and clear component reference
   */
  destroy() {
    if (this.componentRef) {
      this.renderer.removeChild(document.body, this.componentRef['_component'].tooltipContainer.nativeElement);
      this.componentRef && this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  ngOnDestroy() {
    this.destroy();
  }
  /**
   * @description - Method - Calculate position for the tooltip as per screen availability and set top and left position
   */
  setPosition(placement : string) {
      const hostPos = this.element.nativeElement.getBoundingClientRect();
      const tooltipPos = this.componentRef['_component'].tooltipContainer.nativeElement.getBoundingClientRect();
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const hostOffsetBottom  = document.documentElement.clientHeight - ( hostPos.top + hostPos.height );

      if (hostOffsetBottom < tooltipPos.height) {
        this.placementPos = 'top';
      } else {
        this.placementPos = 'bottom';
      }
      let top;
      if (this.placementPos === 'top') {
        top = hostPos.top - tooltipPos.height - this.offset - 10;
      }
      if (this.placementPos === 'bottom') {
        top = hostPos.bottom;
      }
      if (placement === 'none') {
        this.renderer.setStyle(this.componentRef['_component'].tooltipContainer.nativeElement, 'top', `${hostPos.bottom + scrollPos + this.offset}px`);
        this.renderer.setStyle(this.componentRef['_component'].tooltipContainer.nativeElement, 'left', `${hostPos.left}px`);
      } else {
        this.renderer.setStyle(this.componentRef['_component'].tooltipContainer.nativeElement, 'top', `${top + scrollPos}px`);
        this.renderer.setStyle(this.componentRef['_component'].tooltipContainer.nativeElement, 'left', `${hostPos.left + this.offset + 10}px`);
      }
    }
}
