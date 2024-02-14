import { Queue } from './Queue';
import * as helper from './utilities/helper';
import { branchingNodes } from '../app-constant';

export class Graph {
  noOfVertices: number;
  adjList: any;
  data: any;
  flow: any;

  constructor(data) {
    this.data = data;
    this.flow = data.flow;
    this.noOfVertices = data.flow ? data.flow.length : 0;
    this.adjList = new Map();

    if (data.flow) {
      this.addVertices(data.flow);
      this.addEdges(data.flow);
    }
  }

  /**
   * Add Vertex to the Adjacency List.  It adds the vertex v as key to adjList and initialize its values (edges info) with an array.
   * @param {String} - V (Vertex)
   */
  addVertex(v) {
    this.adjList.set(v, []);
  }

  /**
   * Uses the data input through the creation of an instance and creates the vertices
   * @param {Object} - data
   */
  addVertices(data) {
    for (let i = 0; i < data.length; i++) {
      this.addVertex(data[i].currentStep);
    }
  }

  /**
   * It adds an edge between the src (v) and the dest (w)
   * @param {String} - v
   * @param {String} - w
   */
  addEdge(v, w) {
    // get the list for vertex v and put the
    // vertex w denoting edge betweeen v and w
    this.adjList.get(v).push(w);
  }

  /**
   * Adds the edge information from the data input for each vertex
   * @param {Object} - data
   */
  addEdges(data) {
    for (let i = 0; i < data.length; i++) {
      const src = data[i].currentStep;
      const children = data[i].nextSteps;
      if (children) {
        // loop through the children and draw edge from src to each of the children
        children.forEach(child => {
          this.addEdge(src, child);
        });
      }
    }
  }

  /**
   * @description Retrieves the data for a particular node based on the id/key of the node
   * @param {String} id - key for the node
   * @returns {Object} - the data for the node
   */
  getNodeData(id) {
    const index = this.flow.findIndex(function(node) {
      return node.currentStep === id;
    });

    return this.flow[index];
  }

  /**
   * Prints a simple representation of the created graph.
   * This should be used after vertices and edges have been added
   */
  printGraph() {
    this.adjList.forEach((value, key) => {
      console.log(key + ' -> ' + value);
    });
  }

  decideComponent(type, id, data) {
    let html;
    const entities =
      data.nlc && data.nlc[0] && data.nlc[0].entities ? JSON.stringify(data.nlc[0].entities).replace(new RegExp('"', 'g'), "'") : [];
    const description = data.description ? helper.escapeStringQuotations(data.description) : '';

    if (type === 'step' || type === 'slotFilling' || type === '') {
      // format all elements within the array enclosed in string
      const botType = data.responseType ? data.responseType : null;
      const carouselImages = botType === 'crsl' ? JSON.stringify(data.responseConfig.carousel).replace(new RegExp('"', 'g'), "'") : [];
      const variables =
        botType === 'variable' || (botType === 'dynamicButtons' && data.responseConfig) ? data.responseConfig.variables : '';
      const feedbackTiles =
        botType === 'feedbackTiles' ? JSON.stringify(data.responseConfig.feedbackTiles).replace(new RegExp('"', 'g'), "'") : [];
      const feedbackReqMsg =
        botType === 'feedbackReqMsg' ? JSON.stringify(data.responseConfig.feedbackReqMsg).replace(new RegExp('"', 'g'), "'") : '';
      const selectedDateRestriction =
        botType === 'datepicker' && data.responseConfig ? helper.decideDateRestrictionOption(data.responseConfig.datepicker) : '';
      const selectedApi = botType === 'dynamicButtons' && data.responseConfig ? data.responseConfig.selectedApi : '';
      const regexVariable = data.responseConfig && data.responseConfig.regexConfig ? data.responseConfig.regexConfig.variableName : '';
      const regexBoolMask = data.responseConfig && data.responseConfig.regexConfig ? data.responseConfig.regexConfig.boolMask : false;

      html = `
      <li>
        <node [type]="'flow-card'" [regexBoolMask]="${regexBoolMask}" [regexVariable]="'${regexVariable}'" [selectedDateRestriction]="'${selectedDateRestriction}'" [variables]="'${variables}'" [selectedApi]="'${selectedApi}'" [botType]="'${botType}'" (eventClick)="handleEventClicked($event)" [id]="'${id}'" [title]="'${helper.decideCardSubtitle(
        data,
        true
      )}'" [description]="'${description}'" [intent]="'${data.nlc && data.nlc[0] ? data.nlc[0].intent : ''}'" [slotFilling]="${type ===
        'slotFilling'}" [responseType]="'${data.responseType}'" [user]="${data.owner ===
        'user'}" [entities]="${entities}" [carouselImages]="${carouselImages}" [feedbackTiles]="${feedbackTiles}" [feedbackReqMsg]="${feedbackReqMsg}" [endFlow]="${
        data.endFlow
      }" [firstNode]="${id.startsWith('entrypoint')}"></node>
      `;
    } else if (type === 'conditionEval') {
      const conditionType = this.flow.find(item => branchingNodes[item.responseType] && item.nextSteps.indexOf(data.currentStep) !== -1)
        .responseType;
      let conditionStatement = '';

      if (conditionType === 'variable') {
        conditionStatement =
          data.responseConfig && data.responseConfig.conditionStatement
            ? helper.escapeStringQuotations(data.responseConfig.conditionStatement)
            : '';
      }

      html = `
      <li>
        <node [conditionStatement]="'${conditionStatement}'" [type]="'eval-condition-card'" [id]="'${id}'" (eventClick)="handleEventClicked($event)" [title]="'${description}'" [conditionType]="'${conditionType}'" [intent]="'${
        data.nlc && data.nlc[0] ? data.nlc[0].intent : ''
      }'" [entities]="${entities}"></node>
      `;
    } else if (data.owner === 'referenceUseCase') {
      html = `
      <li>
        <node [type]="'reference-card'" [id]="'${id}'" (eventClick)="handleEventClicked($event)" [workerBotId]="'${
        data.responseConfig.workerBotId
      }'"  [nextStep]="'${data.responseConfig.nextSteps[0]}'" [nextStepName]="'${data.responseConfig.nextStepName}'" [title]="'${
        data.responseConfig.workerBotName
      }'"  [useCaseId]="'${data.responseConfig.useCaseId}'"  [description]="'${data.responseConfig.useCaseName}'"></node>
      `;
    } else {
      // for any element that is not represented
      console.log('error');
    }
    return html;
  }

