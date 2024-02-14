import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FlowCardComponent } from './flow-card.component';
import { Pipe, PipeTransform } from '@angular/core';
import { compileComponentFromMetadata } from '@angular/compiler/src/render3/view/compiler';

@Pipe({
    name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
  transform() {}
}

describe('Component: FlowCardComponent', () => {
  let component: FlowCardComponent;
  let fixture: ComponentFixture<FlowCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlowCardComponent, TruncatePipe]
    });
    fixture = TestBed.createComponent(FlowCardComponent);
    component = fixture.componentInstance;
   // const pipe = new TruncatePipe();
  });

  it('FlowCardComponent should be defined', () => {
    expect(component).toBeDefined();
  });

  it('Handle click event', () => {
    spyOn(component.eventClick, 'emit');
    component.handleClick('action');
  });

  it('toggle Tooltips', () => {
    component.toggleTooltips();
    expect(component.showTooltips).toBe(true);
  });

  it('should update icon and boy type on any changes', () => {
    component.ngOnChanges();
    expect(component.iconUrl).toEqual('assets/img/card-editor/Bot_Icon_Grey.svg');
    expect(component.isSplittingNode).toEqual(false);

    component.responseType = 'options';
    component.ngOnChanges();
    expect(component.isSplittingNode).toEqual(true);
  });

});
