import { DropDownComponent } from "./drop-down.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import{TooltipConverseDirective} from "src/app/shared/component/converse-tooltip/directive/tooltip.directive";

describe('DropdownComponent', () => {
	let component: DropDownComponent;
	let fixture: ComponentFixture<DropDownComponent>;
	let bottomTextElem: DebugElement;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			declarations: [DropDownComponent,TooltipConverseDirective],
			imports: [],
			providers: []
		});
		fixture = TestBed.createComponent(DropDownComponent);
		component = fixture.componentInstance;
  });

  it("should be defined",()=>{
expect(component).toBeDefined();
  })

  it("should be filter",()=>{
    component.globalListenFunc=function(){};
    component.selected="mockColname";
    component.onSelChange({colName:"mockColname"});
    expect(component.showDropdown).toBeFalsy();
      })
  it("should be filter",()=>{
    component.globalListenFunc=function(){};
    component.selected="mockname";
    component.onSelChange({colName:"mockColname"});
    expect(component.selected).toEqual("mockColname");
    })
  it("should be filter with no input",()=>{
    component.globalListenFunc=function(){};
      component.selected="mockname";
      component.onSelChange(0);
      expect(component.selected).toBeUndefined();
      })

  it("should set colname and key on changes",()=>{
    component.data=[{colName:"mockCol"},{key:"mockKey"}];
    component.ngOnChanges();
    component.openDropdown();
  })
})