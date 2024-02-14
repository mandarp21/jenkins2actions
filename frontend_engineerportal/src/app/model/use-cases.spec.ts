import { UseCases } from "./use-cases";
import { async, TestBed, inject } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("Use Case",()=>{
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [],
      declarations: [],
      providers : [UseCases]
    }).compileComponents();
  }));


  it("should be defined",inject([UseCases],(usecase:UseCases)=>{
expect(usecase).toBeDefined();
  }))

  it("should deserialize",inject([UseCases],(usecase:UseCases)=>{
    let data={
      useCaseId:"mockId",useCaseName:"mockName",useCaseDescription:"mockDes",useCaseStatus:"mockStatus",averageHumanHandlingTime:"10",collectFeedback:true,createdBy:"mock",updatedBy:"mock",createdOn:"18-10-2019",updatedOn:"20-10-2019",useCaseChannel:["web","sms"],isEditable:true,conversationType:"voice"
    }
    let response=usecase.deserialize(data);
    expect(response.useCaseId).toEqual(data.useCaseId);
      }))

  it("should mapToPostApi",inject([UseCases],(usecase:UseCases)=>{
    let data={useCaseId:"mockId",useCaseName:"mockName",useCaseDescription:"mockDEs",useCaseStatus:"working",useCaseChannel:["web","sms"],averageHumanHandlingTime:"10",collectFeedback:"true",entryNLC:"mock",createdBy:"mock",updatedBy:"mock",conversationType:"sms"}
        let response=usecase.mapToPostApi(data);
expect(response.useCaseId).toEqual(data.useCaseId);
  }))
})