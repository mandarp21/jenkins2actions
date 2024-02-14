import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServiceAPIs } from '../../core/services/service-apis.service';
import { Variable } from '../model/variable.model';
import { Conversation } from '../model/conversation.model';
import { UseCases } from '../../model/use-cases';
import { ToastrService } from 'ngx-toastr';
import { DropDownOption } from '../../model/dropdown-option.model';
import * as helper from '../utilities/helper';
import { NodeComponent } from '../components/node/node.component';
import { UtilService } from 'src/app/services/util.service';
import { WorkerBotService } from '../../worker-bot/services/worker-bot.service';
import { APP_MESSAGE } from '../../app-constant';

@Injectable()
export class ConversationService {
  private conversationData = new BehaviorSubject<Object>({});
  private toggleModal = new BehaviorSubject<boolean>(false);
  private activeComponent = new BehaviorSubject<Object>(null);
  private useCaseData = new BehaviorSubject<UseCases>(null);
  private variablesList = new BehaviorSubject<Array<string>>([]);
  private workerBotId = new BehaviorSubject<string>('');
  private variablesOptions = new BehaviorSubject<Array<DropDownOption>>([]);
  private variableDetails = new BehaviorSubject<Object>(null); // contains extra information about each of the apis i.e.
  private conversationFlows = new BehaviorSubject<Array<Conversation>>([]);
  private activeChannel = new BehaviorSubject<string>('');
  private variable = new BehaviorSubject<Variable>(null);
  private linkActive = new BehaviorSubject<string>(null);
  private activeExternalRef = new BehaviorSubject<NodeComponent>(null);
  private overlayTrigger = new BehaviorSubject<boolean>(null);
  private copyChannelsTrigger = new BehaviorSubject<boolean>(false);
  private treeContainer: HTMLElement;
  private nodeComponents: any[];
  private flowData;
  private isUpdateInProgress = false;
  private firstNode = false;

  // accessible outside of the service as an observable
  showCreateUseCaseModal = this.toggleModal.asObservable();
  convDataObs = this.conversationData.asObservable();
  activeComponentObs = this.activeComponent.asObservable();
  useCaseDataObs = this.useCaseData.asObservable();
  variablesListObs = this.variablesList.asObservable();
  workerBotIdObs = this.workerBotId.asObservable();
  variablesOptionsObs = this.variablesOptions.asObservable();
  variableDetailsObs = this.variableDetails.asObservable();
  conversationFlowsObs = this.conversationFlows.asObservable();
  activeChannelObs = this.activeChannel.asObservable();
  variableObs = this.variable.asObservable();
  linkActiveObs = this.linkActive.asObservable();
  activeExternalRefObs = this.activeExternalRef.asObservable();
  overlayTriggerObs = this.overlayTrigger.asObservable();
  copyChannelsObs = this.copyChannelsTrigger.asObservable();

  hasUnsavedChanges = false;

  constructor(
    private http: HttpClient,
    private serviceAPIs: ServiceAPIs,
    private toastr: ToastrService,
    private utilService: UtilService,
    private workerBotService: WorkerBotService
  ) {}

  toggleCreateUseCaseModal() {
    const newVal = this.toggleModal.value === true ? false : true;
    this.toggleModal.next(newVal); // toggle the value
  }

  /**
   * @description Used to set the active channel i.e. Voice, Web etc.
   * @param channel
   */
  setActiveChannel(channel) {
    this.activeChannel.next(channel);
  }

  /**
   * @description set the variable options available
   */
  setVariablesOptions(data) {
    this.variablesOptions.next(data);
  }

  /**
   * @description set the active component for overlay states
   */
  setActiveComponent(component) {
    this.activeComponent.next(component);
    this.setFirstNode(false);
  }

  /**
   * @description set the variable to be edited
   */
  setVariable(variable) {
    this.variable.next(variable);
  }

  /**
   * @description change if the link state is active
   */
  setLinkActive(value) {
    this.linkActive.next(value);
  }

  /**
   * @description set active external reference to display
   */
  setActiveExternalRef(value) {
    this.activeExternalRef.next(value);
  }

  /**
   * @description hides the overlay
   * @param value boolean (true to open, false to close)
   */
  hideOverlay(value) {
    this.overlayTrigger.next(value);
  }
  copyChannels(value) {
    this.copyChannelsTrigger.next(value);
  }

  /**
   * @description set the workerBotId
   */
  setWorkerBotId(id) {
    this.workerBotId.next(id);
  }

