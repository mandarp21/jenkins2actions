import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { WorkerBotService } from '../../services/worker-bot.service';
import { DropDownOption } from '../../../model/dropdown-option.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Utterance } from '../../../model/utterance';
import { formatDate } from '@angular/common';

@Component({
  selector: 'converse-train-nlp',
  styleUrls: ['train-nlp.component.sass'],
  templateUrl: 'train-nlp.component.html'
})

/**
 * @description - Component to create Train NLP
 * @param {any} utteranceHeaders - Utterance header header items for the table
 * @param {any} utteranceList - list containing utterances
 * @param {any} reclassifyUtteranceHeaders - reclassify Utterance header header items for the table
 * @param {Array<Utterance>} reclassifyUtteranceList - reclassify list containing utterances to be displayed under reclassify
 * @param {Array<DropDownOption>} intentOptionList - list containing Intent Options
 * @param {string} workerBotId - Contains worker bot ID
 * @param {Subscription} listIntentoptionsSubscription - used for observable object
 * @param {boolean} paginationFlag - pagination flag
 * @param {number} listLenght - used to keep list lenght
 * @param {any} itemList - List containing utterance list which is being displayed using pagination
 * @param {boolean} isFiltersShown - Flat to check filter
 * @param {any} filterList - Filter list containing Intents
 * @param {any} toggleAddUtteranceToolTip - toggle tooltip for Add New Utterances section
 */
export class TrainNlpComponent implements OnInit, OnDestroy {
  utteranceHeaders: any;
  utteranceList: any;
  reclassifyUtteranceHeaders: any;
  reclassifyUtteranceList: Array<Utterance>;
  intentOptionList: Array<DropDownOption> = new Array<DropDownOption>();
  workerBotId: string;
  listIntentoptionsSubscription: Subscription;
  paginationFlag: boolean;
  listLenght: number;
  itemList: any;
  isFiltersShown: boolean;
  filteredList: any;
  selectedItems: any;
  filterCol: string;
  reclasifyList: Array<Utterance>;
  placeTxt: string;
  filterText: string;
  isDetailsShown: boolean;
  itemHeaders: any;
  conversationDetails: any;
  masterBotId: string;
  masterBotName: string;
  workerBotName: string;
  displayCount: number;
  toggleAddUtteranceToolTip = false;

  constructor(private route: ActivatedRoute, private workerBotService: WorkerBotService, private toastr: ToastrService) {
    this.paginationFlag = true;
    this.isFiltersShown = false;
    this.filterCol = 'selectedOption';
    this.placeTxt = 'Search for an Utterance';
    this.displayCount = 10;
  }

  ngOnInit() {
    this.initHeaders();
    this.filterText = '';
    this.workerBotId = this.route.parent.snapshot.paramMap.get('id');
    // Get the Intent list from BE and store it in conversation service
    this.getIntentList();
    // get the Intent list
    this.listIntentoptionsSubscription = this.workerBotService.intentListOptionObs.subscribe((data: DropDownOption[]) => {
      if (data.length > 0) {
        this.intentOptionList = Array.from(data);
        this.utteranceList[0]['intentOptions'] = this.intentOptionList;
        this.reclassifyUtteranceHeaders.find(header => header.colname === 'selectedOption').options = this.intentOptionList;
        // Populate NLC Logs after getting Intents
        this.populateNlcLogs();
      }
    });
    this.selectedItems = [];
    this.conversationDetails = {
      conversationId: '',
      status: '',
      intent: '',
      dateTime: '',
      channel: ''
    };

    this.workerBotId = this.route.parent.snapshot.paramMap.get('id');
    this.getWorkerBot();
  }

  /**
   * @description Get worker bot details
   */
  getWorkerBot() {
    this.workerBotService.getWorkerBot(this.workerBotId).subscribe(bot => {
      this.masterBotId = bot.masterBotId;
      this.workerBotName = bot.botName;
      if (sessionStorage.getItem(this.masterBotId)) {
        this.masterBotName = sessionStorage.getItem(this.masterBotId);
      }
    });
  }

