import {
  Component,
  OnInit,
  Compiler,
  NgModuleFactory,
  NgModule,
  Inject,
  ViewEncapsulation,
  ViewChildren,
  ViewChild,
  AfterViewInit,
  ComponentFactoryResolver,
  Renderer2,
  ApplicationRef,
  EmbeddedViewRef,
  Injector,
  ComponentRef,
  ChangeDetectorRef,
  OnDestroy,
  ElementRef
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { PanZoomConfig, PanZoomAPI } from 'ng2-panzoom';
import { Graph } from '../Graph';
import { ConversationService } from '../services/conversation.service';
import { UtilService } from '../../services/util.service';
import { BotBuilderDynamicModule } from '../bot-builder-dynamic.module';
import { NodeComponent } from '../components/node/node.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import * as helper from '../utilities/helper';
import { WorkerBotService } from '../../worker-bot/services/worker-bot.service';
import { Queue } from '../Queue';
import { ToastrService } from 'ngx-toastr';
import { branchingNodes } from '../../app-constant';

@Component({
  selector: 'conversation-flow',
  styleUrls: ['flow.component.sass', 'tree.component.sass'],
  templateUrl: 'flow.component.html'
})
export class FlowComponent implements OnInit {
  conversationTreeHTML: string;
  botType: string;
  graph: Graph;
  data: any;
  dynamicComponent;
  prevPageTitle: string;
  useCaseName: string;
  channel: string;
  workerBotId: string;
  dynamicModule: NgModuleFactory<any>;
  conversationFlowId: string;
  routeParamSubscription: Subscription;
  conversationFlows: any;
  showChatModal: boolean;
  channelsDropdownActive: boolean;
  channelsDropdownEnabled: boolean;
  channelType: string;

  constructor(
    private compiler: Compiler,
    private router: Router,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private conversationService: ConversationService,
    private workerBotService: WorkerBotService
  ) {}

  /**
   * @description Fetches the conversation json from BE
   */
  public getConversationData() {
    this.conversationService.getConversation(this.conversationFlowId).subscribe(
      async (response: any) => {
        this.data = response;

        this.conversationService.setConversationData(this.data);

        const useCaseData = await this.conversationService
          .getUseCase(response.useCaseId)
          .toPromise()
          .catch(err => {});

        this.conversationService.setUseCaseData(useCaseData);
        this.useCaseName = useCaseData['useCaseName'];
        // get all conversation flows
        this.conversationFlows = await this.conversationService
          .listConversationFlows(response.useCaseId, true)
          .toPromise()
          .catch(err => {});

        this.conversationService.conversationFlowsObs.subscribe(
          flowsList => {
            this.conversationFlows = flowsList;
            this.channelsDropdownEnabled = this.conversationFlows.length > 1;
          },
          (error: any) => {}
        );
        this.channel = response.channel;

        console.log('=========== CONV DATA (Flow) ===========');
        console.log(JSON.stringify(this.data.flow, null, 2));
        console.log('=========== CONV DATA (ExitPoint) ===========');
        console.log(JSON.stringify(this.data.exitPoint, null, 2));

        this.conversationService.resetSideBar();

        this.data.flow = this.data.flow || [];
        let entryNodes = this.data.flow.filter(item => item.currentStep.startsWith('entrypoint'));

        // fix data set if there are no nodes called 'entrypoint1' etc
        if (this.data.flow.length && !entryNodes.length) {
          const firstNode = this.data.flow[0];
          const oldID = firstNode.currentStep;
          const newID = 'entrypoint1';
          firstNode.currentStep = newID;

          // change any occurences in nextSteps of other nodes for the old ID
          for (let i = 0; i < this.data.flow.length; i++) {
            const index = this.data.flow[i].nextSteps.indexOf(oldID);
            if (index !== -1) {
              this.data.flow[i].nextSteps[index] = newID;
            }
          }
          entryNodes = [firstNode];
        }

        this.conversationService.setConversationData(this.data);

        this.graph = new Graph(this.data);
        this.conversationTreeHTML = this.graph.bfs(entryNodes);

        // create new component and module using the html returned from the graph bfs
        this.dynamicComponent = this.createNewComponent(this.conversationTreeHTML, this.conversationFlowId);

        this.dynamicModule = this.compiler.compileModuleSync(this.createComponentModule(this.dynamicComponent));
      },
      (error: any) => {
        // log error
      }
    );
  }

  handleChannelsDropdownClick() {
    if (this.channelsDropdownEnabled) {
      this.channelsDropdownActive = !this.channelsDropdownActive;
    }
  }

  async getVariableList() {
    const listVariables = await this.conversationService.listVariables().catch(err => {});
    listVariables ? this.conversationService.setVariablesOptions(listVariables) : console.log('List APIs was not set');
  }

  public ngOnInit() {
    this.channelType = '';
    const workerBot = JSON.parse(this.utilService.getSessionStorage('currentWorkerBot'));
    this.prevPageTitle = workerBot ? workerBot.name : 'N/A';
    this.workerBotId = workerBot ? workerBot.id : '';
    this.conversationService.setWorkerBotId(this.workerBotId);

    this.routeParamSubscription = this.route.params.subscribe((params: Params) => {
      this.conversationFlowId = params['conversationId'];
      this.getConversationData();
    });

    //To refresh conversation data after copying
    this.conversationService.copyChannelsObs.subscribe(isCopied => {
      if (isCopied) {
        setTimeout(() => {
          this.getConversationData();
          this.conversationService.copyChannels(false);
        }, 2000);
      }
    });

    this.conversationService.activeChannelObs.subscribe(data => {
      if (data !== this.channelType && this.conversationFlows) {
        this.channelType = data;
        const conversationFlowId = this.conversationFlows.find(item => item.channel === data).conversationFlowId;
        this.router.navigate(['conversation/view', conversationFlowId]);
      }
    });

    // Get the API list from BE and store it in converation service

    this.getVariableList();

    // Get the Intent list from BE and store it in conversation service
    this.workerBotService
      .getIntentList(this.workerBotId)
      .then(result => this.workerBotService.setIntentListOption(result))
      .catch(error => console.log(error));

    // Get the Entity list from BE and store it in conversation service
    this.workerBotService
      .getEntityList(this.workerBotId)
      .then(result => {
        this.workerBotService.setEntityListOption(result.entityOptions);
        this.workerBotService.setEntityListValues(result.entityValues);
      })
      .catch(error => console.log(error));
  }

  getActiveChannel() {
    if (this.conversationFlows) {
      const activeChannel = this.conversationFlows.find(item => item.conversationFlowId === this.conversationFlowId).channel;
      this.conversationService.setActiveChannel(activeChannel);
      this.channelType = activeChannel;
      return activeChannel;
    } else {
      this.channelType = 'web';
    }
    return this.channelType;
  }

  saveConversation() {
    this.conversationService.updateConversationData(true);
  }

  testConversation() {
    // Open chat test modal
    this.showChatModal = true;
  }

  navigateToWorkerBotConfig(): void {
    this.router.navigate(['workerbot', this.workerBotId]);
  }

  protected createComponentModule(componentType: any) {
    @NgModule({
      imports: [BotBuilderDynamicModule],
      declarations: [componentType],
      providers: [],
      entryComponents: [componentType]
    })
    class RuntimeComponentModule {}
    // a module for just this Type
    return RuntimeComponentModule;
  }

  /**
   * @description Main chunk of code on this page. Template for this is created dynamically at runtime
   * It is then manipulated to handle interactions i.e. adding nodes, deleting nodes
   * @param htmlString
   */
  protected createNewComponent(htmlString: string, convFlowId: string) {
    @Component({
      selector: 'dynamic-component',
      template: htmlString,
      styleUrls: ['tree.component.sass'],
      encapsulation: ViewEncapsulation.None
    })
    class DynamicComponent implements AfterViewInit, OnDestroy, OnInit {
      panzoomConfig: PanZoomConfig = new PanZoomConfig();
      private panZoomAPI: PanZoomAPI;
      private apiSubscription: Subscription;
      public canvasWidth = 2400;
      public initialZoomHeight: number = null; // set in resetZoomToFit()
      public initialZoomWidth = this.canvasWidth;
      public initialised = false;

      // Keep track of list of generated components for removal purposes
      formType: string;
      conversationFlowId: string = convFlowId;
      showCreateUseCaseModal: boolean;
      nodeData: {
        id: '';
      };
      addComponentClicked;
      editNodeTarget;
      editNodeTargetHTML;
      zoomAmount = 1;
      overlayMode: string;
      fromNodeData: any;

      @ViewChild('cardEditor')
      cardEditor;
      @ViewChild('treeContainer')
      treeContainer;
      @ViewChildren(NodeComponent, {})
      nodeComponents;

      overlay = false;

      constructor(
        private conversationService: ConversationService,
        @Inject(DOCUMENT) private document: any,
        private resolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private renderer: Renderer2,
        private injector: Injector,
        private toastr: ToastrService,
        private cdRef: ChangeDetectorRef
      ) {
        // Whenever this value is changed, we will know as it will emit data
        this.conversationService.showCreateUseCaseModal.subscribe(val => (this.showCreateUseCaseModal = val));
        // graph data
        // this.conversationService.convDataObs.subscribe(val => console.log(val));
      }

      /**
       * @description finds the nodeComponent instance by nativeElement
       * @param elem nativeElement of the node to be found
       */
      findComponentByNative(elem: HTMLElement) {
        return this.nodeComponents.find(item => item.nativeElement === elem);
      }

      addConditionComponent(data) {
        const divergingAddElem = this.findComponent(data.id);

        const domElemCond = this.createNodeComponent('condition', data.conditionType);
        const domElemAdd = this.createNodeComponent('add', { showLink: true });

        const li = this.wrapInListItem(domElemCond);
        const ul = this.wrapInUnorderedList(this.wrapInListItem(domElemAdd));
        li.appendChild(ul);

        const conditionElemParent = divergingAddElem.nativeElement;
        const ulElem = this.renderer.nextSibling(conditionElemParent);
        this.renderer.appendChild(ulElem, li);

        const addCard = this.nodeComponents.find(item => item.id === data.id);
        const newCardNative = addCard.nativeElement.parentElement.lastChild.lastChild.firstChild;
        const parentNative = addCard.nativeElement.parentElement.parentElement.parentElement.firstChild;

        const form = {
          owner: 'condition',
          id: this.findComponentByNative(newCardNative).id
        };

        const newCondNodeData = this.findComponentByNative(newCardNative);
        newCondNodeData.owner = 'condition';
        this.checkEndNodes();
      }

      /**
       * @description Adds component to the relevant part of the dialog designer
       * @param {any} form - The form values
       */
      addComponent(form: any) {
        let domNewElem: HTMLElement;
        let domNewElemApi: HTMLElement;
        let domNewElemCond;
        let domNewElemCondHandleError;
        let li;

        // find out if the add node clicked has children or is a leaf node
        const isLeafNode = this.findChildrenNodes(this.addComponentClicked.id).length > 0 ? false : true;

        // create the new component
        if (form.owner === 'user' || form.type === 'msg' || form.type === 'datepicker') {
          // create flow card elem
          domNewElem = this.createNodeComponent('flow', form);
        } else if (form.type === 'variable') {
          domNewElem = this.createNodeComponent('flow', form);
          domNewElemApi = this.createNodeComponent('variable', form);
          domNewElemCond = this.createNodeComponent('condition', 'variable');
          domNewElemCondHandleError = this.createNodeComponent('condition', 'variable'); // Add an handleError condition automatically
          // Change description name
          const handleErrorComp = this.findComponentByNative(domNewElemCondHandleError);
          handleErrorComp.title = 'handleError';
          this.editNodeTarget = domNewElem.id;
        } else if (form.owner === 'bot' && form.type === 'feedbackTiles') {
          domNewElem = this.createNodeComponent('flow', form);
        } else if (form.owner === 'bot' && form.type === 'feedbackReqMsg') {
          domNewElem = this.createNodeComponent('flow', form);
        } else if (form.owner === 'bot' && branchingNodes[form.type]) {
          domNewElem = this.createNodeComponent('flow', form);
          domNewElemApi = this.createNodeComponent(form.type, form);
          domNewElemCond = this.createNodeComponent('condition', form.type);
          this.editNodeTarget = domNewElem.id;
        }

        // store the add native elem - we will be adding this to our new html structure
        const domElemAdd = this.addComponentClicked.nativeElement;
        const child = this.addComponentClicked.nativeElement.parentNode;
        const parent = this.renderer.parentNode(child);
        const ulChildren = child.firstChild.nextSibling; // the existing tree below - only used when add node is not a leaf node
        if (!isLeafNode) {
          // SCENARIO: Add-Card in middle of two nodes, replace the add card
          const addNodeToReplace = child.firstChild;

          if (branchingNodes[form.type] && form.type !== 'feedbackTiles' && form.type !== 'feedbackReqMsg') {
            // different way when creating the api type node
            li = this.wrapInListItem(domNewElem);
            const liApi = this.wrapInListItem(domNewElemApi);

            const liCond = this.wrapInListItem(domNewElemCond);
            liCond.appendChild(ulChildren);
            const ulCond = this.wrapInUnorderedList(liCond);

            if (domNewElemCondHandleError) {
              const domElemAddError = this.createNodeComponent('add', { showLink: true });
              const ulAddError = this.wrapInUnorderedList(this.wrapInListItem(domElemAddError));
              const liCondError = this.wrapInListItem(domNewElemCondHandleError);
              liCondError.appendChild(ulAddError);
              ulCond.appendChild(liCondError);
            }

            liApi.appendChild(ulCond);

            li.appendChild(this.wrapInUnorderedList(liApi));

            this.replaceComponent(addNodeToReplace, li);
            // unwrap as there will be <li> => <li>. We only need one. We wrap initially so we can append
            this.unwrapElement(li);
          } else {
            this.replaceComponent(addNodeToReplace, domNewElem);
          }
        } else {
          // SCENARIO: Add-Card is a leaf node, keep the add card

          if (branchingNodes[form.type] && form.type !== 'feedbackTiles' && form.type !== 'feedbackReqMsg') {
            // different way when creating the api type node
            li = this.wrapInListItem(domNewElem);
            const liApi = this.wrapInListItem(domNewElemApi);

            const ulAdd = this.wrapInUnorderedList(this.wrapInListItem(domElemAdd));
            const liCond = this.wrapInListItem(domNewElemCond);
            liCond.appendChild(ulAdd);
            const ulCond = this.wrapInUnorderedList(liCond);

            if (domNewElemCondHandleError) {
              const domElemAddError = this.createNodeComponent('add', { showLink: true });
              const ulAddError = this.wrapInUnorderedList(this.wrapInListItem(domElemAddError));
              const liCondError = this.wrapInListItem(domNewElemCondHandleError);
              liCondError.appendChild(ulAddError);
              ulCond.appendChild(liCondError);
            }
            liApi.appendChild(ulCond);
            li.appendChild(this.wrapInUnorderedList(liApi));
          } else {
            // format the components correctly how they should be presented in the html
            li = this.wrapInListItem(domNewElem);
            const ul = this.wrapInUnorderedList(this.wrapInListItem(domElemAdd));
            li.appendChild(ul);
          }

          this.renderer.removeChild(parent, child);
          this.renderer.appendChild(parent, li);

          // if the new node is an entry node, set the relevant properties and add another add node next to it
          if (domNewElem.parentElement.parentElement.classList[0] === 'graph-parent') {
            const newNode = this.findComponentByNative(domNewElem);
            newNode.firstNode = true;
            this.addComponentClicked.firstNode = false;
            this.addEntryNode();
          }
        }

        this.addComponentClicked.showLink = true;

        // Conversation data below
        form.id = domNewElem.id;
        form.conversationFlowId = this.conversationFlowId;

        this.checkEndNodes();
      }

      /**
       * @description Adds a plus node to allow adding of another entry node
       */
      addEntryNode() {
        const domElemAdd = this.createNodeComponent('add', { showLink: false, firstNode: true });
        this.renderer.appendChild(this.treeContainer.nativeElement.lastChild, this.wrapInListItem(domElemAdd));
      }

      /**
       * @description Adds plus component in between two components
       * @param {string} id
       */
      addPlusComponent(id: string, showLink = false) {
        // 1. Find the Native Element of the target Node
        const targetNode = this.findComponent(id).nativeElement;

        // 2. Create the new Add-Card component
        const domElemAdd = this.createNodeComponent('add', { showLink: showLink });

        // 3. Find out the number of children that the component has. Sibling will be the ul which contains li (each li represents a child)
        const sibling = this.renderer.nextSibling(targetNode);
        const numOfChildren = this.getChildrenCount(sibling);

        // take all the elements out of the ul and delete the empty ul
        this.unwrapElement(sibling);

        // relevant formatting
        // store the unwrapped elements
        const children = this.renderer.nextSibling(targetNode);
        // wrap the new add element in a li
        const li = this.wrapInListItem(domElemAdd);

        if (numOfChildren > 0) {
          // wrap the unwrapped elements (the children) in a new ul
          const newUl = this.wrapInUnorderedList(children);
          // add the new unordered list to our new li
          li.appendChild(newUl);
        }

        // add our new li to the html, whilst wrapping it in an ul
        this.renderer.appendChild(targetNode.parentNode, this.wrapInUnorderedList(li));
        this.checkEndNodes();
      }

      /**
       * @description Edits the target node component based on submitted form data
       * @param {any} data - Submitted form data
       * @param {string} targetId - The ID of the target node component
       */
      editNodeComponent(data: any, targetId: string) {
        const targetComponent = this.nodeComponents.find(item => item.id === targetId);
        targetComponent.description = data.form.stepDescription ? data.form.stepDescription : '';
        targetComponent.title = helper.decideCardSubtitle(data.form);
        targetComponent.user = data.form.owner === 'user';
        targetComponent.responseType = data.form.type ? data.form.type : '';
        targetComponent.messages = data.form.messages && data.form.owner === 'bot' ? data.form.messages : [];
        targetComponent.intent = data.form.intent ? data.form.intent : '';
        targetComponent.entities = data.form.entities ? JSON.parse(JSON.stringify(data.form.entities)) : [];
        targetComponent.carouselImages = data.form.carouselImages ? data.form.carouselImages : [];
        targetComponent.feedbackTiles = data.form.feedbackTiles ? data.form.feedbackTiles : [];
        targetComponent.feedbackReqMsg = data.form.feedbackReqMsg ? data.form.feedbackReqMsg : '';
        targetComponent.variables = data.form.variables ? data.form.variables : '';
        targetComponent.selectedDateRestriction = data.form.selectedDateRestriction;
        targetComponent.dynamicButtonsIterableProperty = data.form.dynamicButtonsIterableProperty;
        targetComponent.selectedApi = data.form.selectedApi;
        targetComponent.regexVariable = data.form.regexVariable;
        targetComponent.regexBoolMask = data.form.regexBoolMask;
        targetComponent.slotFilling = data.form.slotFilling;
      }

      /**
       * @description Edits the target node reference node components based on submitted form data
       * @param {any} data - Submitted form data
       * @param {string} targetId - The ID of the target node component
       */
      editReferenceNodeComponent(data: any, targetId: string) {
        const targetReferenceComponents = this.findComponentsByRefId(targetId);
        if (targetReferenceComponents.length > 0) {
          targetReferenceComponents.forEach(referenceNode => {
            referenceNode.description = data.form.stepDescription ? data.form.stepDescription : '';
          });
        }
      }

      /**
       * @description Edits the target node reference conditional node component based on submitted form data
       * @param {any} data - Submitted form data
       * @param {string} targetId - The ID of the target node component
       */
      editRefConditionNodeComponent(data: any, targetId: string) {
        const targetReferenceComponents = this.findComponentsByRefId(targetId);
        if (targetReferenceComponents.length > 0) {
          targetReferenceComponents.forEach(referenceNode => {
            referenceNode.description = data.form.conditionDescription ? data.form.conditionDescription : '';
          });
        }
      }

      /**
       * @description Edits the target node component based on submitted form data
       * @param {any} data - Submitted form data
       * @param {string} targetId - The ID of the target node component
       */
      editApiComponent(data: any, targetId: string) {
        const targetComponent = this.nodeComponents.find(item => item.id === targetId);
        targetComponent.title = data.form.conditionDescription || '';
        targetComponent.conditionStatement = data.form.conditionStatement;
        data.form.stepType = 'condition';
      }

      /**
       * @description Edits the target node component based on submitted form data
       * @param {any} data - Submitted form data
       * @param {string} targetId - The ID of the target node component
       */
      editOptionsComponent(data: any, targetId: string) {
        const targetComponent = this.nodeComponents.find(item => item.id === targetId);
        targetComponent.title = data.form.conditionDescription || '';
        targetComponent.intent = data.form.intent;
        targetComponent.entities = data.form.entities;
        data.form.stepType = 'condition';
      }

      /**
       * @description moves all the children of the element to the parent, removes the element afterwards
       * @param {HTMLElement} elem element to unwrap
       */
      unwrapElement(elem) {
        // get the element's parent node
        const parent = elem.parentNode;
        // move all children out of the element
        while (elem.firstChild) parent.insertBefore(elem.firstChild, elem);
        // remove the empty element
        this.renderer.removeChild(parent, elem);
      }

      /**
       * @description Get the count of neighbours that are of a particular type
       * @param {HTMLElement} elem
       * @param {string} type
       * @returns {number} the number of matching neighbours
       */
      checkNeighboursForNode(elem: HTMLElement, type: string) {
        // loop through each of the li's and view first node of each
        const childNodes = Array.from(elem.childNodes);
        let numAddNodes = 0;
        childNodes.forEach(child => {
          // get the first child
          const childHTMLElem = child as HTMLElement;
          const elemNode = childHTMLElem.firstElementChild;
          // see the type of node that it is
          const foundComponent = this.nodeComponents.find(component => component.nativeElement === elemNode);
          if (foundComponent && foundComponent.type === type) {
            numAddNodes++;
          }
        });
        return numAddNodes;
      }

      /**
       * @description Get the count of children that a component has
       * @param {HTMLElement} elem
       * @returns {number} the number of children
       */
      getChildrenCount(elem: HTMLElement) {
        // loop through each of the li's and view first node of each
        let numChildren = 0;
        try {
          const childNodes = Array.from(elem.childNodes);

          childNodes.forEach(child => {
            // get the first child
            const childHTMLElem = child as HTMLElement;
            const elemNode = childHTMLElem.firstElementChild;
            // see the type of node that it is
            const foundComponent = this.nodeComponents.find(component => component.nativeElement === elemNode);
            if (foundComponent) {
              numChildren++;
            }
          });
        } catch {}

        return numChildren;
      }

      /**
       * @description Used for removing nodes where we want to delete itself and all of it's children in the branch THEN add a plus card afterwards
       * @param {string} id - id of the component to delete
       */
      removeBranchedComponentAndAdd(id) {
        // find parent - used for adding the add card
        const parentNodeElem = this.findParentComponent(id);
        let ul;
        // add new add elem
        if (parentNodeElem) {
          ul = this.renderer.nextSibling(parentNodeElem.nativeElement);
        } else {
          ul = this.findComponent(id).nativeElement.parentElement.parentElement;
        }
        const newAddElem = this.createNodeComponent('add', { showLink: true });
        this.renderer.appendChild(ul, this.wrapInListItem(newAddElem));

        // delete the branch
        this.removeBranchComponent(id);
      }

      /**
       * @description Used for removing nodes where we want to delete itself and all of it's children in the branch
       * @param {string} id - id of the component to delete
       */
      removeBranchComponent(id) {
        const elemsToDelete = this.findNodesUnderBranch(id);
        elemsToDelete.forEach(elem => this.removeComponent(elem));
        this.checkEndNodes();
      }

      /**
       * @description Find all the nodes that exist under a branch
       * @param id
       */
      findNodesUnderBranch(id) {
        const elems = [];

        // Instantiate the Queue and add our starting node
        const q = new Queue();
        q.enqueue(id);

        // Loop until queue is empty
        while (!q.isEmpty()) {
          // Get the next element from the queue
          const getQueueElement = q.dequeue();

          // push to our array
          elems.push(getQueueElement);
          // pass in id and find the children
          const children = this.findChildrenNodes(getQueueElement);

          children.forEach(child => {
            q.enqueue(child.id);
          });
        }

        return elems;
      }

      /**
       * @description Removes a component from the relevant part of the dialog designer.
       * @param {string} id - The ID to remove
       */
      removeComponent(id: string) {
        // 1. Find the component to delete and it's index
        const componentToDelete = this.findComponent(id);
        const componentIndex = this.nodeComponents.findIndex(item => item.id === id);

        // 2. Delete from view
        const child = componentToDelete.nativeElement;

        // get the sibling ul element - used for unwrapping
        const sibling = this.renderer.nextSibling(child);

        this.renderer.removeChild(this.renderer.parentNode(child), child);

        // find the number of child nodes that the element has
        const childrenElemToDelete = this.getChildrenCount(this.renderer.nextSibling(componentToDelete.nativeElement));

        // move the children upwards by unwrapping
        if (childrenElemToDelete > 0) {
          const li = sibling.firstChild;
          this.unwrapElement(sibling);
          this.unwrapElement(li.parentNode);
        } else {
          // in this case, it has no children, so no need to unwrap. We instead need to remove the parent li
          const liToDelete = child.parentNode;
          this.renderer.removeChild(this.renderer.parentNode(liToDelete), liToDelete);
        }

        this.nodeComponents.splice(componentIndex, 1);

        // few more steps to correctly remove dynamically added components
        if (componentToDelete.componentRef) {
          componentToDelete.componentRef.destroy();
          this.appRef.detachView(componentToDelete.componentRef.hostView);
        }
        this.checkEndNodes();
      }

      /**
       * @description Adds component (fromNode) as a child of the toNode
       * @param {Object} fromNodeData
       * @param {Object} toNodeData
       */
      moveNode(fromNodeData, toNodeData, unconnectedNode) {
        const fromNode = this.findComponent(fromNodeData.id);
        const unconnected = fromNode.unconnectedNode ? true : false;
        const toNode = this.findComponent(toNodeData.id);
        const fromNodeParent = this.findParentComponent(fromNodeData.id);

        fromNode.unconnectedNode = false; // remove link connection

        // if its an add card, add it as a parent
        if (toNode.type === 'add-card') {
          let parentElem = this.findComponent(toNodeData.id).nativeElement.parentElement.parentElement.parentElement.firstChild;
          let parentNode = this.findComponentByNative(parentElem);
          // if parent is condition card, it is nested deeper
          if (parentNode === undefined) {
            parentElem = parentElem.parentElement.parentElement.parentElement.firstChild;
            parentNode = this.findComponentByNative(parentElem);
          }
          toNodeData.type = parentNode.type;
          toNodeData.id = parentNode.id;
          // place the new element as parent of the + card selected
          const parent = this.renderer.parentNode(toNode.nativeElement);
          const ul = this.wrapInUnorderedList(this.wrapInListItem(toNode.nativeElement));
          this.renderer.appendChild(parent, fromNode.nativeElement);
          this.renderer.appendChild(parent, ul);
        } else {
          if (!unconnectedNode) {
            // 1. Unwrap and remove the from node from it's current structure
            // a. Find the li and ul parents of the node
            const liToRemove = this.renderer.parentNode(fromNode.nativeElement);
            const ulToRemove = this.renderer.parentNode(liToRemove);
            // b. Unwrap them
            this.unwrapElement(ulToRemove);
            this.unwrapElement(liToRemove);
          }

          // 2. move the node over to the new target
          const toUl = this.renderer.nextSibling(toNode.nativeElement);
          const toLi = toUl.firstChild; // children nodes - will keep

          const wrappedElemFrom = this.wrapInListItem(fromNode.nativeElement);
          wrappedElemFrom.appendChild(this.wrapInUnorderedList(toLi));
          this.renderer.appendChild(toUl, wrappedElemFrom);
        }

        this.checkEndNodes();
      }

      /**
       * @description Moves node (fromNodeData) and all its children to a new parent (toNodeData)
       * @param {Object} fromNodeData
       * @param {Object} toNodeData
       */
      moveTree(fromNodeData, toNodeData) {
        const fromNode = this.findComponent(fromNodeData.id).nativeElement.parentElement.parentElement;
        const toNode = this.findComponent(toNodeData.id).nativeElement.parentElement.parentElement;
        const fromNodeParent = fromNode.parentElement;

        this.renderer.appendChild(toNode.parentElement, fromNode);
        this.renderer.appendChild(fromNodeParent, toNode);

        this.checkEndNodes();
      }

      /**
       * @description Adds adds a reference node of fromNodeData to the element of toNodeData
       * @param {Object} fromNodeData
       * @param {Object} toNodeData
       */
      linkNode(fromNodeData, toNodeData) {
        const addCard = this.findComponent(fromNodeData.id);
        const fromNode = this.findDirectParentNode(fromNodeData.id);
        const toNode = this.findComponent(toNodeData.id);

        const domNewElem = this.createNodeComponent('reference', toNode);

        this.replaceComponent(addCard.nativeElement, domNewElem);
      }

      /**
       * @description Adds adds a reference node to another use case
       * @param {Object} fromNodeData
       * @param {Object} formData
       */
      createExternalRef(fromNodeData, formData) {
        const addCard = this.findComponent(fromNodeData.id);

        const domNewElem = this.createNodeComponent('reference', { external: true, data: formData });
        formData.form.owner = 'referenceUseCase';
        formData.form.id = domNewElem.id;

        this.replaceComponent(addCard.nativeElement, domNewElem);
      }

      /**
       * @description removes a reference node
       * @param id id of the reference node to be removed
       */
      removeReference(id) {
        const refNode = this.findComponent(id);
        const hasSiblings = this.findChildrenNodes(this.findDirectParentNode(id).id).length > 1;
        const elemToRemove = refNode.nativeElement;

        if (hasSiblings) {
          this.renderer.removeChild(elemToRemove.parentElement.parentElement, elemToRemove.parentElement);
        } else {
          const newAddCard = this.createNodeComponent('add', { showLink: true });
          this.replaceComponent(elemToRemove, newAddCard);
        }

        // few more steps to correctly remove dynamically added components
        if (refNode.componentRef) {
          refNode.componentRef.destroy();
          this.appRef.detachView(refNode.componentRef.hostView);
        }

        const componentIndex = this.nodeComponents.findIndex(item => item.id === id);
        this.nodeComponents.splice(componentIndex, 1);
        this.checkEndNodes();
      }

      /**
       * @description Wraps a HTML Element as the child of an unordered list <ul><child></ul>
       * @param {HTMLElement} child
       * @returns {HTMLElement} - the wrapped element
       */
      wrapInUnorderedList(child: HTMLElement): HTMLElement {
        const unorderedList = document.createElement('ul') as HTMLElement;
        unorderedList.appendChild(child);
        return unorderedList;
      }

      /**
       * @description Wraps a HTML Element as the child of a list item <li><child></li>
       * @param {HTMLElement} child
       * @returns {HTMLElement} - the wrapped element
       */
      wrapInListItem(child: HTMLElement): HTMLElement {
        const listItem = document.createElement('li') as HTMLElement;
        listItem.appendChild(child);
        return listItem;
      }

      /**
       * @description Takes in a componentRef of a NodeComponent. Add inputs to the component to create an Diverging-Add-Card
       * @param {ComponentRef<NodeComponent>} componentRef - the NodeComponent componentRef
       * @returns {ComponentRef<NodeComponent>} - returns the same componentRef but with appropriate inputs passed to component
       */
      createDivergingAddCard(componentRef: ComponentRef<NodeComponent>, type: string): ComponentRef<NodeComponent> {
        componentRef.instance.type = 'diverging-add-card';
        componentRef.instance.conditionType = type;
        return componentRef;
      }

      /**
       * @description Takes in a componentRef of a NodeComponent. Add inputs to the component to create an AddCard
       * @param {ComponentRef<NodeComponent>} componentRef - the NodeComponent componentRef
       * @param {boolean} showLink - Whether or not to show the link button with the add card - we will when it's a leaf node
       * @returns {ComponentRef<NodeComponent>} - returns the same componentRef but with appropriate inputs passed to component
       */
      createAddCard(componentRef: ComponentRef<NodeComponent>, form?): ComponentRef<NodeComponent> {
        componentRef.instance.type = 'add-card';
        componentRef.instance.showLink = form.showLink;
        componentRef.instance.firstNode = form.firstNode;
        return componentRef;
      }

      /**
       * @description Takes in a componentRef of a NodeComponent. Add inputs to the component to create an ConditionCard
       * @param {ComponentRef<NodeComponent>} componentRef - the NodeComponent componentRef
       * @returns {ComponentRef<NodeComponent>} - returns the same componentRef but with appropriate inputs passed to component
       */
      createConditionCard(componentRef: ComponentRef<NodeComponent>, conditionType: string): ComponentRef<NodeComponent> {
        componentRef.instance.type = 'eval-condition-card';
        componentRef.instance.conditionType = conditionType;
        return componentRef;
      }

      /**
       * @description Takes in a componentRef of a NodeComponent. Add inputs to the component to create a FlowCard
       * @param {ComponentRef<NodeComponent>} componentRef - the NodeComponent componentRef
       * @param {any} form - A form with relevant information to use as data when passing inputs to the component
       * @returns {ComponentRef<NodeComponent>} - returns the same componentRef but with appropriate inputs passed to component
       */
      createFlowCard(componentRef: ComponentRef<NodeComponent>, form: any): ComponentRef<NodeComponent> {
        // specify type and pass in component inputs
        componentRef.instance.type = 'flow-card';
        componentRef.instance.title = helper.decideCardSubtitle({ owner: form.owner, type: form.type });
        componentRef.instance.botType = form.owner === 'bot' ? form.type : '';
        componentRef.instance.description = form.stepDescription ? form.stepDescription : '';
        componentRef.instance.user = form.owner === 'user' ? true : false;
        // messages comes in as a stringified array, need to parse this
        componentRef.instance.messages = typeof form.messages === 'string' ? JSON.parse(form.messages) : [];
        componentRef.instance.carouselImages =
          typeof form.carouselImages === 'string' ? JSON.parse(form.carouselImages) : form.carouselImages || [];
        componentRef.instance.feedbackTiles = form.feedbackTiles ? form.feedbackTiles : [];
        componentRef.instance.feedbackReqMsg = form.feedbackReqMsg ? form.feedbackReqMsg : '';
        componentRef.instance.responseType = form.type ? form.type : '';
        componentRef.instance.intent = form.intent ? form.intent : '';
        componentRef.instance.entities = form.entities ? form.entities : [];
        componentRef.instance.variables = form.variables ? form.variables : '';
        componentRef.instance.selectedDateRestriction = form.selectedDateRestriction ? form.selectedDateRestriction : '';
        componentRef.instance.dynamicButtonsIterableProperty = form.dynamicButtonsIterableProperty;
        componentRef.instance.selectedApi = form.selectedApi;
        componentRef.instance.regexVariable = form.regexVariable;
        componentRef.instance.regexBoolMask = form.regexBoolMask;
        componentRef.instance.slotFilling = form.slotFilling;
        return componentRef;
      }

      /**
       * @description Takes in a componentRef of a NodeComponent. Add inputs to the component to create a ReferenceCard
       * @param {ComponentRef<NodeComponent>} componentRef - the NodeComponent componentRef
       * @param {any} form - A form with relevant information to use as data when passing inputs to the component
       * @returns {ComponentRef<NodeComponent>} - returns the same componentRef but with appropriate inputs passed to component
       */
      createReferenceCard(componentRef: ComponentRef<NodeComponent>, form: any): ComponentRef<NodeComponent> {
        // specify type and pass in component inputs
        if (form.external) {
          componentRef.instance.title = form.data.form.workerbot.colName ? form.data.form.workerbot.colName : '';
          componentRef.instance.description = form.data.form.usecase.colName ? form.data.form.usecase.colName : '';
          componentRef.instance.useCaseId = form.data.form.usecase.key;
          componentRef.instance.workerBotId = form.data.form.workerbot.key;
          componentRef.instance.nextStep = form.data.form.responseNode.key;
          componentRef.instance.nextStepName = form.data.form.responseNode.colName;
        } else {
          componentRef.instance.title = form.title ? form.title : '';
          componentRef.instance.description = form.description ? form.description : '';
        }
        componentRef.instance.refId = form.id; // getting undefined in the case of external-reference
        componentRef.instance.type = 'reference-card';
        return componentRef;
      }

      /**
       * @description Creates a Node Component that can be used to add to the DOM
       * @param {string} type - the type of NodeComponent that you want to create i.e. flow, add
       * @param {any} form - A form with relevant information to use as data when passing inputs to the component
       * @param {any} showLink - Whether or not to show the link button with the add card - we will when it's a leaf node
       * @returns {HTMLElement} - returns a HTML element
       */
      createNodeComponent(type: string, form?: any): HTMLElement {
        let componentRef = this.resolver.resolveComponentFactory(NodeComponent).create(this.injector);
        let idNewNode = type + this.conversationService.generateID();

        // set the proper ID for entry nodes
        if (type === 'flow' && this.conversationService.isFirstNode()) {
          idNewNode = 'entrypoint' + (this.conversationService.getEntryNodes().length + 1);
        }

        // Pass in generic inputs
        componentRef.instance.id = idNewNode;
        componentRef.location.nativeElement.id = idNewNode; // give the html an id

        // 1. Create a component reference from the component
        switch (type) {
          case 'flow':
            componentRef = this.createFlowCard(componentRef, form);
            break;
          case 'add':
            componentRef = this.createAddCard(componentRef, form);
            break;
          case 'condition':
            componentRef = this.createConditionCard(componentRef, form);
            break;
          case 'variable':
            componentRef = this.createDivergingAddCard(componentRef, 'variable');
            break;
          case 'options':
            componentRef = this.createDivergingAddCard(componentRef, 'options');
            break;
          case 'decision':
            componentRef = this.createDivergingAddCard(componentRef, 'decision');
            break;
          case 'reference':
            componentRef = this.createReferenceCard(componentRef, form);
            break;
          case 'crsl':
            componentRef = this.createDivergingAddCard(componentRef, 'crsl');
            break;
          case 'feedbackTiles':
            componentRef = this.createDivergingAddCard(componentRef, 'feedbackTiles');
            break;
          case 'feedbackReqMsg':
            componentRef = this.createDivergingAddCard(componentRef, 'feedbackReqMsg');
            break;
          case 'dynamicButtons':
            componentRef = this.createDivergingAddCard(componentRef, 'dynamicButtons');
            break;
          default:
        }

        // 2. subscribe to event clicks
        componentRef.instance.eventClick.subscribe(data => this.handleEventClicked(data));
        componentRef.instance.switchEndFlow.subscribe(data => this.handleEndFlowSwitch(data));

        // 3. Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(componentRef.hostView);

        // 4. DOM element from component
        const domElemAdd = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        // 5. Add to list of Components
        componentRef.instance.componentRef = componentRef; // add component ref to the instance
        this.nodeComponents.push(componentRef.instance);
        return domElemAdd;
      }

      /**
       * @description Opens variables sidebar
       */
      openVariablesSideBar() {
        this.initCardEditorForm();
        this.cardEditor.header = 'Variables';
        this.formType = 'variables';
        this.conversationService.setVariable(null);
        this.conversationService.showSideBar();
        this.overlay = true;
      }

      /**
       * @description Initializes card editor form
       * @param {any} data - contains information about the target node if the component should edit a node.
       * If no data is passed, it gets initialized to add a new node instead of edit
       */
      initCardEditorForm(data?: any) {
        if (data) {
          const conversationData = this.findComponent(data.id);
          this.cardEditor.header = 'Edit Step';
          this.cardEditor.stepFunction = conversationData.title ? conversationData.title : '';
          this.cardEditor.stepDescription = conversationData.description ? conversationData.description : '';
          this.cardEditor.owner = conversationData.user ? 'user' : 'bot';
          this.cardEditor.type = conversationData.responseType ? conversationData.responseType : '';
          this.cardEditor.messages = conversationData.messages || [''];
          this.cardEditor.intent = conversationData.intent || '';
          this.cardEditor.entities = typeof conversationData.entities === 'object' ? conversationData.entities : [];
          this.cardEditor.carouselImages = conversationData.carouselImages || [];
          this.cardEditor.feedbackTiles = conversationData.feedbackTiles || [];
          this.cardEditor.feedbackReqMsg = conversationData.feedbackReqMsg || '';
          this.cardEditor.slotFilling = conversationData.slotFilling || false;
        } else {
          this.formType = 'normal';
          this.cardEditor.header = 'New Step';
          this.cardEditor.stepFunction = '';
          this.cardEditor.stepDescription = '';
          this.cardEditor.owner = undefined;
          this.cardEditor.boolShowBotDetail = false;
          this.cardEditor.boolShowUserDetail = false;
          this.cardEditor.type = undefined;
          this.cardEditor.messages = [''];
          this.editNodeTarget = undefined;
          this.cardEditor.intent = '';
          this.cardEditor.entities = [];
          this.cardEditor.slotFilling = false;
        }
      }

      /**
       * @description initialize the api editor form to handle editing target element
       * @param data target element data to be edited
       */
      initApiEditorForm(data: any) {
        const apiComponent = this.findComponent(data.id);
        this.cardEditor.conditionDescription = apiComponent.title || '';

        if (
          apiComponent.conditionType === 'options' ||
          apiComponent.conditionType === 'decision' ||
          apiComponent.conditionType === 'crsl' ||
          apiComponent.conditionType === 'dynamicButtons'
        ) {
          this.cardEditor.entities = typeof apiComponent.entities === 'object' ? apiComponent.entities : [];
          this.cardEditor.intent = apiComponent.intent || '';
          this.cardEditor.header = 'Edit Response Option';
        } else {
          this.cardEditor.header = 'Edit Condition';
        }
      }

      /**
       * @description finds the NodeComponent instance by id
       * @param id id of the node to be found
       */
      findComponent(id) {
        const component = this.nodeComponents.find(item => item.id === id);
        return component;
      }

      /**
       * @description finds the NodeComponents instance by refId
       * @param refId refId of the nodes to be found
       */
      findComponentsByRefId(refId) {
        return this.nodeComponents.filter(item => item.refId === refId);
      }

      /**
       * @description finds the NodeComponent instance by id
       * @param id id of the node to be found
       */
      findParentComponent(id) {
        const component = this.nodeComponents.find(item => item.id === id);
        const parent = component.nativeElement.parentElement.parentElement.parentElement.firstChild;
        return this.findComponentByNative(parent);
      }

      /**
       * @description finds matching NodeComponents by type(s)
       * @param {Array} targetTypes array of types i.e. ['flow-card', 'add-card']
       */
      findComponents(targetTypes) {
        return this.nodeComponents.filter(item => targetTypes.indexOf(item.type) > -1);
      }

      /**
       * @description finds all children nodes linked to this one
       * @param id id of the target node to find the children for
       */
      findChildrenNodes(id) {
        const targetNode = this.findComponent(id).nativeElement;
        const childrenComponents = [];
        const childrenElements = targetNode.parentElement.lastChild.children;
        for (let i = 0; i < childrenElements.length; i++) {
          if (this.findComponentByNative(childrenElements[i].firstChild)) {
            childrenComponents.push(this.findComponentByNative(childrenElements[i].firstChild));
          }
        }
        return childrenComponents;
      }

      /**
       * @description finds the parent node that the target is directly linked to
       * @param id id of the target node to find the parent for
       */
      findDirectParentNode(id) {
        const targetNode = this.findComponent(id);
        return targetNode && targetNode.nativeElement.parentElement
          ? this.findComponentByNative(targetNode.nativeElement.parentElement.parentElement.parentElement.firstChild)
          : null;
      }

      /**
       * @description replaces target component with a new one
       * @param componentToReplace component to be replaced
       * @param newComponent new component to replace with
       */
      replaceComponent(componentToReplace, newComponent) {
        const targetLi = componentToReplace.parentElement;

        this.renderer.removeChild(targetLi, componentToReplace);
        this.renderer.insertBefore(targetLi, newComponent, targetLi.firstChild);

        // destroy the reference
        const componentToDelete = this.findComponentByNative(componentToReplace);
        if (componentToDelete.componentRef) {
          componentToDelete.componentRef.destroy();
          this.appRef.detachView(componentToDelete.componentRef.hostView);
        }
      }

      /**
       * @description replaces a reference node with a flow card that was being referenced
       * @param componentToReplace component to be replaced
       * @param newComponent new component to replace with
       */
      moveNodeToReference(componentToReplace, newComponent) {
        const targetLi = componentToReplace.nativeElement.parentElement.parentElement;
        const domElemAdd = this.createNodeComponent('add', { showLink: true });
        const li = this.wrapInListItem(domElemAdd);
        const oldParentUl = newComponent.nativeElement.parentElement.parentElement;

        this.renderer.insertBefore(oldParentUl, li, oldParentUl.firstChild);

        this.renderer.insertBefore(targetLi, newComponent.nativeElement.parentElement, targetLi.firstChild);
        this.removeReference(componentToReplace.id);

        // destroy the reference
        if (componentToReplace.componentRef) {
          componentToReplace.componentRef.destroy();
          this.appRef.detachView(componentToReplace.componentRef.hostView);
        }
      }

      /**
       * @description Highlights a node
       * @param {string} id - id of the component that should be
       */
      highlightCard(component, addCardType?) {
        if (component.highlighted !== true) {
          if (addCardType) {
            this.renderer.addClass(component.nativeElement.children[0], 'highlight-' + addCardType);
          } else {
            this.renderer.addClass(component.nativeElement.children[0], 'highlight');
          }
          component.highlighted = true;
        }
      }

      /**
       * @description Removes highlight for addComponentClicked
       */
      removeHighlight(component) {
        if (component.highlighted === true) {
          this.renderer.removeClass(component.nativeElement.children[0], 'highlight');
          this.renderer.removeClass(component.nativeElement.children[0], 'highlight-link');
          this.renderer.removeClass(component.nativeElement.children[0], 'highlight-add');
          component.highlighted = false;
        }
      }

      /**
       * @description Removes highlight for addComponentClicked
       */
      toggleHighlight(component) {
        if (component.highlighted === true) {
          this.renderer.removeClass(component.nativeElement.children[0], 'highlight');
          component.highlighted = false;
        } else {
          this.renderer.addClass(component.nativeElement.children[0], 'highlight');
          component.highlighted = true;
        }
      }

      /**
       * @description Handles various different on click events
       * @param {any} data - contains information about the event
       */
      handleEventClicked(data: any) {
        if (!this.overlayMode) {
          switch (data.action) {
            case 'overlayMode':
              this.overlayMode = data.overlayModeType;
              this.fromNodeData = data; // the data of the FROM node
              this.overlay = true;

              let componentsToHighlight;
              if (this.overlayMode === 'move-tree') {
                componentsToHighlight = this.findComponents(['add-card']);
                const parent = this.findComponent(data.id);
                componentsToHighlight = componentsToHighlight.filter(item => {
                  let node = item.nativeElement;
                  while (node != null) {
                    if (node === parent.nativeElement.parentElement.lastChild) {
                      return false;
                    }
                    node = node.parentNode;
                  }
                  return true;
                });
              } else {
                if (this.overlayMode === 'link') {
                  // Highlight only flow and condition cards
                  componentsToHighlight = this.findComponents(['flow-card', 'eval-condition-card']).filter(
                    item => this.findDirectParentNode(data.id).id !== item.id
                  );
                  this.highlightCard(this.findComponent(data.id), 'link');
                } else {
                  // Find all possible nodes that we can move to
                  componentsToHighlight = this.findComponents(['flow-card', 'eval-condition-card']);
                  // Remove any components that are of branching components, the node getting moved and its direct parent
                  componentsToHighlight = componentsToHighlight.filter(
                    item => !branchingNodes[item.responseType] && item.id !== data.id && item.id !== this.findDirectParentNode(data.id).id
                  );
                }
              }
              componentsToHighlight.forEach(component => {
                if (component.type === 'add-card') {
                  this.highlightCard(component, 'link');
                } else {
                  this.highlightCard(component);
                }
              });
              break;
            case 'add':
              if (!this.conversationService.isSideBarOpen().value) {
                // find and set globally
                this.addComponentClicked = this.findComponent(data.id);
                this.conversationService.setFirstNode(this.addComponentClicked.firstNode);
                console.log(`[handleEventClicked] ADD node to the following: ${data.id}`);
                this.conversationService.showSideBar();
                this.initCardEditorForm(false);
                this.highlightCard(this.addComponentClicked, 'add');
                this.overlay = true;
              } else {
                this.removeHighlight(this.addComponentClicked);
                this.conversationService.closeSideBar();
                this.closeOverlay();
              }
              break;
            case 'addCondition':
              console.log(`[handleEventClicked] ADD CONDITION as a child to the following parent: ${data.id}`);
              this.addConditionComponent(data);
              break;
            case 'delete':
              const elemToDelete = this.findComponent(data.id);
              console.log(`[handleEventClicked] DELETE CHILD ${data.id} of type ${elemToDelete.botType}`);

              if (data.type === 'eval-condition-card') {
                // Dont allow deleting a default errorHandler condition node
                if (elemToDelete.conditionType === 'variable' && elemToDelete.title === 'handleError') {
                  this.toastr.info("This node can't be deleted, an errorHandler default node should always exist.", 'Action restricted');
                } else if (this.nodeComponents.find(item => item.refId === data.id)) {
                  this.toastr.info(
                    "This node can't be deleted because there is a reference of this node in this conversation flow",
                    'Action restricted'
                  );
                } else {
                  const neighbours = this.checkNeighboursForNode(elemToDelete.nativeElement.parentNode.parentNode, 'eval-condition-card');
                  neighbours === 1
                    ? this.toastr.info("This node can't be deleted, try deleting the parent node instead.", 'Action restricted')
                    : this.removeBranchComponent(data.id);
                }
              } else if (branchingNodes[elemToDelete.botType]) {
                const alternativeParent = this.nodeComponents.find(item => item.type === 'reference-card' && item.refId === data.id);
                if (alternativeParent) {
                  this.moveNodeToReference(alternativeParent, elemToDelete);
                } else {
                  this.removeBranchedComponentAndAdd(data.id);
                }
              } else if (elemToDelete.firstNode && this.conversationService.findNextSteps(elemToDelete.nativeElement).length > 0) {
                this.toastr.error(`Can't delete entry nodes if they have children`, `Action not allowed`);
              } else if (elemToDelete.firstNode) {
                this.removeBranchComponent(data.id);
              } else {
                const alternativeParent = this.nodeComponents.find(item => item.type === 'reference-card' && item.refId === data.id);
                if (alternativeParent) {
                  this.moveNodeToReference(alternativeParent, elemToDelete);
                } else {
                  this.removeComponent(data.id);
                }
              }

              break;
            case 'deleteRef':
              console.log(`[handleEventClicked] DELETE REFERENCE ${data.id}`);
              this.removeReference(data.id);
              break;

            case 'editCondition':
              const condComponentToEdit = this.findComponent(data.id);
              // Dont allow editing a default handleError condition
              if (condComponentToEdit.title === 'handleError') {
                this.toastr.info("This node can't be edited, an errorHandler default node should not change.", 'Action restricted');
              } else {
                this.conversationService.setActiveComponent(condComponentToEdit);
                console.log(`[handleEventClicked] EDIT CONDITION ${data.id}`);
                this.editNodeTarget = data.id; // RG
                this.formType = 'condition';
                this.conversationService.showSideBar();
                this.nodeData = data;
                this.initApiEditorForm(data);
                this.overlay = true;
              }
              break;
            case 'closeSideBar':
              this.conversationService.closeSideBar();
              this.closeOverlay();
              break;
            case 'save':
              if (this.editNodeTarget) {
                this.editNodeComponent(data, this.editNodeTarget);
                this.editReferenceNodeComponent(data, this.editNodeTarget);
              } else {
                if (this.findChildrenNodes(this.addComponentClicked.id).length > 0) {
                  data.form.isMiddleNode = true;
                }
                this.addComponent(data.form);
              }
              this.conversationService.closeSideBar();
              this.closeOverlay();
              break;
            case 'saveCondition':
              console.log(`[handleEventClicked] SAVE API CONDITION for node: ${this.editNodeTarget}`);
              data.form.conditionType = this.findDirectParentNode(this.editNodeTarget).conditionType || 'variable';
              if (data.form.conditionType === 'variable') {
                this.editApiComponent(data, this.editNodeTarget);
              } else {
                this.editOptionsComponent(data, this.editNodeTarget);
              }

              this.editRefConditionNodeComponent(data, this.editNodeTarget);
              this.conversationService.closeSideBar();
              this.closeOverlay();
              break;
            case 'edit':
              console.log(`[handleEventClicked] Edit Card: ${data.id}`);
              const componentToEdit = this.findComponent(data.id);
              this.conversationService.setActiveComponent(componentToEdit);
              this.editNodeTarget = data.id;
              this.formType = 'normal';
              this.overlay = true;
              this.nodeData = data;
              this.conversationService.showSideBar();
              this.initCardEditorForm(data);
              break;
            case 'addPlusCard':
              console.log(`[handleEventClicked] ADD PLUS CARD for node: ${data.id}`);
              // find out if an add card is present as a child
              const addCardPresent =
                this.findChildrenNodes(data.id).filter(child => child.type === 'add-card' || child.type === 'diverging-add-card').length > 0
                  ? true
                  : false;
              addCardPresent
                ? this.toastr.info("You can't add this node here, one already exists!", 'Action restricted')
                : this.addPlusComponent(data.id);
              break;
            case 'referenceClick':
              const refComponent = this.findComponent(data.id);

              // if it is a reference of another use case
              if (refComponent.workerBotId) {
                this.conversationService.setActiveExternalRef(refComponent);
                this.highlightCard(refComponent);
                this.overlay = true;
              } else {
                // if it is a reference of a node in the current use case
                const refIds = refComponent.refId.split(',');
                const refChildren = refIds.map(id => this.findComponent(id));
                if (refComponent.highlighted !== true) {
                  this.highlightCard(refComponent);
                  refChildren.forEach(node => this.highlightCard(node));
                  this.overlay = true;
                } else {
                  this.closeOverlay();
                }
              }

              break;
            default:
          }
        } else {
          if (data.action === 'external-ref') {
            this.formType = 'reference';
            this.cardEditor.header = 'Create reference to another use case';
            this.conversationService.showSideBar();
          }

          // ensure FROM NODE is not the same as TO NODE
          if (this.fromNodeData.id !== data.id) {
            if (this.overlayMode === 'move-tree') {
              this.moveTree(this.fromNodeData, data);
            } else if (this.overlayMode === 'move-node') {
              this.moveNode(this.fromNodeData, data, false);
            } else if (this.overlayMode === 'move-unconnected-node') {
              console.log('Move unconnnected node');
              this.moveNode(this.fromNodeData, data, true);
            } else if (this.overlayMode === 'link' && data.action !== 'saveReference') {
              this.linkNode(this.fromNodeData, data);
            } else if (this.overlayMode === 'link' && data.action === 'saveReference') {
              this.createExternalRef(this.fromNodeData, data);
            }
            this.overlayMode = null; // disable link mode
            this.closeOverlay();
          }
        }
      }

      ngOnDestroy() {
        // unsubscribing to avoid a memory leak
        this.apiSubscription.unsubscribe();
      }

      ngOnInit() {
        this.panzoomConfig.useHardwareAcceleration = true;
        this.panzoomConfig.chromeUseTransform = true;
        this.panzoomConfig.zoomLevels = 3;
        this.panzoomConfig.scalePerZoomLevel = 1.4;
        this.panzoomConfig.zoomStepDuration = 0.1;
        this.panzoomConfig.freeMouseWheel = true;
        this.panzoomConfig.freeMouseWheelFactor = 0.01;
        this.panzoomConfig.zoomToFitZoomLevelFactor = 0.9;
        this.apiSubscription = this.panzoomConfig.api.subscribe((api: PanZoomAPI) => (this.panZoomAPI = api));
      }

      /**
       * @description zooms in to the conv designer
       */
      public zoomIn(): void {
        this.panZoomAPI.zoomIn();
      }

      /**
       * @description zooms out of the conv designer
       */
      public zoomOut(): void {
        this.panZoomAPI.zoomOut();
      }

      /**
       * @description resets pan and zoom to default
       */
      public resetView(): void {
        this.panZoomAPI.resetView();
      }

      /**
       * @description zoom event handler
       * @param event type of the zoom event
       */
      handleZoom(event) {
        switch (event) {
          case 'zoom-in':
            this.zoomIn();

            break;
          case 'zoom-out':
            this.zoomOut();

            break;
          case 'zoom-reset':
            this.resetView();
            break;
        }
      }

      /**
       * @description overlay click event handler
       */
      closeOverlay() {
        this.overlay = false;
        this.overlayMode = null;
        this.nodeComponents.forEach(item => this.removeHighlight(item));
        if (this.conversationService.isSideBarOpen().getValue()) {
          this.conversationService.closeSideBar();
        }
        this.conversationService.setLinkActive(null);
        this.conversationService.setActiveExternalRef(null);
      }

      /**
       * @description handle end flow checkbox click event
       * @param data event data (node id and new value)
       */
      handleEndFlowSwitch(data) {
        const parent = this.findDirectParentNode(data.id);
        parent.endFlow = data.value;
      }

      /**
       * @description set endFlow values for add cards based on parent data
       */
      checkEndNodes() {
        const addCards = this.findComponents(['add-card']);
        addCards.forEach(item => {
          const parent = this.findDirectParentNode(item.id);
          if (parent) {
            item.parentType = parent.type === 'flow-card' && parent.user !== true && parent.botType ? 'bot' : 'user';
            item.endFlow = parent.endFlow;
            item.firstNode = false;
          } else {
            item.showLink = false;
            item.firstNode = true;
            item.parentType = null;
            item.endFlow = null;
          }
        });
      }

      ngAfterViewInit() {
        this.initialised = true;
        this.apiSubscription = this.panzoomConfig.api.subscribe((api: PanZoomAPI) => {
          this.panZoomAPI = api;
        });

        this.nodeComponents = this.nodeComponents.toArray();
        this.conversationService.setTreeContainer(this.treeContainer.nativeElement);
        this.conversationService.setNodeComponents(this.nodeComponents);

        // set messages property for flow cards since it's not possible to add it on initial load by html string
        this.conversationService
          .getConversationData()
          .getValue()
          ['flow'].forEach(item => {
            const component = this.findComponent(item.currentStep);
            if (item.response && component) {
              component['messages'] = item.response;
            }
            if (item.responseConfig && item.responseConfig.variables && item.responseConfig.variables.length && component) {
              component['variables'] = item.responseConfig.variables;
            }

            // apply api conditions after init - so that all characters are as intended (i.e. for a regex pattern)
            if (component && item.responseType === 'conditionEval' && component.conditionType === 'api') {
              component['conditionStatement'] =
                item.responseConfig && item.responseConfig.conditionStatement ? item.responseConfig.conditionStatement : '';
            }
            if (component && item.responseType === 'dynamicButtons') {
              component['dynamicButtonsIterableProperty'] = item.responseConfig.dynamicButtonsIterableProperty;
            }
          });

        // Detect Changes to manage ExpressionChangedAfterItHasBeenCheckedError exception due to messages being changed above
        this.cdRef.detectChanges();

        this.conversationService.overlayTriggerObs.subscribe(() => {
          this.closeOverlay();
        });
      }
    }
    return DynamicComponent;
  }
}