  /**
   * @description set the treeContainer property
   */
  setTreeContainer(data) {
    this.treeContainer = data;
  }

  /**
   * @description set the nodeComponents property
   */
  setNodeComponents(data) {
    this.nodeComponents = data;
  }

  /**
   * @description generates random ID
   */
  generateID() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }

  /**
   * @description resets the sidebar
   */
  resetSideBar() {
    this.toggleModal.next(undefined);
  }

  /**
   * @description opens the sidebar
   */
  showSideBar() {
    this.toggleModal.next(true);
  }

  /**
   * @description closes the sidebar
   */
  closeSideBar() {
    this.toggleModal.next(false);
    this.activeComponent.next(null);
  }

  /**
   * @description checks if sidebar is open
   */
  isSideBarOpen() {
    return this.toggleModal;
  }

  setConversationData(data: Object) {
    this.conversationData.next(data);
  }

  getConversationData() {
    return this.conversationData;
  }

  setUseCaseData(data) {
    this.useCaseData.next(data);
  }

  /**
   * @description Sets the  conversationFlows array
   * @param data - Array of conversation flows
   */
  setConversationFlows(data) {
    this.conversationFlows.next(data);
  }

  /**
   * @description Sets the firstNode value
   * @param value - value to be assigned to firstNode
   */
  setFirstNode(value) {
    this.firstNode = value;
  }

  /**
   * @description Returns the firstNode value
   */
  isFirstNode() {
    return this.firstNode;
  }

  /**
   * @description updates the conversation data
   * @param saveData should it also save the conversation to DB when done
   */
  updateConversationData(saveData: boolean) {
    if (!this.isUpdateInProgress) {
      this.flowData = [];
      this.isUpdateInProgress = true;

      let nodesToSave = this.nodeComponents.filter(
        item => item.type === 'flow-card' || item.type === 'eval-condition-card' || (item.type === 'reference-card' && item.useCaseId)
      );
      const entryNodes = this.getEntryNodes();

      // sort nodes so that the flow data will always start with the entry nodes
      for (let i = entryNodes.length; i > 0; i--) {
        const node = nodesToSave.find(item => item.id === 'entrypoint' + i);
        if (node) {
          // remove the node from the array and insert it at the start of it
          nodesToSave = nodesToSave.filter(item => item !== node);
          nodesToSave.unshift(node);
        }
      }

      for (let i = 0; i < nodesToSave.length; i++) {
        this.createNodeDataObject(nodesToSave[i]);
      }

      this.finalizeData(saveData);
    }
  }

  /**
   * @description Http call to get conversation
   * @param { string } conversationFlowId conversation flow id
   * @return { Conversation } - Conversation class object
   */
  getConversation(conversationFlowId: string): Observable<Conversation> {
    const requestUrl = this.serviceAPIs.getApiUrl('GET_CONVERSATION') + '/' + conversationFlowId;
    return this.http.get<Conversation>(requestUrl).pipe(
      map((response: any) => {
        return new Conversation().deserialize(response);
      })
    );
  }

  /**
   * @description http request to get list of conversation associated with usecase
   * @param { string } useCaseID UseCase id
   * @return { Array<Conversation> } - Conversation class object
   */
  listConversationFlows(useCaseID: string, saveToArray: boolean): Observable<Array<Conversation>> {
    const requestUrl = this.serviceAPIs.getApiUrl('LIST_CONVERSATION_FLOW') + '/' + useCaseID;
    return this.http.get<Array<any>>(requestUrl).pipe(
      map((response: any) => {
        const conversationFlows: Array<Conversation> = [];
        if (response.length) {
          response.forEach(data => {
            conversationFlows.push(new Conversation().deserialize(data));
          });
        }
        if (saveToArray) {
          this.setConversationFlows(conversationFlows);
        }
        return conversationFlows;
      })
    );
  }

  /**
   * @description Http call to create conversation
   * @param { any } payload request payload to create conversation
   * @return { Conversation } - Conversation class object
   */
  createConversation(payload: any): Observable<Conversation> {
    const requestUrl = this.serviceAPIs.getApiUrl('CREATE_CONVERSATION');
    return this.http.post<Conversation>(requestUrl, payload).pipe(
      map((response: any) => {
        return new Conversation().deserialize(response);
      })
    );
  }
  /**
   * @description Http call to update conversation
   * @param { any } payload request payload to update conversation
   * @return { Conversation } - Conversation class object
   */
  updateConversation(payload: any): any {
    const requestUrl = this.serviceAPIs.getApiUrl('UPDATE_CONVERSATION');
    console.log(payload);
    return this.http.put<Conversation>(requestUrl, payload).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  /**
   * @description Http call to update conversation
   * @param { string } useCaseId usecase id to get usecase
   * @return { UseCases } - UseCases class object
   */
  getUseCase(useCaseId: string): Observable<UseCases> {
    const requestUrl = this.serviceAPIs.getApiUrl('GET_USE_CASE') + '/' + useCaseId;
    return this.http.get<UseCases>(requestUrl).pipe(
      map((response: any) => {
        return new UseCases().deserialize(response);
      })
    );
  }
  /**
   * @description Http call to get the list of Variables
   * @return { Array } - Array of all Variables in DB
   */
  listVariables(): Promise<any> {
    const requestUrl =
      this.serviceAPIs.getApiUrl('LIST_VARIABLES') + '/' + JSON.parse(this.utilService.getSessionStorage('currentMasterBot')).id;
    return new Promise((resolve, reject) => {
      this.http
        .get(requestUrl)
        .toPromise()
        .then(response => {
          this.variableDetails.next(response); // store extra info about each of the Variables
          const variablesList = [];
          for (let i = 0; i < response['length']; i++) {
            variablesList.push(response[i].name);
          }
          this.variablesList.next(variablesList);
          resolve(new DropDownOption().deserializeApi(response)); // strip out just the name - used for creating the dropdown
        })
        .catch(error => reject(error));
    });
  }

  /**
   * @description Http call to get the list of Variables
   * @return { Array } - Array of all Variables in DB
   */
  listVariablesFull(): Promise<any> {
    const requestUrl =
      this.serviceAPIs.getApiUrl('LIST_VARIABLES') + '/' + JSON.parse(this.utilService.getSessionStorage('currentMasterBot')).id;
    return new Promise((resolve, reject) => {
      this.http
        .get(requestUrl)
        .toPromise()
        .then(response => {
          this.variableDetails.next(response); // store extra info about each of the Variables
          console.log(response);
          resolve(response); // return the whole API list
        })
        .catch(error => reject(error));
    });
  }

  /**
   * @description Post request to create a new Variable
   * @param payload The body of the request to send - this should contain the api configuration
   */
  createVariable(payload): Promise<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('CREATE_VARIABLE');
    return new Promise((resolve, reject) => {
      this.http
        .post(requestUrl, payload)
        .toPromise()
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  /**
   * @description post request to update a existing Variable
   * @param payload The body of the request to send - this should contain the api configuration
   */
  updateVariable(payload): Promise<any> {
    const requestUrl = this.serviceAPIs.getApiUrl('UPDATE_VARIABLE');
    return new Promise((resolve, reject) => {
      this.http
        .put(requestUrl, payload)
        .toPromise()
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  /**
   * @description goes through the treeComponent and finds all the entry node HTML elements
   */
  getEntryNodes() {
    const entryNodesLi = this.treeContainer.lastChild['children'];
    const entryNodes = [];
    for (let i = 0; i < entryNodesLi.length; i++) {
      const entryNodeComponent = this.findNodeByNativeElement(entryNodesLi[i].firstChild);
      if (entryNodeComponent && entryNodeComponent.type === 'flow-card') {
        entryNodes.push(entryNodesLi[i].firstChild);
      }
    }
    return entryNodes;
  }

  /**
   * @description goes through the treeComponent and finds all the entry node HTML elements
   * @param nodeElem HTML element of the node to create object for
   * @param saveData should it also save the conversation to DB when done
   */
  createNodeDataObject(node) {
    const nodeElem = node.nativeElement;
    let nodeData;
    if (node.type === 'flow-card' && node.user) {
      // Create user card data
      nodeData = {
        currentStep: node.id,
        owner: 'user',
        stepType: node.slotFilling ? 'slotFilling' : 'step',
        nlc: [
          {
            intent: node.intent || '',
            entities: node.entities || []
          }
        ],
        nextSteps: this.findNextSteps(nodeElem),
        description: node.description || ''
      };
    } else if (node.type === 'flow-card') {
      // Create bot card data
      nodeData = {
        currentStep: node.id,
        owner: 'bot',
        stepType: 'step',
        responseType: node.botType,
        response: typeof node.messages === 'string' ? JSON.parse(node.messages) : node.messages || [],
        responseConfig: this.getBotResponseConfig(node),
        nextSteps: this.findNextSteps(nodeElem),
        description: node.description || '',
        endFlow: node.endFlow || false
      };

      // Add Regex Config if node has it
      if (node.regexVariable) {
        nodeData.responseConfig['regexConfig'] = {
          variableName: node.regexVariable,
          boolMask: node.regexBoolMask ? true : false
        };
      }
    } else if (node.type === 'eval-condition-card') {
      // Create condition card data
      nodeData = {
        currentStep: node.id,
        owner: node.conditionType === 'variable' ? 'bot' : 'user',
        stepType: 'conditionEval',
        nlc: [
          {
            intent: node.intent || '',
            entities: node.entities || []
          }
        ],
        nextSteps: this.findNextSteps(nodeElem),
        responseType: 'conditionEval',
        description: node.title || '',
        responseConfig: this.getBotResponseConfig(node),
        endFlow: node.endFlow || undefined
      };
    } else if (node.type === 'reference-card' && node.useCaseId) {
      // Create external reference card data
      nodeData = {
        currentStep: node.id,
        owner: 'referenceUseCase',
        nextSteps: [],
        responseType: 'conditionEval',
        responseConfig: {
          workerBotId: node.workerBotId,
          workerBotName: node.description,
          useCaseId: node.useCaseId,
          useCaseName: node.title,
          nextStepName: node.nextStepName,
          nextSteps: [node.nextStep]
        }
      };
    }

    // add nodeData to the conversation if not already present
    if (!this.flowData.find(item => item.currentStep === node.id)) {
      this.flowData.push(nodeData);
        }
  }

  /**
   * @description creates the responseConfig based on the stepType and other attributes in form
   * @param form submitted form
   * @returns responseConfig property for bot responses
   */
  getBotResponseConfig(form: any) {
    if (form.botType === 'options') {
      return { buttons: [] };
    } else if (form.botType === 'crsl') {
      return { carousel: typeof form.carouselImages === 'string' ? JSON.parse(form.carouselImages) : form.carouselImages };
    } else if (form.botType === 'variable') {
      return { variables: form.variables };
    } else if (form.conditionType === 'variable') {
      return { conditionStatement: form.conditionStatement };
    } else if (form.botType === 'feedbackTiles') {
      return { feedbackTiles: form.feedbackTiles };
    } else if (form.botType === 'feedbackReqMsg') {
      return { feedbackReqMsg: form.feedbackReqMsg };
    } else if (form.botType === 'datepicker') {
      switch (form.selectedDateRestriction) {
        case helper.DATE_RESTRICTION_OPTIONS_ENUM.PDO:
          return { datepicker: { allowFutureDates: false, allowPastDates: true } };
        case helper.DATE_RESTRICTION_OPTIONS_ENUM.FDO:
          return { datepicker: { allowFutureDates: true, allowPastDates: false } };
        default:
          // no restriction
          return { datepicker: { allowFutureDates: true, allowPastDates: true } };
      }
    } else if (form.botType === 'dynamicButtons') {
      return {
        selectedApi: form.selectedApi,
        dynamicButtonsIterableProperty: form.dynamicButtonsIterableProperty
      };
    }

    return {};
  }

  /**
   * @description creates array of nextSteps for node data
   * @param nodeElem element to get nextSteps for
   * @returns array of child node IDs
   */
  findNextSteps(nodeElem) {
    const childWrapperList = nodeElem.parentElement.lastChild.children;
    const nextSteps = [];

    //go through all child html elements and create the nextSteps array
    for (let i = 0; i < childWrapperList.length; i++) {
      const node = this.findNodeByNativeElement(childWrapperList[i].firstChild);
      if (node && (node.type === 'diverging-add-card' || node.type === 'add-card')) {
        return this.findNextSteps(node.nativeElement);
      } else if (node && (node.type === 'flow-card' || node.type === 'eval-condition-card')) {
        nextSteps.push(node.id);
      } else if (node && node.type === 'reference-card' && node.useCaseId) {
        nextSteps.push(node.id);
      } else if (node && node.type === 'reference-card') {
        nextSteps.push(node.refId);
      }
    }

    return nextSteps;
  }

  /**
   * @description finds NodeComponent by nativeElement
   * @param elem nativeElement to find nodeComponent for
   * @returns nodeComponent that was found
   */
  findNodeByNativeElement(elem) {
    return this.nodeComponents.find(item => item.nativeElement === elem);
  }

  /**
   * @description make final edits to the conversation data and make the api request to save conversation.
   * These edits require the flow data to already have all of the data elements inside since some
   * properties are coming from the parents or children of the node
   * @param saveData should it also save the conversation to DB when done
   */
  async finalizeData(saveData: boolean) {
    // get entry node IDs
    const entryNodes = this.getEntryNodes().map(item => this.findNodeByNativeElement(item).id);

    for (let i = 0; i < entryNodes.length; i++) {
      const oldID = entryNodes[i];
      const newID = 'entrypoint' + (i + 1);
      const entryNodeData = this.flowData.find(item => item.currentStep === oldID);
      entryNodeData.currentStep = newID;
      this.flowData.forEach(item => {
        if (item.nextSteps.includes(oldID)) {
          item.nextSteps[item.nextSteps.indexOf(oldID)] = newID;
        }
      });
    }

    const botData = this.flowData.filter(item => item.owner === 'bot' && item.stepType === 'step');
    botData.forEach(botStep => {
      botStep.nlc = [];

      // map intents and entities for all bot steps
      for (let i = 0; i < this.flowData.length; i++) {
        if (this.flowData[i].nextSteps.indexOf(botStep.currentStep) !== -1 && this.flowData[i].owner === 'user') {
          botStep.nlc.push(this.flowData[i].nlc[0]);
        }
      }

      // add buttons array to the response config of buttons responses
      if (botStep.responseType === 'options') {
        const buttonsCards = this.flowData.filter(item => botStep.nextSteps.indexOf(item.currentStep) !== -1);

        botStep.responseConfig.buttons = buttonsCards.map(item => item.description);
      }
    });

    this.isUpdateInProgress = false;

    if (saveData) {
      this.saveConversation(null);
    }
  }

  /**
   * @description save conversation to database
   * @param conversation (optional) conversation to be saved
   */
  async saveConversation(conversation) {
    const useCaseData = this.useCaseData.getValue();

    // if conversation to be saved is not passed to this function, it saves the current conversation with updated flow
    if (!conversation) {
      conversation = this.conversationData.getValue();
      conversation['flow'] = this.flowData;

      // update entryNLC settings for intents and entities from all entry points
      const entryPointNodes = this.flowData.filter(item => item.currentStep.startsWith('entrypoint'));
      const entryNLC = [];
      for (let i = 0; i < entryPointNodes.length; i++) {
        entryNLC.push(entryPointNodes[i].nlc[0]);
      }
      useCaseData['entryNLC'] = entryNLC;

      // get an array of all entities used in entry nodes
      const entryEntities = new Array(entryNLC.map(item => item.entities)).reduce((arr, elem) => arr.concat(...elem), []);

      //if any of the entry entites has  an entryPrompt property, add a conversationtype property to the use case
      // if (entryEntities.find(item => item.entityPrompt)) {
      //   useCaseData['conversationType'] = 'slotFilling';
      // } else {
      //   useCaseData['conversationType'] = 'conversationType';
      // }
    }

    useCaseData['updatedBy'] = this.utilService.getAdminFullName();
    // update the value
    this.setUseCaseData(useCaseData);
    // map the data to be able to post
    const useCaseToPost = useCaseData.mapToPostApi(useCaseData);

    // raise warning if any leaf node not checked for endFlow
    const leafNodesWithOutEndFlowStatus = conversation.flow.filter(node => {
      return node.nextSteps.length === 0 && !node.endFlow;
    });

    if (leafNodesWithOutEndFlowStatus.length) {
      this.toastr.warning(APP_MESSAGE.END_FLOW_NOT_CHECKED);
    }

    // update the use case
    await this.workerBotService
      .updateUseCases(useCaseToPost)
      .toPromise()
      .catch(err => {});

    this.updateConversation(conversation).subscribe(
      (response: any) => {
        console.log('Updated conversation ' + JSON.stringify(response));
        this.toastr.success('Conversation saved successfully');
        this.setActiveChannel(conversation.channel);
        this.hasUnsavedChanges = false;
      },
      (error: any) => {
        // log error
        this.toastr.error(error, 'Error saving conversation');
      }
    );
  }

  /**
   * @description checks if the conversation flow is empty
   */
  isFlowEmpty() {
    return this.nodeComponents.length < 2;
  }
}