  /**
   * @description Helper method to Initialised required variables such as headers and list
   * @return void
   */
  initHeaders(): void {
    // Initialise Utterace header
    this.utteranceHeaders = [
      { headerName: 'Utterance', colname: 'uttername', width: '25%', type: 'text-no', noSort: true },
      { headerName: 'Intents', colname: 'intentOptions', width: '15%', type: 'pre-selected-dropdown', noSort: true },
      { headerName: 'Approve', colname: 'approve', width: '5%', type: 'approve', noSort: true },
      { headerName: 'Delete', colname: 'delete', width: '5%', type: 'delete', noSort: true }
    ];
    // Initialise Rectify header
    this.reclassifyUtteranceHeaders = [
      {
        headerName: 'Conversation',
        colname: 'convBtn',
        width: '5%',
        type: 'button',
        noSort: true,
        action: 'showConversationLog',
        buttonIcon: 'conversation-log',
        actionValue: 'sessionId'
      },
      { headerName: 'Utterance', colname: 'uttername', width: '26%', type: 'text', noSort: true },
      {
        headerName: 'Intents',
        colname: 'selectedOption',
        width: '15%',
        type: 'pre-selected-dropdown',
        noSort: true,
        filter: true,
        filterIntents: true,
        action: 'changeIntent'
      },
      { headerName: 'Confidence Score', colname: 'confidenceScore', width: '8%', type: 'text-decimal', noSort: false },
      {
        headerName: 'Approve',
        colname: 'approve',
        width: '5%',
        type: 'button',
        noSort: true,
        action: 'approve',
        buttonIcon: 'approve',
        actionValue: 'sessionId'
      },
      {
        headerName: 'Delete',
        colname: 'delete',
        width: '5%',
        type: 'button',
        noSort: true,
        action: 'delete',
        buttonIcon: 'delete',
        actionValue: 'sessionId'
      }
    ];
    // Initialise utterance list
    this.utteranceList = [
      {
        uttername: '',
        intentOptions: [],
        selectedOption: 'Select Intent',
        approve: '',
        delete: ''
      }
    ];
  }

