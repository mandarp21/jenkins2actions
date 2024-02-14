import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationExtras } from '@angular/router';

import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { Subscription } from 'rxjs/internal/Subscription';

import { AppService } from '../../../services/app.service';
import { ImportService } from '../../../services/import.service';
import { MasterBotService } from '../../services/master-bot.service';

import { APP_MESSAGE } from '../../../app-constant';
import { DateFilter } from '../../../model/date-filter.interface';
import { MasterBot } from '../../../model/master-bot';
import { WorkerBot } from '../../../model/worker-bot';
import { Analytics } from '../../../model/analytics';
import { Variable } from '../../../bot-builder/model/variable.model';
import { FeedbackInterface } from '../../../model/feed-back.interface';
import { UtilService } from '../../../services/util.service';
import { ConversationService } from '../../../bot-builder/services/conversation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'master-bot-performance',
  styleUrls: ['performance.component.sass'],
  templateUrl: 'performance.component.html'
})

/**
 * @internal
 * This class is a  component that displays Engineering View Dashboard.
 * @param {boolean} toolTipFlag - flag to enable/disable tooltip on click for Variables Section
 */
export class PerformanceComponent implements OnInit, OnDestroy {
  @ViewChild('cardEditor')
  cardEditor;

  toMaxDate: string;
  fromMaxDate: string;
  fromDate: string;
  toDate: string;
  toMinDate: string;
  dateFilter: DateFilter;
  askToUpload = false;

  masterBotId: string;
  botName: string;
  botType: string;
  masterBot: MasterBot;
  workerBots: Array<WorkerBot>;
  botData: Array<WorkerBot>;
  analytics: Analytics;
  intentMatched: any;
  isAnalyticsFullFilled: boolean;
  totalUnits: number;
  filterTxt: string;
  toolTipFlag = true;

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

  navigationExtras: NavigationExtras;
  title: string;
  prevPage: string;
  listVariablesSubscriber: Subscription;
  variables: Array<Variable>;
  forFiltedList: Array<Variable>;
  variable: Variable;
  showCreateUseCaseModal: boolean;
  overlay: boolean;

  botHeaders = [
    { headerName: 'Name', colname: 'botName', type: 'greenlabel', id: 'botId' },
    { headerName: 'Intents Matched', colname: 'intentsMatched' },
    { headerName: 'Automation Rate', colname: 'automation' },
    { headerName: 'Escalation', colname: 'escalation' },
    { headerName: 'Customer Satisfaction', colname: 'customerSatisfaction', type: 'rating' },
    { headerName: 'Last Modified', colname: 'lastModified', type: 'date' }
  ];

