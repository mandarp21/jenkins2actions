import { RatingCardComponent } from './rating-card.component';
//const expect = require('chai').expect;

var comp : RatingCardComponent;
describe('rating component', function () {
	beforeEach(() => {
		comp = new RatingCardComponent()
	});
	it('Test Description', () => {
		comp.ngOnInit();
		comp.ngOnChanges({});
		comp.onMouseHover()
	});
	it("should get style",()=>{
		comp.ratingtext="7.5";
		comp.getStyle();
	})
	it("should get style",()=>{
		comp.ratingtext="4.4";
		comp.getStyle();
	})
	it("should get style",()=>{
		comp.ratingtext="3.3";
		comp.getStyle();
	})
	it("should get style",()=>{
		comp.ratingtext="2.2";
		comp.getStyle();
	})
	it("should get style",()=>{
		comp.ratingtext="1.1";
		comp.getStyle();
	})
	it("should get style",()=>{
		comp.ratingtext="0.0";
		comp.getStyle();
	})
})