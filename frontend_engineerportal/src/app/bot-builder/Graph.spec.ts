import {TestBed,inject} from "@angular/core/testing";
import {Graph} from "./Graph";
import {Queue} from "./Queue"

class queueMockService{
  dequeue(){
    return "mock"
  }
  enqueue(data){

  }
}

describe('Graph', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations:[],
    providers:[{provide:Queue,useClass:queueMockService},{provide:Graph,useValue:new Graph({flow:[{currentStep:"",nextSteps:["mockData1"]}]})}]
    });
});

it("graph file should be defined",inject([Graph],(Graph)=>{
expect(Graph).toBeDefined();
Graph.getNodeData("mock");
Graph.printGraph();
}))

it("graph file should decide component",inject([Graph],(Graph)=>{
  let data ={responseType:"voice",responseConfig:{carousel:"/ghi./"},currentStep:"mock"}
  Graph.decideComponent("step","",data);
}))

it("it should decide component if type conditionEval",inject([Graph],(Graph)=>{
  let data ={responseType:"voice",responseConfig:{carousel:"/ghi./"},currentStep:"mock"}
  Graph.flow=[{responseType:"variable",nextSteps:["mock","mock"]}]
  Graph.decideComponent("conditionEval","",data);
}))

it("it should decide component if owner is referenceUseCase",inject([Graph],(Graph)=>{
  let data ={responseType:"voice",responseConfig:{carousel:"/ghi./",nextSteps:["mock"],nextStepName:"mockName",workerBotName:"mockBot",useCaseId:"mockid",useCaseName:"mockName"},currentStep:"mock",owner:"referenceUseCase"}
  Graph.flow=[{responseType:"variable",nextSteps:["mock","mock"]}]
  Graph.decideComponent(null,"",data);
}))

it("it should bfs",inject([Graph],(Graph)=>{
  Graph.flow=[{currentStep:2,owner:"bot",responseType:"variable"}]
  Graph.adjList={get(data){return []}}
Graph.bfs([{currentStep:2}])
}))

// it("graph function working ",inject([Graph,queue],(graph = new Graph({flow:["mock1","mock2"]}),q:Queue)=>{
// graph.addEdge(10,2);
// graph.getNodeData("mock");
// graph.bfs("mock");
// graph.createFlowBranch(q,{},[],{},"");
// }))


});