  // Subscribers
  activeRouteSubscriber: Subscription;
  resetVariables: boolean;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private masterBotService: MasterBotService,
    private utilService: UtilService,
    private conversationService: ConversationService,
    private toastr: ToastrService,
    private importService: ImportService
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
    // Overlay initiated with false
    this.overlay = false;
    // To reset sidebar current state
    this.conversationService.resetSideBar();
    this.resetVariables = false;
  }

  ngOnInit() {
    this.activeRouteSubscriber = this.route.params.subscribe((params: Params) => {
      this.masterBotId = params['id'];
      // Check This Master Bot Exists in session storage
      if (sessionStorage.getItem(this.masterBotId)) {
        this.botName = sessionStorage.getItem(this.masterBotId);
        this.initPageParams(this.botName);
        this.refreshAnalyticsData(this.dateFilter, this.masterBotId);
      } else {
        this.masterBotService.getMasterBot(this.masterBotId);
      }
    });
    // To list apis
    this.listVariables();
    // To subscribe sidebar current state
    this.conversationService.showCreateUseCaseModal.subscribe(val => (this.showCreateUseCaseModal = val));
  }

  private getMasterBot(botID: string) {
    this.masterBotService.getMasterBot(botID).subscribe(
      (response: MasterBot) => {
        this.masterBot = response;
        this.refreshAnalyticsData(this.dateFilter, botID);
        this.initPageParams(this.masterBot.botName);
      },
      (error: any) => {
        // log error
        this.router.navigate(['dashboard']);
      }
    );
  }

  private initPageParams(botName: string) {
    this.botType = 'Worker';
    this.title = this.botName + "'s Performance";
    this.prevPage = this.botName + "'s Configuration";
    this.navigationExtras = {
      queryParams: {
        masterBotID: this.masterBotId
      }
    };
  }

  refreshData($event) {
    this.refreshAnalyticsData(this.dateFilter, this.masterBotId);
  }

  private refreshAnalyticsData(datefilter: DateFilter, botID: string) {
    if (this.workerBots) {
      this.getAnalytics(datefilter, botID);
    } else {
      this.getAnalyticsWithBot(datefilter, botID);
    }
  }

  private getAnalyticsWithBot(dateFilter: DateFilter, botID: string): void {
    this.isAnalyticsFullFilled = true;
    this.masterBotService.listWorkerBots(botID).subscribe(
      async (workerBots: Array<WorkerBot>) => {
        const analytics: any = await forkJoin(
          this.appService.getUseCaseAnalytics(dateFilter.fromDate, dateFilter.toDate, botID),
          this.appService.getIntentMatched(dateFilter.fromDate, dateFilter.toDate, botID)
        )
          .toPromise()
          .catch(error => {
            this.isAnalyticsFullFilled = false;
          });
        this.processAnalytics([workerBots, ...analytics]);
      },
      (error: any) => {
        // log error
      }
    );
  }

  private getAnalytics(dateFilter: DateFilter, botID: string): void {
    this.isAnalyticsFullFilled = false;
    forkJoin(
      this.appService.getUseCaseAnalytics(dateFilter.fromDate, dateFilter.toDate, botID),
      this.appService.getIntentMatched(dateFilter.fromDate, dateFilter.toDate, botID)
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
    this.workerBots = botExists ? this.workerBots : response[0];
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

    // Setting default Worker Bot in session
    const defaultWorkerBot = this.workerBots.find(data => data.botName === 'Default Worker Bot' || data.botName === 'Default');
    if (defaultWorkerBot) {
      this.utilService.setSessionStorage('defaultWorkerBotId', { id: defaultWorkerBot.botId, name: defaultWorkerBot.botName });
    }
    if (this.analytics) {
      let localMBotAutoRate = this.analytics.automationData['masterBotAutomationData']['masterBotAutomationRate'];
      this.automationAnalytics.totalUnits = this.analytics.automationData['masterBotAutomationData']['masterBotUseCases'];
      this.automationAnalytics.units = (Number(this.automationAnalytics.totalUnits) > 0) ? (localMBotAutoRate + '%') : 'N/A';

      let localMBotEscRate = this.analytics.escalationData['masterBotEscalationData']['masterBotEscalationRate'];
      this.escalationAnalytics.totalUnits = this.analytics.escalationData['masterBotEscalationData']['masterBotUseCases'];
      this.escalationAnalytics.units = (Number(this.escalationAnalytics.totalUnits) > 0) ? (localMBotEscRate + '%') : 'N/A';

      let localMBotSatisRate = this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotRating'];
      this.custSatifactionAnalytics.totalUnits = this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotFeedbackRequested'];
      this.custSatifactionAnalytics.units = (Number(this.custSatifactionAnalytics.totalUnits) > 0) ? (localMBotSatisRate) : 'N/A';

      // Converting to percentage for customer satisfaction bar chart
      this.totalUnits = parseInt(this.custSatifactionAnalytics.totalUnits);

      this.custSatifactionAnalytics.barChartData.push({
        title: 'V. Satisfied',
        count: (this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotVerySatisfied'] === 0 && this.totalUnits === 0) ? 0 : (this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotVerySatisfied'] / this.totalUnits) * 100
      });
      this.custSatifactionAnalytics.barChartData.push({
        title: 'Satisfied',
        count: (this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotSatisfied'] === 0 && this.totalUnits === 0) ? 0 : (this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotSatisfied'] / this.totalUnits) * 100
      });
      this.custSatifactionAnalytics.barChartData.push({
        title: ' Unsatisfied',
        count: (this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotUnsatisfied'] === 0 && this.totalUnits === 0) ? 0 : (this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotUnsatisfied'] / this.totalUnits) * 100
      });
      this.custSatifactionAnalytics.barChartData.push({
        title: ' V. Unsatisfied',
        count: (this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotVeryUnsatisfied'] === 0 && this.totalUnits === 0) ? 0 : (this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotVeryUnsatisfied'] / this.totalUnits) * 100
      });
      this.custSatifactionAnalytics.barChartData.push({
        title: ' No Feedback',
        count: (this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotNoFeedback'] === 0 && this.totalUnits === 0) ? 0 : (this.analytics.customerSatisfaction['masterBotCustomerSatisfaction']['masterBotNoFeedback'] / this.totalUnits) * 100
      });
    }

    if (this.intentMatched && this.intentMatched['intentsMatchedDataWithMasterBotId']) {
      let localIntentMatchedUnits     = this.intentMatched['intentsMatchedDataWithMasterBotId']['masterBotIntentsMatchedData']['masterBotIntentsMatched'];
      this.intentAnalytics.totalUnits = this.intentMatched['intentsMatchedDataWithMasterBotId']['masterBotIntentsMatchedData']['masterBotIntents'];
      this.intentAnalytics.units      = (Number(this.intentAnalytics.totalUnits) > 0) ? (localIntentMatchedUnits + '%') : 'N/A';
    }

    const workerBots = JSON.stringify(this.workerBots);
    this.botData = [];
    JSON.parse(workerBots).forEach(value => {
      this.botData.push(new WorkerBot().deserialize(value, false));
    });
    this.botData.forEach((workerbot: WorkerBot, index: number) => {
      // Analytics breakdown per workerbot in main dashboard's masterbot list table.
      this.botData[index].automation = 'N/A';
      this.botData[index].escalation = 'N/A';
      this.botData[index].customerSatisfaction = 'N/A';
      this.botData[index].barChartData = new Array<FeedbackInterface>();
      this.botData[index].intentsMatched = 'N/A';

      if (this.analytics) {
        // if this.analytics exist, do the following:
        const botAutomation = this.analytics.automationData['workerBotAutomationData'].find(
          automation => automation.workerBotId === workerbot.botId
        );

        if (botAutomation != undefined) {
          let locWBotAutoRate = botAutomation['workerBotAutomationRate'];
          this.botData[index].automation = (locWBotAutoRate + '%');
          /* this.botData[index].automation = {
            useCases: botAutomation['workerBotUseCases'],
            automationRate: botAutomation['workerBotAutomationRate']
          }; */
        } else {
          this.botData[index].automation = 'N/A';
        }

        const botEscalation = this.analytics.escalationData['workerBotEscalationData'].find(
          escalation => escalation.workerBotId === workerbot.botId
        );
        if (botEscalation != undefined) {
          let locWBotEscRate = botEscalation['workerBotEscalationRate'];
          this.botData[index].escalation = (locWBotEscRate + '%');
          /*  this.botData[index].escalation = {
             useCases: botEscalation['workerBotUseCases'],
             escalationRate: botEscalation['workerBotEscalationRate']
           }; */
        } else {
          this.botData[index].escalation = 'N/A';
        }

        const botCustSatisfaction = this.analytics.customerSatisfaction['workerBotCustomerSatisfaction'].find(
          customerSatisfaction => customerSatisfaction.workerBotId === workerbot.botId
        );

        if (botCustSatisfaction) {
          this.botData[index].customerSatisfaction = botCustSatisfaction['workerBotRating'];
          this.totalUnits =
            botCustSatisfaction['workerBotVerySatisfied'] +
            botCustSatisfaction['workerBotSatisfied'] +
            botCustSatisfaction['workerBotUnsatisfied'] +
            botCustSatisfaction['workerBotVeryUnsatisfied'] +
            botCustSatisfaction['workerBotNoFeedback'];
          this.botData[index].barChartData.push({
            title: 'V. Satisfied',
            count: (botCustSatisfaction['workerBotVerySatisfied'] === 0 && this.totalUnits === 0) ? 0 : (botCustSatisfaction['workerBotVerySatisfied'] / this.totalUnits) * 100
          });
          this.botData[index].barChartData.push({
            title: 'Satisfied',
            count: (botCustSatisfaction['workerBotSatisfied'] === 0 && this.totalUnits === 0) ? 0 : (botCustSatisfaction['workerBotSatisfied'] / this.totalUnits) * 100
          });
          this.botData[index].barChartData.push({
            title: ' Unsatisfied',
            count: (botCustSatisfaction['workerBotUnsatisfied'] === 0 && this.totalUnits === 0) ? 0 : (botCustSatisfaction['workerBotUnsatisfied'] / this.totalUnits) * 100
          });
          this.botData[index].barChartData.push({
            title: ' V. Unsatisfied',
            count: (botCustSatisfaction['workerBotVeryUnsatisfied'] ===  0 && this.totalUnits === 0) ? 0 : (botCustSatisfaction['workerBotVeryUnsatisfied'] / this.totalUnits) * 100
          });
          this.botData[index].barChartData.push({
            title: ' No Feedback',
            count: (botCustSatisfaction['workerBotNoFeedback'] === 0 && this.totalUnits === 0) ? 0 : (botCustSatisfaction['workerBotNoFeedback'] / this.totalUnits) * 100
          });
        } else { // push empty values to display bar chart
          this.botData[index].barChartData.push({ title: 'V. Satisfied',count: 0 });
          this.botData[index].barChartData.push({ title: 'Satisfied',count: 0 });
          this.botData[index].barChartData.push({ title: ' Unsatisfied',count: 0 });
          this.botData[index].barChartData.push({ title: ' V. Unsatisfied',count: 0 });
          this.botData[index].barChartData.push({ title: ' No Feedback',count: 0 });
        }
      }
      if (this.intentMatched != undefined) {
        // if (this.intentMatched is set), do this.
        if (this.intentMatched['intentsMatchedDataWithMasterBotId']['workerBotIntentsMatchedData']) {
          const botIntentMatched = this.intentMatched['intentsMatchedDataWithMasterBotId']['workerBotIntentsMatchedData'].find(
            intentMatched => intentMatched.workerBotId === workerbot.botId
          );
          if (botIntentMatched && botIntentMatched['workerBotIntentsMatched']) {
            this.botData[index].intentsMatched = botIntentMatched['workerBotIntentsMatched'] + '%';
            /*  this.botData[index].intentsMatched = {
               intents: botIntentMatched['masterIntents'],
               intentsMatched: botIntentMatched['masterBotIntentsMatched']
             }; */
          }
        }
      } else {
          this.botData[index].intentsMatched = 'N\A';
      }
    });
  }

  handleClick(btnText: string) {
    this.refreshData(this.fromDate);
  }

  redirectToConfig() {
    this.router.navigate(['masterbot', this.masterBotId, 'configure']);
  }

  navigateToCreate(): void {
    this.router.navigate(['workerbot/create'], this.navigationExtras);
  }

  redirectTo(botID) {
    this.router.navigate(['workerbot', botID]);
  }

  private setDateFilter(datefilter: DateFilter) {
    this.dateFilter = datefilter;
  }

  /**
   * @internal
   * This method handles the data change event from data picker control.
   */

  showConv(botId) {
    this.router.navigate(['workerbot', botId, 'conversation']);
  }

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

  ngOnDestroy(): void {
    this.activeRouteSubscriber.unsubscribe();
  }

  /**
   * @description - Method - To get Variable API List
   * @returns - void
   */
  listVariables() {
    this.listVariablesSubscriber = this.masterBotService.listVariables().subscribe(
      response => {
        this.variables = response;
        this.forFiltedList = this.variables; // this is added for variables search filtering
      },
      error => {
        // Log Error
      }
    );
  }

  /**
   * @description - Method - To delete Variable API
   * @param {string} apiId - apiId to delete
   * @returns - void
   */
  deleteApiVariable(apiId: string) {
    this.masterBotService.deleteApiVariable(apiId).subscribe(
      response => {
        this.toastr.success(APP_MESSAGE.DELETE_VARIABLE_SUCCESS, 'Success');
        this.listVariables();
      },
      error => {
        // Log Error
        this.toastr.error(APP_MESSAGE.DELETE_VARIABLE_FAILED, 'Something went wrong');
      }
    );
  }

  openVariablesSideBar(variable?: Variable) {
    this.conversationService.setVariable(variable);
    this.cardEditor.header = variable ? 'Edit Variable' : 'New Variable';
    this.conversationService.showSideBar();
    this.overlay = true;
    this.resetVariables = true;
  }

  /**
   * @description overlay click event handler
   */
  closeOverlay() {
    this.overlay = false;
    this.listVariables();
    if (this.conversationService.isSideBarOpen().getValue()) {
      this.conversationService.closeSideBar();
    }
  }

  /**
   * @description Handles various different on click events
   * @param {any} data - contains information about the event
   */
  handleEventClicked(data: any): void {
    switch (data.action) {
      case 'deleteVariable':
        this.deleteApiVariable(data.variableId);
        break;
      case 'editVariable':
        this.openVariablesSideBar(data.variable);
        break;
      case 'closeSideBar':
        if (data['actionDone']) {
          this.listVariables();
        }
        this.conversationService.closeSideBar();
        this.closeOverlay();
        break;
      default:
        break;
    }
  }

  /**
   * @internal
   * This method is called on click of search icon in intents filter pop up
   */

  filterItems(searchVal?: string): void {
    this.filterTxt = searchVal ? searchVal : this.filterTxt;
    if (this.filterTxt.length > 2) {
      this.variables = this.forFiltedList.filter((item: any) => {
        return item.name.toLocaleLowerCase().indexOf(this.filterTxt.toLocaleLowerCase()) !== -1;
      });
    } else {
      this.variables = this.forFiltedList;
    }
  }
  /**
   * @description Export API variables for the Master Bot to a JSON file
   */
  exportApiVariables(): void {
    const now = new Date();
    const currentDate = now.getDate() + '-'
      + (now.getMonth() + 1) + '-'
      + now.getFullYear() + '_' + now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds();
    const filename = `VARIABLES_EXPORT_${currentDate}.json`;
    this.masterBotService.exportVariables().subscribe((variables) => {
      const variablesJSON = JSON.stringify(variables,null, "\t");
      const file = new Blob([variablesJSON], {type: 'application/json;charset=utf-8'});
      if (navigator.appVersion.toString().indexOf('.NET') > 0) { // for IE browser
        window.navigator.msSaveBlob(file, filename);
      } else { // for other browsers
        const url = URL.createObjectURL(file);
        this.downloadUrl(url, filename);
      }
    }, (error) => {
      if (error){
        this.toastr.error('Error occured while exporting Variables', 'FAILED');
      }
    })
  }
  /**
   * @description Download the Variables as JSON file
   */
  downloadUrl(url: string, filename?: string): void {
    const hiddenAnchor = document.createElement('a');
    hiddenAnchor.href = url;
    hiddenAnchor.target = '_blank';
    hiddenAnchor.style.display = 'none';
    if (filename) {
      (<any>hiddenAnchor).download = filename;
    }
    document.body.appendChild(hiddenAnchor);
    hiddenAnchor.click();
  }
  /**
   * @description Open the File Explorer to select the file to import Variables
   */
  openFileBrowser(event: any): void {
    event.preventDefault();
     const element: HTMLElement = document.getElementById('variableFile') as HTMLElement;
     element.click();
  }
  /**
   * @description Call Import API to save the Variables imported from JSON in DB
   */
  onFileChange(event: any) {
    const files = event.target.files;
    if(files.length > 0) {
      const file = files[0];
      if (file['type'] !== 'application/json') {
        this.toastr.error('Please select a JSON file', 'FAILED');
      } else {
        const masterBotId = JSON.parse(this.utilService.getSessionStorage('currentMasterBot')).id;
        this.importService.importAndSave('IMPORT_VARIABLES', file, masterBotId).subscribe((response) => {
          console.log('Response', response);
          if (response && response.length > 0) {
            this.listVariables();
            this.toastr.success('Variables imported successfully', 'SUCCESS');
          }
        }, (error) => {
         if (error && error.status === 400){
            this.toastr.error('Variable(s) name already in use', 'FAILED');
          } else {
            this.toastr.error('Error occured while importing Variables', 'FAILED');
          }
        });
      }
    }

  }
}
