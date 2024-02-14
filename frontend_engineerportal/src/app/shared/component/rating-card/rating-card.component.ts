import { Component, OnInit, DoCheck, Input, Output, EventEmitter } from '@angular/core';
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { forEach } from '@angular/router/src/utils/collection';
import { FeedbackInterface } from 'src/app/model/feed-back.interface';

@Component({
	selector: 'converse-rating',
	styleUrls: ['rating-card.component.sass'],
	templateUrl: 'rating-card.component.html'
})

/**
 * @internal
 * This class is a reusable component that displays star based statistics.
 * In this component the input params are
 * titletext
 * statstext
 * unittext
 */
export class RatingCardComponent implements OnInit, OnChanges {

	@Input() ratingtext: string;
	
	@Input() inwidth: string = '100%';
	@Input() chartdata: any;
	@Output() mousehovered = new EventEmitter<string>();
	fill: string[];
	barOne: string;
	barTwo: string;
	barThree: string;
	barFour: string;

	constructor() {
		this.barOne = '0%';
		this.barTwo = '0%';
		this.barThree = '0%';
		this.barFour = '0%';
	}

	ngOnInit() {
		
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['ratingtext'] && changes['ratingtext']['currentValue'])
	 {
			this.getStyle();
		}
	}

	onMouseHover() {
		
		this.mousehovered.emit('');
	}

	getStyle() {
		if (!this.ratingtext) {
			return;
		}
		this.ratingtext = this.ratingtext + '';
		const numValue = +this.ratingtext;
		const paddingdecimal = this.ratingtext.split(".");
		const numdecimal = +paddingdecimal[0];
		const numWhole = numValue - numdecimal || 0;
		switch (numdecimal) {
			case 4:
				this.barOne = '100%';
				this.barTwo = '100%';
				this.barThree = '100%';
				this.barFour = '100%';
				break;
			case 3:
				this.barOne = '100%';
				this.barTwo = '100%';
				this.barThree = '100%';
				this.barFour = numWhole * 100 + '%';
				break;
			case 2:
				this.barOne = '100%';
				this.barTwo = '100%';
				this.barThree = numWhole * 100 + '%';
				this.barFour = '0%';
				break;
			case 1:
				this.barOne = '100%';
				this.barTwo = numWhole * 100 + '%';
				this.barThree = '0%';
				this.barFour = '0%';
				break;
			case 0:
				this.barOne = numWhole * 100 + '%';
				this.barTwo = '0%';
				this.barThree = '0%';
				this.barFour = '0%';
				break;
			default:
				this.barOne = '0%';
				this.barTwo = '0%';
				this.barThree = '0%';
				this.barFour = '0%';
				break;
		}
		
	}
}