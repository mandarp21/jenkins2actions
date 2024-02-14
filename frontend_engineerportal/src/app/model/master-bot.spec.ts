import { TestBed, async, inject } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MasterBot } from "./master-bot";

describe("masterBot",()=>{
beforeEach(async(() => {
  TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [],
    declarations: [],
    providers : [MasterBot]
  }).compileComponents();
}));

it("should be defined",inject([MasterBot],(bot:MasterBot)=>{
expect(bot).toBeDefined();
}))

it("should be deserialize",inject([MasterBot],(bot:MasterBot)=>{
  let data={
    masterBotId:"mockID",masterBotName:"mockName",masterBotDescription:"mockDes",masterBotImage:"url",createdOn:"18-10-2019",createdBy:"20-10-2019",updatedBy:"mockNAme",masterBotTelephoneNumber:"1234",updatedOn:"20-10-2019",masterBotStatus:"true",masterBotDefaultBotId:"9890",masterBotDefaultAuthentication:"true",masterBotDefaultLanguage:"en",currentNLPProvider:"dialogflow",nlpConfig:[{provider:"google",config:"google"}],currentSTTProvider:"google",sttConfig:[{provider:"google",config:"google"}],currentTTSProvider:"google",ttsConfig:[{provider:"google",config:"google"}]}
  let response=bot.deserialize(data,true);
  expect(response.botId).toEqual(data.masterBotId);
  }))

it("should mapToPostApi",inject([MasterBot],(bot:MasterBot)=>{
  let data={botName:"mockNAme",botDescription:"mockDEs",botImage:"url",botAuthentication:"mockAuth",botLanguage:"en",botTelephoneNumber:"12345",createdBy:"mock",NLPProvider:"dialogflow",nlpConfig:"mockconfig",STTProvider:"google",TTSProvider:"google"}
bot.mapToPostApi(data);
}))

it("should mapToUpdateApi",inject([MasterBot],(bot:MasterBot)=>{
  let data={botName:"mockNAme",botDescription:"mockDEs",botImage:"url",botAuthentication:"mockAuth",botLanguage:"en",botTelephoneNumber:"12345",createdBy:"mock",botStatus:"dialogflow",adminUserId:"mockconfig"
  }
bot.mapToUpdateApi(data);
}))

})