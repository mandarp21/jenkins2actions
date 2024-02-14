import { ElementRef, Renderer2, CUSTOM_ELEMENTS_SCHEMA, RootRenderer } from '@angular/core';
import { DropDownComponentMultiple } from './drop-down-multiple.component';
import { TestBed,inject } from '@angular/core/testing';

abstract class renderermockservice extends Renderer2{
  constructor(){
    super();
  }

removeClass(data1,data2){
return "mockData"
}

addClass(data1,data2){
return "mockData"
}
  }

class elementrefmockservice extends ElementRef{
  constructor(){
super(null);
  }

classList={
  remove(){}}
}

describe('drop down multiple', () => {
beforeEach(() => {
		TestBed.configureTestingModule({schemas:[CUSTOM_ELEMENTS_SCHEMA],
      declarations: [DropDownComponentMultiple],
      providers: [{provide:ElementRef,useClass:elementrefmockservice},{provide:Renderer2,useClass:renderermockservice}]
    })
  });
  
	it('Component is defined', async() => {
    const fixture = TestBed.createComponent(DropDownComponentMultiple);
    const comp = fixture.componentInstance;
    comp.dropdowns = [{lastChild:{classList:{value:["show"]}}}];
    fixture.detectChanges();
    expect(comp).toBeDefined();
  });

  it('ngOnChanges should update data properly', async() => {
    const fixture = TestBed.createComponent(DropDownComponentMultiple);
    const comp = fixture.componentInstance;
    comp.dropdowns = [{lastChild:{classList:{value:["show"]}}}];
    fixture.detectChanges();
    comp.data = [{key:"key_1"}];
    comp.ngOnChanges();
    expect((comp.data)).toEqual([[{"key":"key_1"}]]);

    comp.data = [];
    comp.ngOnChanges();
    expect((comp.data)).toEqual([[]]);

    comp.selected = [{key:"key_1"}, {key:"key_2"}];
    comp.data = [{key:"key_1"}];
    comp.ngOnChanges();
    expect((comp.data)).toEqual([[{"key":"key_1"}],[{"key":"key_1"}]]);

    comp.selected = [{key:"key_1"}];
    comp.data = [];
    comp.ngOnChanges();
    expect((comp.data)).toEqual([[]]);
  });

  it('ngAfterViewChecked should fetch dropdown values and then reset it ', async() => {
    const fixture = TestBed.createComponent(DropDownComponentMultiple);
    const comp = fixture.componentInstance;
    comp.dropdowns = [{lastChild:{classList:{value:["show"]}}}];
    fixture.detectChanges();
    comp.resetDropdownsList = true;
    comp.ngAfterViewChecked();
    expect(comp.resetDropdownsList).toEqual(false);
  });

  it('onButtonClick should handle dropdown click events ', async() => {
    const fixture = TestBed.createComponent(DropDownComponentMultiple);
    const comp = fixture.componentInstance;
    comp.dropdowns = [{lastChild:{classList:{value:["show"]}}}];
    fixture.detectChanges();
    comp.resetDropdownsList = true;
    comp.icondisplay = ["plus"];
    comp.data = [[{key:"key_1"},{key2:"key_2"}]];
    comp.selected = [{key:"key_1"}];
    comp.onButtonClick(0);
    expect(comp.selected[(comp.selected.length)-1]).toEqual(null);
    expect(comp.resetDropdownsList).toEqual(true);
    expect(comp.icondisplay[(comp.icondisplay.length)-1]).toEqual('caret');
    comp.icondisplay = ["del"];
    comp.onButtonClick(0);
  });
  
  it("onbuttonClickshould handle dropdowns",inject([Renderer2],(Renderer2)=>{
    const comp= new DropDownComponentMultiple(new ElementRef(null),Renderer2);
    comp.dropdowns = [{lastChild:{classList:{value:["show"]}}}];
    comp.icondisplay = ["caret"];
    comp.onButtonClick(0);
  }))

  it("should onSelChange",inject([Renderer2],(Renderer2)=>{
    const comp= new DropDownComponentMultiple(new ElementRef(null),Renderer2);
    comp.tempSelected=[];
    comp.icondisplay=["mock data"];
    comp.dropdowns = [{lastChild:{classList:{value:["show"]}}}];
    comp.onSelChange({colname:"mockValue"},0);
    expect(comp.icondisplay[0]).toEqual("plus");
  }))

  it("should onSelChange",inject([Renderer2],(Renderer2)=>{
    const comp= new DropDownComponentMultiple(new ElementRef(null),Renderer2);
    comp.tempSelected=[];
    comp.icondisplay=["mock data"];
    comp.dropdowns = [{lastChild:{classList:{value:["show"]}}}];
    comp.onSelChange(0,0);
    expect(comp.icondisplay[0]).toEqual("caret")
  }))
 })
