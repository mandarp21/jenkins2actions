import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { UtilService } from '../services/util.service';

import { AppService } from '../services/app.service';
import { DashboardService } from './services/dashboard.service';

import { DateFilter } from '../model/date-filter.interface';
import { MasterBot } from '../model/master-bot';
import { Analytics } from '../model/analytics';
import { FeedbackInterface } from '../model/feed-back.interface';

@Component({
  selector: 'converse-dashboard',
  styleUrls: ['dashboard.component.sass'],
  templateUrl: 'dashboard.component.html'
})

/**
 * @internal
 * This class is a  component that displays Engineering View Dashboard.
 *
 */
export class DashboardComponent implements OnInit, OnDestroy {
  toMaxDate: string;
  fromMaxDate: string;
  fromDate: string;
  toDate: string;
  toMinDate: string;
  dateFilter: DateFilter;

  masterBots: Array<MasterBot>;
  botData: Array<MasterBot>;
  analytics: Analytics;
  intentMatched: any;
  botType: string;
  isAnalyticsFullFilled: boolean;
  totalUnits: number;

  intentAnalytics: {
    title: string;
    units: string;
    totalUnits: string;
  };

  automationAnalytics: {
    title: string;
    units: string;
    totalUnits: string;
  };

  escalationAnalytics: {
    title: string;
    units: string;
    totalUnits: string;
  };

  custSatifactionAnalytics: {
    title: string;
    units: string;
    totalUnits: string;
    barChartData: Array<FeedbackInterface>;
  };

  botHeaders = [
    { headerName: 'Name', colname: 'botName', type: 'greenlabel', id: 'botId' },
    { headerName: 'Intents Matched', colname: 'intentsMatched' },
    { headerName: 'Automation Rate', colname: 'automation' },
    { headerName: 'Escalation', colname: 'escalation' },
    { headerName: 'Customer Satisfaction', colname: 'customerSatisfaction', type: 'rating' },
    { headerName: 'Last Modified', colname: 'lastModified', type: 'date' }
  ];

  constructor(
    private appService: AppService,
    private router: Router,
    private dashboardService: DashboardService,
    private utilService: UtilService
  ) {
    this.toDate = moment().format('DD-MMM-YYYY');
    this.fromDate = moment()
      .subtract(1, 'months')
      .format('DD-MMM-YYYY');
    this.toMaxDate = moment().format('DD-MMM-YYYY');
    this.fromMaxDate = moment()
      .subtract(1, 'days')
      .format('DD-MMM-YYYY');
    this.toMinDate = moment(
      moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD')
    )
      .add(1, 'days')
      .format('DD-MMM-YYYY');
    this.setDateFilter({
      fromDate: moment()
        .subtract(1, 'months')
        .format('DDMMYYYY'),
      toDate: moment().format('DDMMYYYY')
    });

    this.automationAnalytics = {
      title: 'Automation Rate',
      units: undefined,
      totalUnits: undefined
    };
    this.escalationAnalytics = {
      title: 'Escalation',
      units: undefined,
      totalUnits: undefined
    };
    this.custSatifactionAnalytics = {
      title: 'Customer Satisfaction',
      units: undefined,
      totalUnits: undefined,
      barChartData: []
    };
    this.intentAnalytics = {
      title: 'Intents Matched',
      units: undefined,
      totalUnits: undefined
    };
    this.botType = 'Master';
  }

  ngOnInit() {
    this.refreshAnalyticsData(this.dateFilter);
  }

  refreshData($event) {
    this.refreshAnalyticsData(this.dateFilter);
  }

  private refreshAnalyticsData(datefilter: DateFilter) {
    if (this.masterBots) {
      this.getAnalytics(datefilter);
    } else {
      this.getAnalyticsWithBot(datefilter);
    }
  }

