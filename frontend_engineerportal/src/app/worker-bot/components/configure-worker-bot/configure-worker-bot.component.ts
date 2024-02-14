import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

import { WorkerBotService } from '../../services/worker-bot.service';
import { UtilService } from '../../../services/util.service';
import { WorkerBot } from '../../../model/worker-bot';
import { MasterBot } from '../../../model/master-bot';

@Component({
  selector: 'converse-configure-worker-bot',
  templateUrl: 'configure-worker-bot.component.html',
  styleUrls: ['configure-worker-bot.component.sass']
})
export class ConfigureWorkerBotComponent implements OnInit, OnDestroy {
  workerBotId: string;
  masterBotName: string;
  masterBotId: string;
  title: string;
  prevPage: string;
  sideBarLinks: any = [
    { tabName: 'Configuration', path: 'configuration' },
    { tabName: 'Use Cases', path: 'use-cases' },
    { tabName: 'Conversation Logs', path: 'conversation-log' },
    { tabName: 'Train NLP', path: 'train-nlp' }
  ];
  workerBotSubscription: Subscription;
  botServiceSubscription: Subscription;
  routeParamSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private workerBotService: WorkerBotService,
    private utilService: UtilService
  ) {
    // Resetting worker bot
    this.workerBotService.publishWorkerBot(new WorkerBot());
  }

  ngOnInit(): void {
    this.routeParamSubscription = this.route.params.subscribe((params: Params) => {
      this.workerBotId = params['id'];
      this.getWorkerBot();
    });
    this.botServiceSubscription = this.workerBotService.workerBot$.subscribe((workerBot: WorkerBot) => {
      this.setPagetitle(workerBot.botName);
    });
  }

  /**
   * @description to set Page Navigation titles
   * @param {string} workerBotName - worker bot name to set page title
   */
  private setPagetitle(workerBotName: string): void {
    this.title = workerBotName + ' Configuration';
  }

  getWorkerBot() {
    this.workerBotSubscription = this.workerBotService.getWorkerBot(this.workerBotId).subscribe(
      (workerBot: WorkerBot) => {
        this.masterBotId = workerBot.masterBotId;
        this.setPagetitle(workerBot.botName);
        this.utilService.setSessionStorage('currentWorkerBot', { id: this.workerBotId, name: this.title });
        this.masterBotName = this.utilService.getSessionStorage(this.masterBotId);
        if (!this.masterBotName) {
          this.workerBotService.getMasterBot(this.masterBotId).subscribe(
            (masterBot: MasterBot) => {
              this.masterBotName = masterBot.botName;
            },
            (error: any) => {
              // log error or redirect to dashboard
              this.navigateToDashboard();
            }
          );
        }
        this.prevPage = this.masterBotName + "'s Performance";
        // Publish worker bot date to child route component
        this.workerBotService.publishWorkerBot(workerBot);
      },
      (error: any) => {
        // log error or redirect to dashboard
        this.navigateToDashboard();
      }
    );
  }

  redirectToMasterBotDashboard(): void {
    this.router.navigate(['masterbot', this.masterBotId]);
  }

  navigateToDashboard(): void {
    this.router.navigate(['dashboard']);
  }

  ngOnDestroy(): void {
    this.routeParamSubscription.unsubscribe();
    this.workerBotSubscription.unsubscribe();
    this.botServiceSubscription.unsubscribe();
  }
}