  /**
   * @description Method to get Intent list and push to Intent obserbable object
   * @return void
   */
  private getIntentList(): void {
    this.workerBotService
      .getIntentList(this.workerBotId)
      .then(result => {
        this.workerBotService.setIntentListOption(result);
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
   * @description Helper method to call worker bot service and populate NLC Logs on the page
   * @return void
   * [reclassifyUtteranceList]: reclassify uttrance table data from API
   * [reclasifyList]: reclassify uttrance table data sent as input to component
   */
  async populateNlcLogs() {
    this.reclassifyUtteranceList = [];
    this.reclasifyList = [];
    await this.workerBotService
      .getNLCLogs(this.workerBotId)
      .then(result => {
        result['NLCLog'].forEach(nlcLog => {
          const utteranceObj = new Utterance().deserialize(nlcLog);
          const intentOps: DropDownOption[] = this.intentOptionList;
          utteranceObj.intentOptions = intentOps;
          this.reclassifyUtteranceList.push(utteranceObj);
        });
      })
      .catch(error => {
        console.log(error);
      });
    this.reclasifyList = this.reclassifyUtteranceList;
    console.log(this.reclasifyList);
  }

  /**
   * @description Reclassify Utterance Event Listener
   * @param event - event object emitted
   * @return void
   * @argument reqBody - contains request Body
   */
  reclassifyUtteranceEventListener(event, item): void {
    // console.log({ event, item });
    const reqBody = {
      status: event.action,
      intent: item.selectedOption,
      messageLogId: item.messageLogId,
      utterance: item.uttername,
      workerBotId: this.workerBotId
    };
    this.reclassifyUtterance(reqBody);
  }

  /**
   * @description Add Utterance Event Listener
   * @param event - event object emitted
   * @return void
   * @argument reqBody - contains request body
   */
  addUtteranceEventListener(event): void {
    // ignore delte button click
    if (event.status === 'delete') return;
    if (!event.uttername || !event.selectedOption || event.selectedOption === 'Select Intent') {
      console.log('Missing Utterance or Intent...');
      return;
    }
    const reqBody = {
      workerBotId: this.workerBotId,
      intentName: event.selectedOption,
      utterance: event.uttername
    };
    this.addUtterance(reqBody);
  }

  /**
   * @description Method to call worker bot service to add utterance
   * @param { any } requestBody containing the required field for the request
   */
  addUtterance(requestBody: any): void {
    this.workerBotService
      .addUtternace(requestBody)
      .then(result => {
        var successResult = [];
        var failedResult = [];
        for (var i = 0; i < result.length; i++) {
          if (result[i].includes('true')) {
            successResult.push(result[i]);
          } else if (result[i].includes('false')) {
            failedResult.push(result[i]);
          }
        }
        if (successResult && successResult.length && typeof successResult.includes('true')) {
          this.toastr.success(
            JSON.stringify(successResult)
              .replace(/["\[\]]/g, '')
              .replace(/true/g, ''),
            'Added Utterance to '
          );
        }
        if (failedResult && failedResult.length && typeof failedResult.includes('false')) {
          this.toastr.error(
            JSON.stringify(failedResult)
              .replace(/["\[\]]/g, '')
              .replace(/false/g, ''),
            'Unable to add Utterance to '
          );
        }
      })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to add Utterance', 'Failed');
      });
  }

  /**
   * @description Method to call worker bot service to reclassify utterance
   * @param { any } requestBody containing the required field for the request
   */
  reclassifyUtterance(requestBody: any): void {
    this.workerBotService
      .reclassifyUtternace(requestBody)
      .then(result => {
        if (result === '200 OK') {
          this.toastr.success('Reclassified Utterance', 'Success');
          this.populateNlcLogs();
        } else {
          this.toastr.error('Unable to reclassify Utterance', 'Failed');
        }
      })
      .catch(error => {
        console.log(error);
        this.toastr.error('Unable to reclassify Utterance', 'Failed');
      });
  }

  ngOnDestroy(): void {
    if (this.listIntentoptionsSubscription) {
      this.listIntentoptionsSubscription.unsubscribe();
    }
  }

  /**
   * @description This method is called on click of intents filter link and used to populate list in filter popup and also called
   *  on click of dialogue/speech icon on uttrance column in reclassify uttrance table
   * @return void
   * @param {any} id sessionId of uttrance
   * [intentOptionList]: List to display in intent filter popup from API
   * [filteredList]: List to display in intent filter popup as input to component
   */

  showFilterList(id: any): void {
    console.log(id);
    //called on click of dialogue/speech icon on uttrance column in reclassify uttrance table
    if (id.indexOf('-') > -1) {
      this.isDetailsShown = true;
      this.itemHeaders = [
        { headerName: 'Sender', colname: 'sender', width: '20%' },
        { headerName: 'Content', colname: 'userMessage', width: '55%' },
        { headerName: 'Time', colname: 'timestamp', width: '25%' }
      ];

      this.getNplConversationDetails(id);
    }
    //called on click of intents filter link and used to populate list in filter popup
    else {
      if (this.isFiltersShown) {
        this.isFiltersShown = false;
        return;
      }
      this.filteredList = [];
      this.isFiltersShown = true;
      this.selectedItems = [];
      this.filteredList.push({ selected: false, value: 'Select All' });
      this.intentOptionList.forEach(data => {
        this.filteredList.push({ selected: false, value: data.colName });
      });
    }
  }

  /**
   * @description This method is called on click of Done in intent filters popup
   * @return Returns the filtered list from selected option in intent filter popup
   * [reclasifyList]: Filtered list after selecting option in intent filter popup
   * [selectedItems]: Selected options in intent filter popup
   */

  hideFilter() {
    this.isFiltersShown = false;
    let filteredList = [];
    this.reclasifyList = [];
    this.selectedItems.forEach(value => {
      const filtItems = this.reclassifyUtteranceList.filter((objUtterance: Utterance) => {
        return objUtterance[this.filterCol] === value;
      }); // end of filter

      filteredList = filteredList.concat(filtItems);
    }); //end of for each
    this.reclasifyList = filteredList;
  }

  /**
   * @description This method is called on click of search icon in reclasify uttrance table
   * @return Returns the filtered list in reclassify uttrance table
   * [filterText] : input filter text
   * [reclassifyUtteranceList]: reclassify uttrance table data from API
   */

  showFilter(searchVal?: string): void {
    this.filterText = searchVal ? searchVal : this.filterText;
    if (this.filterText.length) {
      this.reclasifyList = this.reclassifyUtteranceList.filter((objFilter: Utterance) => {
        return objFilter.uttername.toLocaleLowerCase().indexOf(this.filterText.toLocaleLowerCase()) !== -1;
      });
    } else {
      this.reclasifyList = this.reclassifyUtteranceList;
    }
  }

  /**
   * @description This method is called on click of cross icon in conversation log table
   */

  hideDetails() {
    this.isDetailsShown = false;
    this.itemList = [];
    this.itemHeaders = [];
  }

  /**
   * @description This method is called on click of dialogue/speech icon in reclasify uttrance table on uttrance column
   * @param convId This is session id of the clicked uttrance
   * [reclasifyList] : Complete list of uttrances
   * [filteredList]: Filtered uttrance with sessionId
   * [conversationDetails]: Data to conversation log header
   * [itemList]: Data to conversation log list
   */

  getNplConversationDetails(convId) {
    this.itemList = [];
    this.workerBotService.getNplConversationDetails(convId).subscribe(
      (data: any) => {
        const filteredList = this.reclasifyList.filter((objConv: Utterance) => objConv.sessionId === convId);
        console.log(filteredList);
        this.conversationDetails = {
          sessionId: filteredList[0].sessionId
          // status: filteredList[0].useCaseStatus,
          // name: filteredList[0].useCaseName,
          // dateTime: filteredList[0].startTimestamp,
          // channel: filteredList[0].channel
        };

        data.forEach(item => {
          const response = [];
          item.response.response.forEach(responseItem => {
            response.push(responseItem);
          });
          // TODO: Need proper fix to remove 'welcome' in the start of conversation logs
          if (item.userMessage === 'welcome') {
            this.itemList.push({ sender: this.workerBotName, userMessage: response, timestamp: item.timestamp });
          } else {
            this.itemList.push({ sender: 'User', userMessage: item.userMessage, timestamp: item.timestamp });
            this.itemList.push({ sender: this.workerBotName, userMessage: response, timestamp: item.timestamp });
          }
        });
      },
      error => {}
    );
  }

  tableActionHandler(event) {
    console.log(event);
    let item;
    switch (event.action) {
      case 'showConversationLog':
        this.showFilterList(event.data);
        break;
      case 'changeIntent':
        item = this.reclassifyUtteranceList.find(utterance => utterance.messageLogId === event.data.item.messageLogId);
        item.selectedOption = event.data.selected;
        break;
      case 'approve':
        console.log('approve');
        item = this.reclassifyUtteranceList.find(utterance => utterance.sessionId === event.data);
        this.reclassifyUtteranceEventListener(event, item);
        break;
      case 'delete':
        console.log('delete');
        item = this.reclassifyUtteranceList.find(utterance => utterance.sessionId === event.data);
        this.reclassifyUtteranceEventListener(event, item);
        break;
      default:
        break;
    }
    //
  }
}
