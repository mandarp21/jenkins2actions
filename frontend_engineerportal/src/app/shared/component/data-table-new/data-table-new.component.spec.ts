import { DataTableNewComponent } from "./data-table-new.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement, Component, Input } from "@angular/core";


@Component({
  selector: 'converse-drop-down',
  template: ''
})

export class DropDownMockComponent {
  @Input('data')
  data: any[];
  @Input('id')
  id: string;
  @Input()
  showtitle: string;
  @Input()
  icondisplay: string;
  @Input()
  inwidth: string;
  @Input()
  inleft: string;
  @Input()
  selected: string;
  @Input() hasEmptyOption: boolean;
  @Input() placeholder;
}

@Component({
	selector: 'converse-button',
	template: '',
})

export class ButtonMockComponent {
	@Input() val;
	@Input() id;
	@Input() boolGreen;
}

@Component({
	selector: 'converse-textbox',
	template: '',
})

export class ConverseTextBoxMockComponent {
	@Input() val;
	@Input() id;
	@Input() placeholder;
}


describe('DataTableNewComponent', () => {

	let component: DataTableNewComponent;
	let fixture: ComponentFixture<DataTableNewComponent>;
	let bottomTextElem: DebugElement;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			declarations: [DataTableNewComponent,ButtonMockComponent,DropDownMockComponent,ConverseTextBoxMockComponent
			],
			imports: [],
			providers: [
			]
		});
		fixture = TestBed.createComponent(DataTableNewComponent);
		component = fixture.componentInstance;
	});

	it('should have a defined component', async () => {
		expect(component).toBeDefined();
	});

	it('should update values on changes log filter is false', async () => {
		component.usecaselist=[{"Date":"mockdate"}];
		component.itemheaders = [{ isDate: true, colname: "Date", filter: true }];
		let date = new Date();
		component.itemlist = [{ Date: date }];
		component.logFilter=false;
		component.itemheaders=[{isDate:true,colname:"Date",filter:true}];
		component.ngOnChanges();
	});

	it('should update values on changes when log filter exists', async () => {
		component.usecaselist=[{"Date":"mockdate"}];
		component.itemheaders = [{ isDate: true, colname: "Date", filter: true }];
		let date = new Date();
		component.itemlist = [{ Date: date }];
		component.logFilter=true;
		component.itemheaders=[{isDate:true,colname:"Date"}];
		component.ngOnChanges();
	});

	it('should update values on changes without usecase list', async () => {
		component.usecaselist=null;
		component.filteredItems=[{data:"mockdata"}];
		component.ngOnChanges();
	});

	it('should update values on changes without usecase list and filtered items', async () => {
		component.usecaselist=null;
		component.filter={"Date":{options:[],selected:[]}}
		component.itemheaders=[{isDate:true,colname:"Date",filter:true}];
		let date = new Date();
		component.itemlist = [{ Date: date }];
		component.filteredItems=null;
		component.ngOnChanges();
	});


	it('should handle sort properly on handleSort for descending', async () => {
		let date: Date = new Date('2014-04-03');
		let date2 = new Date('2014-04-09');
		component.itemlist = [{ Date: date }, { Date: date2 }];

		const header = { isDate: new Date(), colname: "Date" };
		component.sort = { Date: "none" };
		component.itemheaders = [{ filter: false }];
		component.filter = { Date: "some" };

		let value = "desc";
		component.handleSort(header, value);
		// expect(JSON.stringify(component.itemlist[0].Date)).toEqual('"2014-04-09T00:00:00.000Z"')
	});

	it('should handle sort properly on handleSort for descending when usecase list exists', async () => {
		let date: Date = new Date('2014-04-03');
		let date2 = new Date('2014-04-09');
		component.usecaselist=[{"data":"mockdata"}];
		component.itemlist = [{ Date: date }, { Date: date2 }];

		const header = { isDate: new Date(), colname: "Date" };
		component.sort = { Date: "none" };
		component.itemheaders = [{ filter: false }];
		component.filter = { Date: "some" };

		let value = "desc";
		component.handleSort(header, value);
		// expect(JSON.stringify(component.itemlist[0].Date)).toEqual('"2014-04-09T00:00:00.000Z"')
	});

	it('should handle sort properly on handleSort for ascending', async () => {
		let date: Date = new Date('2014-04-03');
		let date2 = new Date('2014-04-09');
		component.itemlist = [{ Date: date2 }, { Date: date }];

		const header = { isDate: new Date(), colname: "Date" };
		component.sort = { Date: "none" };
		component.itemheaders = [{ filter: false }];
		component.filter = { Date: "some" };

		let value = "asc";
		component.handleSort(header, value);
		// expect(JSON.stringify(component.itemlist[0].Date)).toEqual('"2014-04-03T00:00:00.000Z"')
	});

	it('should handle sort properly on handleSort for ascending when usecaselist exists', async () => {
		component.usecaselist=[{"data":"mockdata"}];
		let date: Date = new Date('2014-04-03');
		let date2 = new Date('2014-04-09');
		component.itemlist = [{ Date: date2 }, { Date: date }];

		const header = { isDate: new Date(), colname: "Date" };
		component.sort = { Date: "none" };
		component.itemheaders = [{ filter: false }];
		component.filter = { Date: "some" };

		let value = "asc";
		component.handleSort(header, value);
		// expect(JSON.stringify(component.itemlist[0].Date)).toEqual('"2014-04-03T00:00:00.000Z"');
	});

	it('should handle sort properly on handleSort for ascending when usecaselist not exists', async () => {
		component.usecaselist=[{"data":"mockdata"}];
		let date: Date = new Date('2014-04-03');
		let date2 = new Date('2014-04-09');
		component.itemlist = [{ Date: date2 }, { Date: date }];

		const header = { type:"text-decimal", colname: "Date" };
		component.sort = { Date: "none" };
		component.itemheaders = [{ filter: false }];
		component.filter = { Date: "some" };

		let value = "asc";
		component.handleSort(header, value);
		// expect(JSON.stringify(component.itemlist[0].Date)).toEqual('"2014-04-03T00:00:00.000Z"');
	});

		it('should handle sort properly on handleSort for ascending when usecaselist not exists', async () => {
		component.usecaselist=[{"data":"mockdata"}];
		let date: Date = new Date('2014-04-03');
		let date2 = new Date('2014-04-09');
		component.itemlist = [{ Date: date2 }, { Date: date }];

		const header = { type:"text-decimal", colname: "Date" };
		component.sort = { Date: "none" };
		component.itemheaders = [{ filter: false }];
		component.filter = { Date: "some" };
		let value = "asc";
		component.handleSort(header, value);
		component.handleSort(header,"desc");
		// expect(JSON.stringify(component.itemlist[0].Date)).toEqual('"2014-04-03T00:00:00.000Z"');
	});

	it('should validate that scroll should always be on top without useCaselist', async () => {
		const data = { target: { scrollHeight: 500, scrollTop: 200 } }
		component.listSize = 100;
		component.filteredItems = [];
		component.onScroll(data);
		expect(component.listSize).toEqual(200);
	});

	it('should validate that scroll should always be on top with usecaselist', async () => {
		component.usecaselist=[{data:"mockdata"}];
		const data = { target: { scrollHeight: 500, scrollTop: 200 } }
		component.listSize = 100;
		component.filteredItems = [];
		component.itemlist=[];
		component.onScroll(data);
		expect(component.listSize).toEqual(200);
	});

	it('should return true if all the options are checked else false', async () => {
		const colname = "Date";
		component.filter = { Date: { selected: [], options: [] } };
		component.isShowAllChecked(colname);
		expect(component.isShowAllChecked(colname)).toEqual(true);

		component.filter = { Date: { selected: [{ data: "none" }], options: [] } };
		component.isShowAllChecked(colname);
		expect(component.isShowAllChecked(colname)).toEqual(false);
	});


	it('should toggle filter selection', async () => {
		const colname = "floor";
		const value = "test";
		component.filter = {floor:{options:[]}};
		component.filter['floor'].selected = [];
		component.itemheaders = [{ filter: false }];
		component.itemlist = [{ Date: "" }, { Date: "" }];

		component.toggleFilterSelection(colname, value);
		expect(component.filter[colname].selected[0]).toEqual("test");

		component.toggleFilterSelection(colname, value);
		expect(component.filter[colname].selected[0]).toEqual(undefined);
	});

	it('should toggle filter selection if usecase list exists', async () => {
		component.usecaselist=[{data:"mockData"}]
		const colname = "floor";
		const value = "test";
		component.filter = {floor:{options:[]},useCaseName:{selected:["data"]}};
		component.filter['floor'].selected = [];
		component.itemheaders = [{ filter: false }];
		component.itemlist = [{ Date: "" }, { Date: "" }];

		component.toggleFilterSelection(colname, value);
		expect(component.filter[colname].selected[0]).toEqual("test");

		component.toggleFilterSelection(colname, value);
		expect(component.filter[colname].selected[0]).toEqual("test");
	});

	it('should toggle filter selection if usecase list exists and usecasename dont exists', async () => {
		component.usecaselist=[{data:"mockData"}]
		const colname = "floor";
		const value = "test";
		component.filter = {floor:{options:[]},useCaseName:{selected:["test","test"]}};
		component.filter['floor'].selected = [];
		component.itemheaders = [{ filter: false }];
		component.itemlist = [{ Date: "" }, { Date: "" }];

		component.toggleFilterSelection(colname, value);
		expect(component.filter[colname].selected[0]).toEqual("test");

		component.toggleFilterSelection(colname, value);
		expect(component.filter[colname].selected[0]).toEqual("test");
	});


	it('should toggle filter dropdown', async () => {
		const column = "test_col"
		component.toggleFilterDropdown(column);
		// expect(component.openFilterDropdown).toEqual(column);;
	});

	it('should handle data row click', async () => {
		const item = "dummy string"
		component.handleDataRowClick(item,"mockValue","mockId");
	});

	it('should handle custom Action click', async () => {
		const item = "dummy string"
		component.handleCustomAction({item:item},{value:"mockValue"});
	});

	it('should toggle all dropdown if usecaselist dont exist', async () => {
		const colname = "test_column";
		component.filter = {test_column:{}};
		component.filter[colname].selected = ["apple"];
		component.filter[colname].options = ["apple"];

		component.itemlist = [{ Date: "" }, { Date: "" }];
		component.itemheaders = [{ filter: false }];
		component.toggleSelectAll(colname);
		expect(component.filter[colname].selected).toEqual([]);

		component.toggleSelectAll(colname);
		expect(component.filter[colname].selected).toEqual(["apple"]);
	});

	it('should toggle all dropdown if usecase list exists', async () => {
		component.usecaselist=[{data:"mockdata"}]
		const colname = "test_column";
		component.filter = {test_column:{}};
		component.filter[colname].selected = ["apple"];
		component.filter[colname].options = ["apple"];
		component.itemlist = [{ Date: "" }];
		component.itemheaders = [{ filter: false }];
		component.toggleSelectAll(colname);
		expect(component.logFilter).toBeTruthy();
	});

})