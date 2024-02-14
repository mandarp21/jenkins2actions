import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
	selector: 'master-conversation',
	styleUrls: ['conversation.component.sass'],
	templateUrl: 'conversation.component.html'
})
export class ConversationComponent implements OnInit {

	masterBotId:string;
	private activeRouteSubscriber: Subscription;

	constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    
  }

  ngOnInit() {
    this.activeRouteSubscriber = this.route.params.subscribe((params: Params) => {
			this.masterBotId = params['id'];
			//get conversation logs
    });
    
    document.getElementById('notification').hidden = true;

	}
	
	/**
	 * @description Navigate back to dashboard
	 */
  back(): void {
    this.router.navigate(['dashboard']);
  }

}