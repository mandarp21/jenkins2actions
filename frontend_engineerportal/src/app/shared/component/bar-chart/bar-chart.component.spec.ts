import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BarChartComponent } from './bar-chart.component';


describe('BarChartComponent', () => {
	let component: BarChartComponent;
	let fixture: ComponentFixture<BarChartComponent>;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [BarChartComponent]
		});
		fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
	}));

  it('BarChartComponent should be defined', () => {
		expect(component).toBeDefined();
  });
  
  it("should refresh",()=>{
    component.onClickRefresh({data:"mockData"});
    component.ngOnInit();
  })

  it("shoul set total",async(()=>{
    component.total=1500;
    component.chartid="mockid";
    expect(component._total).toEqual(1500);
    expect(component._chartid).toEqual("mockid");
  }))
});
