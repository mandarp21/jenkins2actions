import { TestBed, inject } from "@angular/core/testing";
import { TooltipConverseDirective } from "./tooltip.directive";
import { ElementRef, Renderer2, ViewContainerRef, Injector, ComponentFactoryResolver } from "@angular/core";

abstract class renderermockservice extends Renderer2{
constructor(){
  super();
}

createText(data){
  return "mockData"
}

removeChild(){
  return "mockData"
}

setStyle(){

}

removeClass(data1,data2){
  return true
}
}

describe('tooltip directive', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations:[],
    providers:[TooltipConverseDirective,{provide:ElementRef,useValue:new ElementRef(null)},{provide:Renderer2,useClass:renderermockservice},ComponentFactoryResolver,ViewContainerRef,Injector]
    });
});

it("should be defined",inject([TooltipConverseDirective],(tool:TooltipConverseDirective)=>{
expect(tool).toBeDefined();
}))

it("should generate ng content",inject([TooltipConverseDirective],(tool:TooltipConverseDirective)=>{
  tool.contentId="mock";
  tool.generateNgContent();
}))

it("should generate ng content",inject([TooltipConverseDirective],(tool:TooltipConverseDirective)=>{
  tool.contentId="mock";
  let data = tool.generateNgContent();
  expect(data[0]).toEqual(["mockData"])
}))

it("should generate ng content",inject([TooltipConverseDirective],(tool:TooltipConverseDirective)=>{
  tool.activateToolTip=true;
  tool.mode="click";
  // tool.onClick();
 tool.onMouseLeave();
 tool.onMouseEnter();
}))

})