  /**
   * It performs Breadth First Search to traverse through the tree from a given starting node (typically the root node)
   * @param {String} - the id of the starting node
   * @returns {String} - a html representation of the graph to be dynamically inserted into the DOM/Component
   */
  bfs(startingNodes): string {
    // Stores a path of the different levels visited

    // Initialize the html

    let html = `
      <card-editor #cardEditor [formType]="formType" [show]="showCreateUseCaseModal" (eventClick)="handleEventClicked($event)"></card-editor>
      <span class="variables-toggle-section" (click)="openVariablesSideBar()">Variables</span>
      <zoom (eventClick)="handleZoom($event)"></zoom>
      <channels (eventClick)="handleChannels($event)"></channels>

      <div style="position: absolute; top: 60px; bottom: 0; left: 0; right: 0; height: 100vh; width: 100vw;">
      <pan-zoom [config]="panzoomConfig">

      <div class="tree" #treeContainer>
      <overlay-component [active]="overlay" (eventClick)="closeOverlay()"></overlay-component>
      <ul class="graph-parent">`;

    // Store additional information retrieved as we are traversing through each node i.e. parent, level
    const additionalNodeData = {};

    // Create a visited array
    const visited = [];

    // Mark all Vertices as NOT visited
    for (let i = 0; i < this.noOfVertices; i++) {
      visited[i] = false;
    }

    // Instantiate the Queue
    const q = new Queue();
    const created = {};

    for (let i = 0; i < startingNodes.length; i++) {
      // Add the root node to the queue
      q.enqueue(startingNodes[i].currentStep);
      // Mark as visited
      visited[startingNodes[i].currentStep] = true;
      const branchHtml = this.createFlowBranch(q, created, visited, additionalNodeData, startingNodes[i].currentStep);
      html += branchHtml;
    }

    // add another plus node to allow creating more entry nodes
    html += `<li>
    <node [showLink]="false" type="add-card" [id]="'add-card${helper.generateID()}'" [showLink]="false" [firstNode]="true" (eventClick)="handleEventClicked($event)" (switchEndFlow)="handleEndFlowSwitch($event)"></node>
        </li>
      </ul>`;

    html += `</div></pan-zoom></div>`;
    return html;
  }

