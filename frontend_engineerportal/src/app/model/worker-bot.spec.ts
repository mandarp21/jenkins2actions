import { async, TestBed, inject } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { WorkerBot } from "./worker-bot";

describe("WorkerBot",()=>{
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [],
      declarations: [],
      providers : [WorkerBot]
    }).compileComponents();
  }));
  
  it("should be defined",inject([WorkerBot],(bot:WorkerBot)=>{
  expect(bot).toBeDefined();
  }))

  it("should be deserialize",inject([WorkerBot],(bot:WorkerBot)=>{
    let data={workerBotId:"mockID",workerBotName:"mockName",workerBotDescription:"mockDes",createdOn:"18-10-2019",createdBy:"mockName",updatedBy:"mockNAme",updatedOn:"18-10-2019",masterBotId:"mockId",workerBotStatus:"mockSatus",workerBotLanguage:"en",workerBotAuthentication:"true",workerBotCurrentNLPProvider:"google",nlpConfig:[{provider:"google",config:"google"}],workerBotNLPConfig:[{provider:"google",config:"google"}],workerBotCurrentSTTProvider:"google",sttConfig:[{provider:"google",config:"google"}],workerBotSTTConfig:[{provider:"google",config:"google"}],workerBotCurrentTTSProvider:"google",workerBotTTSConfig:[{provider:"google",config:"google"}],ttsConfig:[{provider:"google",config:"google"}],associatedIntents:"intents",associatedEntities:[]}
let response=bot.deserialize(data);
expect(response.botId).toEqual(data.workerBotId)

    }))

    it("should map to post api",inject([WorkerBot],(bot:WorkerBot)=>{
      let data={botId:"mockId",masterBotId:"mockId",botName:"mockName",botLanguage:"en",botDescription:"mockDes",botAuthentication:"true",createdBy:"mock",updatedBy:"mock",NLPProvider:"google",nlpConfig:"config",STTProvider:"google",sttConfig:"google",TTSProvider:"google",ttsConfig:"google",associatedIntents:["mock"],associatedEntities:["mock"]}
      let response=bot.mapToPostApi(data);
      expect(response.masterBotId).toEqual(data.masterBotId);
    }))

    it("should map to put api",inject([WorkerBot],(bot:WorkerBot)=>{
let data={
  botId:"mockId",botName:"mockName",botLanguage:"en",botDescription:"mockDes",botAuthentication:"true",botStatus:"true",NLPProvider:"google",nlpConfig:["mock"],STTProvider:"google",sttConfig:[],TTSProvider:"google",ttsConfig:[],associatedIntents:[],associatedEntities:[]
}
let response=bot.mapToPutApi(data);
expect(response.workerBotId).toEqual(data.botId)
    }))

})