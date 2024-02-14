import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input } from '@angular/core';
import { DataTableComponent } from './data-table.component';
import { UtilService } from 'src/app/services/util.service';
import { CookieService } from 'ngx-cookie-service';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import{TooltipConverseDirective} from "src/app/shared/component/converse-tooltip/directive/tooltip.directive";

@Component({
	selector:"converse-text",
	template:""
})

export class converseText{
	@Input() 
	@Input() 
	onMouseHover(event){};
}

@Component({
	selector:"converse-rating",
	template:""
})

export class RatingMockComponent{
	@Input() ratingtext;
	@Input() chartdata;
	onMouseHover(event){};
}

@Component({
	selector: 'converse-drop-down',
	template: '',
})

export class DropDownMockComponent {
	@Input() placement;
	@Input() type
	@Input() id;
	@Input() tooltipKey;
	@Input() activateToolTip;
	@Input() data;
	@Input() selected;
	@Input() disabled;
	public onSelchange(event){}
	public update() {
		return true;
	}
}

@Component({
	selector: 'converse-button',
	template: '',
})

export class ButtonMockComponent {
	@Input() val;
	@Input() id;
	@Input() boolGreen;
	@Input() type;
}

class utilMock{
  sortArray(data1,data2,data3){
    return "mockData"
  }
}

describe('Component: DataTableComponent', function () {

	let component: DataTableComponent;
	let fixture: ComponentFixture<DataTableComponent>;
	let bottomTextElem: DebugElement;

	beforeEach(() => {
		TestBed.configureTestingModule({imports:[],providers:[{provide:UtilService,useClass:utilMock},CookieService],
			declarations: [DataTableComponent,RatingMockComponent,DropDownMockComponent,ButtonMockComponent,TooltipConverseDirective]
		});
		fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
	});
	
	it('DataTableComponent should be defined', () => {
		expect(component).toBeDefined();
	});

	it('Component @Input itemheaders should be undefined', () => {
		expect(component.itemheaders).toBeUndefined();
	});

	it('Component @Input itemlist should be undefined', () => {
		expect(component.itemlist).toBeUndefined();
	});

	it('Component header type img should show a img tag in dom', () => {
		component.itemheaders =
		
		[
			{ 'headerName': '', 'colname': 'botImage', 'width': '10%', 'type': 'img' }
		]
		

		fixture.detectChanges();
		bottomTextElem = fixture.debugElement.query(By.css('.botLogoCls'));
		
		expect(bottomTextElem).toBeDefined();
	});

	it('Component header greenlabel to should show a span with style greenCls', () => {
		component.itemheaders =
		
		[
			{ 'headerName': '', 'colname': 'botImage', 'width': '10%', 'type': 'greenlabel' }
		];
		fixture.detectChanges();
		bottomTextElem = fixture.debugElement.query(By.css('.greenCls'));
		
		expect(bottomTextElem).toBeDefined();
	});

	it('should sorrt column properly',inject([UtilService], (util: UtilService) => {
		spyOn(util, "sortArray").and.returnValue("success");;
		component.sortCol('test1', 'test2');
		expect(component.colName).toEqual("test1");
		expect(component.sortOrder).toEqual("test2");
		expect(component.itemlist).toEqual("success");
	}));

	it('should show filter details',inject([], () => {
		const data = 'test1';
		component.filterOn = true;
		component.colName = data;
		component.showFilter(data);
		expect(component.filterOn).toEqual(false);
		expect(component.colName).toEqual(data);

		component.colName = "none";
		component.showFilter(data);
		expect(component.filterOn).toEqual(true);
		expect(component.colName).toEqual(data);
	}));

	it('should emit hoverevent on mousehover',inject([], () => {
		const id={botId:"23"};
		spyOn(component.hoverevent,"emit");
		component.onMouseHover(id);
		expect(component.hoverevent.emit).toHaveBeenCalledWith(id.botId);
	}));

	it('should emit clickevent on rowclick',inject([], () => {
		const id="23";
		spyOn(component.clickEventEmitter,"emit");
		component.onRowClick(id);
		expect(component.clickEventEmitter.emit).toHaveBeenCalledWith(id);
	}));

	it('should set selected index and emit clickevent on convclick',inject([], () => {
		const index="23";
		let item={sessionId:"23"};
		spyOn(component.clickEventEmitter,"emit");
		component.onConvClick(item, index);
		expect(component.selectedIndex).toEqual(index);
		expect(component.clickEventEmitter.emit).toHaveBeenCalledWith(item.sessionId);

		component.selectedIndex = 33;
		const item2={sessionId:"23" , uttername: "value"};
		component.onConvClick(item2, index);
		expect(component.selectedIndex).toEqual(33);

	}));

	it('should emit clickevent on rowclick',inject([], () => {
		const item={key: "24"};
		const col = "name";

		component.itemlist = [{colName: ""}];
		component.updateNLPItem(item, 0, col);
		expect(component.itemlist[0].selectedOption).toEqual(item.key);

		const item2 = "value";
		component.itemlist[0].selectedOption = undefined;
		component.updateNLPItem(item2, 0, col);
		expect(component.itemlist[0].selectedOption).toEqual(undefined);
		expect(component.itemlist[0].name).toEqual(item2);
	}));

	it('should emit utterance event',inject([], () => {
		const i=0;
		const status = "test";
		spyOn(component.nlpTrainerEventEmitter,"emit");

		component.itemlist = [{colName: ""}];
		component.emitUtteranceEvent(i, status);
		expect(component.nlpTrainerEventEmitter.emit).toHaveBeenCalledWith({ colName: '', status: 'test' });
	}));

	it('should load more in reclassify uttrances table in train-nlp page',inject([], () => {

		component.displayCount = 1;
		component.itemlist = [{colName: "one"},{colName: "two"}];
		component.loadMore();
		expect(component.paginationFlag).toEqual(false);
		expect(component.showLessFlag).toEqual(true);
	}));

	it('should show less in reclassify uttrances table in train-nlp page',inject([], () => {

		component.showLess();
		expect(component.showLessFlag).toEqual(false);
		expect(component.paginationFlag).toEqual(true);
		expect(component.displayCount).toEqual(10);
	}));

	it('should show NLP logs in click of dialogue/speech icon in uttrance column in reclassify uttrance list table',inject([], () => {

		const item = {sessionId: "one"};
		spyOn(component.clickEventEmitter,"emit");
		component.showNlpLogs(item);
		expect(component.clickEventEmitter.emit).toHaveBeenCalledWith(item.sessionId);
	}));

  it('should sortCol',inject([], () => {
    component.itemlist=["mock"];
component.sortCol("mockColName","asc");
expect(component.itemlist).toEqual("mockData")
  }));
  
  it('should showFilter',inject([], () => {
component.colName="mockCol";
component.showFilter("mockCol");
expect(component.colName).toEqual("mockCol");
  }));
  });