  private getAnalyticsWithBot(dateFilter: DateFilter): void {
    this.isAnalyticsFullFilled = true;
    this.dashboardService.listMasterBot(this.utilService.getAdminId())
      .subscribe(async (masterBots: Array<MasterBot>) => {
        const analytics: any = await forkJoin(
          this.appService.getUseCaseAnalytics(dateFilter.fromDate, dateFilter.toDate),
          this.appService.getIntentMatched(dateFilter.fromDate, dateFilter.toDate)
        )
        .toPromise()
        .catch(error => {
          this.isAnalyticsFullFilled = false;
        });
        this.processAnalytics([masterBots, ...analytics]);
      },
        (error: any) => {
          // log error
        });

  }

  private getAnalytics(dateFilter: DateFilter): void {
    this.isAnalyticsFullFilled = false;
    forkJoin(
      this.appService.getUseCaseAnalytics(dateFilter.fromDate, dateFilter.toDate),
      this.appService.getIntentMatched(dateFilter.fromDate, dateFilter.toDate)
    ).subscribe(
      (response: any) => {
        this.isAnalyticsFullFilled = true;
        this.processAnalytics(response, true);
      },
      (error: any) => {
        // log error
        this.processAnalytics([], true);
      }
    );
  }

  private processAnalytics(response: any, botExists: boolean = false): void {
    this.masterBots = botExists ? this.masterBots : response[0];
    this.analytics = botExists ? response[0] : response[1];
    this.intentMatched = botExists ? response[1] : response[2];
    this.automationAnalytics.units = 'N/A';
    this.automationAnalytics.totalUnits = 'N/A';
    this.escalationAnalytics.units = 'N/A';
    this.escalationAnalytics.totalUnits = 'N/A';
    this.custSatifactionAnalytics.units = 'N/A';
    this.custSatifactionAnalytics.totalUnits = 'N/A';
    this.custSatifactionAnalytics.barChartData = new Array<FeedbackInterface>();
    this.intentAnalytics.units = 'N/A';
    this.intentAnalytics.totalUnits = 'N/A';

    if (this.analytics) {
      // Prints N/A when value == 0. Otherwise, print X%.
      let outputAutomationRate = this.analytics.automationData['totalAutomationData']['totalAutomationRate'];
      this.automationAnalytics.totalUnits = this.analytics.automationData['totalAutomationData']['totalUseCases'];
      this.automationAnalytics.units = (Number(this.automationAnalytics.totalUnits) > 0) ? (outputAutomationRate + '%') : 'N/A';

      let outputEscalationRate = this.analytics.escalationData['totalEscalationData']['totalEscalationRate'];
      this.escalationAnalytics.totalUnits = this.analytics.escalationData['totalEscalationData']['totalUseCases'];
      this.escalationAnalytics.units = (Number(this.escalationAnalytics.totalUnits) > 0) ? (outputEscalationRate + '%') : 'N/A';

      let outputSatisfactionRate = this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalRating'];
      this.custSatifactionAnalytics.totalUnits = this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalFeedbackRequested'];
      this.custSatifactionAnalytics.units = (Number(this.custSatifactionAnalytics.totalUnits) > 0) ? (outputSatisfactionRate) : 'N/A';

      // Converting to percentage for customer satisfaction bar chart
      this.totalUnits = parseInt(this.custSatifactionAnalytics.totalUnits);
      this.custSatifactionAnalytics.barChartData.push({
        title: 'V. Satisfied',
        count: (this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalVerySatisfied'] === 0 && this.totalUnits === 0) ? 0 : (this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalVerySatisfied'] / this.totalUnits) * 100
      });
      this.custSatifactionAnalytics.barChartData.push({
        title: 'Satisfied',
        count: (this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalSatisfied'] === 0 && this.totalUnits === 0) ? 0 : (this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalSatisfied'] / this.totalUnits) * 100
      });
      this.custSatifactionAnalytics.barChartData.push({
        title: ' Unsatisfied',
        count: (this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalUnsatisfied'] === 0 && this.totalUnits === 0) ? 0 : (this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalUnsatisfied'] / this.totalUnits) * 100
      });
      this.custSatifactionAnalytics.barChartData.push({
        title: ' V. Unsatisfied',
        count: (this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalVeryUnsatisfied'] === 0 && this.totalUnits === 0) ? 0 : (this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalVeryUnsatisfied'] / this.totalUnits) * 100
      });
      this.custSatifactionAnalytics.barChartData.push({
        title: ' No Feedback',
        count: (this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalNoFeedback'] === 0 && this.totalUnits === 0) ? 0 : (this.analytics.customerSatisfaction['totalCustomerSatisfaction']['totalNoFeedback'] / this.totalUnits) * 100
      });
    }
    
    // Prints the Intents Matched value for the main dashboard.
    if (this.intentMatched) {
      // Prints out N/A if 0 intents matched. Prints out x% if .totalUnits is more than 0.
      let outputIntentMatched = this.intentMatched['intentsMatchedData']['totalIntentsMatchedData']['totalIntentsMatched'];
      this.intentAnalytics.totalUnits = this.intentMatched['intentsMatchedData']['totalIntentsMatchedData']['totalIntents'];
      this.intentAnalytics.units = (Number(this.intentAnalytics.totalUnits) > 0) ? (outputIntentMatched + '%') : 'N/A';
    }

    const masterBots = JSON.stringify(this.masterBots);
    this.botData = [];

    JSON.parse(masterBots).forEach(value => {
      this.botData.push(new MasterBot().deserialize(value, false));
    });
  this.botData.forEach((masterBot: MasterBot, index: number) => {
      // Analytics breakdown per masterbot in main dashboard's masterbot list table.
      // Sets the table values to 'N/A' by default.
      this.botData[index].automation = 'N/A';
      this.botData[index].escalation = 'N/A';
      this.botData[index].customerSatisfaction = 'N/A';
      this.botData[index].barChartData = new Array<FeedbackInterface>();
      this.botData[index].intentsMatched = 'N/A';

      if (this.analytics) {
        const botAutomation = this.analytics.automationData['masterBotAutomationData'].find(
          automation => automation.masterBotId === masterBot.botId
        );
        if (botAutomation != undefined) {
          let localBotAutoRate = botAutomation['masterBotAutomationRate'];
          this.botData[index].automation = (localBotAutoRate + '%');
          /* this.botData[index].automation = {
            useCases: botAutomation['masterBotUseCases'],
            automationRate: botAutomation['masterBotAutomationRate']
          }; */
        } else {
          this.botData[index].automation = 'N/A';
        }

        const botEscalation = this.analytics.escalationData['masterBotEscalationData'].find(
          escalation => escalation.masterBotId === masterBot.botId
        );
        if (botEscalation != undefined) {
          this.botData[index].escalation = (botEscalation['masterBotEscalationRate'] + '%');
          /*  this.botData[index].escalation = {
             useCases: botEscalation['masterBotUseCases'],
             escalationRate: botEscalation['masterBotEscalationRate']
           }; */
        } else {
          this.botData[index].escalation = 'N/A';
        }

        const botCustSatisfaction = this.analytics.customerSatisfaction['masterBotCustomerSatisfaction'].find(
          customerSatisfaction => customerSatisfaction.masterBotId === masterBot.botId
        );
        if (botCustSatisfaction) {
          let localBotSatisRate = botCustSatisfaction['masterBotRating'];
          this.botData[index].customerSatisfaction = (localBotSatisRate > 0) ? localBotSatisRate : 'N/A';

          this.totalUnits = botCustSatisfaction['masterBotVerySatisfied'] + botCustSatisfaction['masterBotSatisfied'] + botCustSatisfaction['masterBotUnsatisfied'] + botCustSatisfaction['masterBotVeryUnsatisfied'] + botCustSatisfaction['masterBotNoFeedback']
          this.botData[index].barChartData.push({
            title: 'V. Satisfied',
            count: (botCustSatisfaction['masterBotVerySatisfied'] === 0 && this.totalUnits === 0) ? 0 : (botCustSatisfaction['masterBotVerySatisfied'] / this.totalUnits) * 100
          });
          this.botData[index].barChartData.push({
            title: 'Satisfied',
            count: (botCustSatisfaction['masterBotSatisfied'] === 0 && this.totalUnits === 0) ? 0 : (botCustSatisfaction['masterBotSatisfied'] / this.totalUnits) * 100
          });
          this.botData[index].barChartData.push({
            title: ' Unsatisfied',
            count: (botCustSatisfaction['masterBotUnsatisfied'] === 0 && this.totalUnits === 0) ? 0 : (botCustSatisfaction['masterBotUnsatisfied'] / this.totalUnits) * 100
          });
          this.botData[index].barChartData.push({
            title: ' V. Unsatisfied',
            count: (botCustSatisfaction['masterBotVeryUnsatisfied'] === 0 && this.totalUnits === 0) ? 0 : (botCustSatisfaction['masterBotVeryUnsatisfied'] / this.totalUnits) * 100
          });
          this.botData[index].barChartData.push({
            title: ' No Feedback',
            count: (botCustSatisfaction['masterBotNoFeedback'] === 0 && this.totalUnits === 0) ? 0 : (botCustSatisfaction['masterBotNoFeedback'] / this.totalUnits) * 100
          });
        } else { // push empty values to display bar chart
          this.botData[index].barChartData.push({ title: 'V. Satisfied', count: 0 });
          this.botData[index].barChartData.push({ title: 'Satisfied', count: 0 });
          this.botData[index].barChartData.push({ title: ' Unsatisfied',count: 0 });
          this.botData[index].barChartData.push({ title: ' V. Unsatisfied', count: 0 });
          this.botData[index].barChartData.push({ title: ' No Feedback', count: 0 });
        }
      }

      if (this.intentMatched) {
        const botIntentMatched = this.intentMatched['intentsMatchedData']['masterBotIntentsMatchedData'].find(
          intentMatched => intentMatched.masterBotId === masterBot.botId
        );
        if (botIntentMatched != undefined) {
          // Per worker bot analytics data
          let localBotIntentMatched = botIntentMatched['masterBotIntentsMatched'];
          this.botData[index].intentsMatched = (localBotIntentMatched + '%');
          /*  this.botData[index].intentsMatched = {
             intents: botIntentMatched['masterIntents'],
             intentsMatched: botIntentMatched['masterBotIntentsMatched']
           }; */
        } else {
          this.botData[index].intentsMatched = 'N/A';
        }
      }
    });
  }

  handleClick(btnText: string) {
    this.refreshAnalyticsData(this.dateFilter);
  }

  private setDateFilter(datefilter: DateFilter) {
    this.dateFilter = datefilter;
  }

  /**
   * @internal
   * This method handles the data change event from data picker control.
   */
  onDateChanged($event: { type: string; date: Date }) {
    if ($event.type === 'toDate') {
      this.toDate = moment($event.date.toISOString()).format('DD-MMM-YYYY');
      this.fromMaxDate = moment($event.date.toISOString())
        .subtract(1, 'days')
        .format('DD-MMM-YYYY');
      this.setDateFilter({
        toDate: moment($event.date.toISOString()).format('DDMMYYYY'),
        fromDate: this.dateFilter.fromDate
      });
    }
    if ($event.type === 'fromDate') {
      this.fromDate = moment($event.date.toISOString()).format('DD-MMM-YYYY');
      this.toMinDate = moment($event.date.toISOString())
        .add(1, 'days')
        .format('DD-MMM-YYYY');
      this.setDateFilter({
        fromDate: moment($event.date.toISOString()).format('DDMMYYYY'),
        toDate: this.dateFilter.toDate
      });
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['masterbot/create']);
  }

  redirectTo(botId) {
    this.router.navigate(['masterbot', botId, 'configure']);
  }

  showConv(botId) {
    this.router.navigate(['masterbot', botId, 'conversation']);
  }

  ngOnDestroy(): void { }
}