  createFlowBranch(q, created, visited, additionalNodeData, startingNode) {
    const pathLevels = [];
    let html = '';
    // Loop until queue is element
    while (!q.isEmpty()) {
      const getQueueElement = q.dequeue(); // Get the next element from the queue
      const get_list = this.adjList.get(getQueueElement);
      const nodeData = this.getNodeData(getQueueElement);

      // Initialize the data with that of the root node
      if (!additionalNodeData[startingNode]) {
        additionalNodeData[startingNode] = {
          parent: null,
          level: 1,
          childPos: null,
          adjacentNodes: get_list.length || 0
        };
      }
      const refComponent = this.flow.find(item => item.currentStep === getQueueElement);
      const hasDivergingCard =
        refComponent.owner === 'bot' &&
        ['options', 'variable', 'decision', 'crsl', 'dynamicButtons'].indexOf(refComponent.responseType) !== -1;

      // Get the element from the queue
      const prevLevel = pathLevels[pathLevels.length - 1];
      // it it has more than 1 child, then we will be adding a diverging-add-card node, so we need to increase currentlevel by 1
      const currentLevel = hasDivergingCard
        ? additionalNodeData[getQueueElement.toString()].level + 1
        : additionalNodeData[getQueueElement.toString()].level;
      const childrenLevel = currentLevel + 1;

      pathLevels.push(currentLevel);

      // console.log(`Current Vertex ${getQueueElement} (has children: ${hasChildren}) Level: ${currentLevel} prevLevel ${prevLevel}`);

      // Is the current node at a lower level than the previous level we were on. If so, close the unordered list
      if (prevLevel > currentLevel) {
        const diff = Math.abs(prevLevel - currentLevel);

        for (let i = 0; i < diff; i++) {
          html += `</ul></li>`;
        }
      }

      // Add the current nodes information. Always do this
      html += this.decideComponent(nodeData.stepType, nodeData.currentStep, nodeData);
      created[getQueueElement.toString()] = true;

      const visitedChildren = get_list.filter(
        item => created[item] !== undefined || (item.startsWith('condition') && !branchingNodes[nodeData.responseType])
      );

      const unvisitedChildren = get_list.filter(item => visitedChildren.indexOf(item) === -1);

      html += nodeData.owner === 'referenceUseCase' ? '' : `<ul>`;
      // Does the node have children, if it does, open a new unordered list so that the nodes children can be put inside this.
      // Else it is a leaf node, we should add an add card component and then close both list items
      if (hasDivergingCard) {
        const type = 'diverging-add-card';
        const cardID = type + helper.generateID();
        html += `<li>
            <node [type]="'${type}'" [id]="'${cardID}'" [conditionType]="'${
          refComponent.responseType
        }'" (eventClick)="handleEventClicked($event)"></node>
          <ul>
        `;
      } else if (get_list.length > unvisitedChildren.length) {
        const type = 'reference-card';
        visitedChildren.forEach(refId => {
          const cardID = type + helper.generateID();
          const referencedComponent = this.flow.find(item => item.currentStep === refId);
          html += `<li>
                      <node [type]="'${type}'" [id]="'${cardID}'" [refId]="'${refId}'" [title]="'${helper.decideCardSubtitle(
            referencedComponent,
            true
          )}'" [description]="'${referencedComponent.description}'" (eventClick)="handleEventClicked($event)"></node>
                    </li>
                  </ul>
          `;
        });

        html += '</li>';
      } else if (get_list.length === 0 && nodeData.owner !== 'referenceUseCase') {
        const type = 'add-card';
        const cardID = type + helper.generateID();
        html += `<li>
                    <node [showLink]="true" [type]="'${type}'" [id]="'${cardID}'" [parentType]="'${nodeData.owner}'" [endFlow]="${
          nodeData.endFlow
        }" (eventClick)="handleEventClicked($event)" (switchEndFlow)="handleEndFlowSwitch($event)"></node>
                  </li>
                </ul>
              </li>`;
      } else if (nodeData.owner === 'referenceUseCase') {
        html += `</li>`;
      }

      // as soon as currentLevel is smaller than previous level, start closing up
      if (currentLevel < prevLevel) {
      }

      let countChildren = 0;

      // add each child to the queue, as well as storing info about the level and parents
      // Array of the child nodes reversed to render in correct order on UI
      unvisitedChildren.reverse().forEach(child => {
        countChildren++; // increment
        visited[child] = true;
        q.enqueue(child);

        // store info
        additionalNodeData[child] = {
          parent: getQueueElement.toString(),
          level: childrenLevel,
          childPos: countChildren,
          adjacentNodes: get_list.length
        };
      });
    }
    // needs to be done once
    html += html.endsWith('</li>') ? '' : `</li>`;

    // Closing up the unordered lists - the iterations depends on the level that we are on
    const closingTags = pathLevels[pathLevels.length - 1] - 1;
    for (let i = 0; i < closingTags; i++) {
      html += `</ul></li>`;
    }
    return html;
  }
}
