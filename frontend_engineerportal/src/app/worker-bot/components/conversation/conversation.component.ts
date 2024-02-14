import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { WorkerBotService } from '../../services/worker-bot.service';

@Component({
	selector: 'worker-conversation',
	styleUrls: ['conversation.component.sass'],
	templateUrl: 'conversation.component.html'
})
export class ConversationComponent implements OnInit {

	workerBotId:string;
	masterBotId:string;
	masterBotName:string;
	workerBotName:string;

	private activeRouteSubscriber: Subscription;

	constructor(
    private router: Router,
    private route: ActivatedRoute,
    private workerBotService: WorkerBotService
  ) {
    
  }

  ngOnInit() {
    this.workerBotId = this.route.parent.snapshot.paramMap.get('id');
    this.getWorkerBot();
  }

  getWorkerBot() {
    this.workerBotService.getWorkerBot(this.workerBotId).subscribe((bot) => {
			this.masterBotId = bot.masterBotId;
			this.workerBotName = bot.botName;
      if (sessionStorage.getItem(this.masterBotId)) {
        this.masterBotName = sessionStorage.getItem(this.masterBotId);
      }
    });
  }
	
	redirectToWorkerBotDashboard(): void {
    this.router.navigate(['masterbot', this.masterBotId]);
  }

}