import { TestBed, inject } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

const helper1=require("./helper").decideCardSubtitle;
const helper2=require("./helper").decideDateRestrictionOption;
const helper3=require("./helper").generateID;
const helper4=require("./helper").escapeStringQuotations;

describe('helper service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports:[],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],providers:[]
    });
  });

  it("decide card subtitle should be defined",()=>{
helper1({owner:"user",type:"msg"},false);
helper1({owner:"",type:"msg"},false);
helper1({owner:"",type:"options"},false);
helper1({owner:"",type:"variable"},false);
helper1({owner:"",type:"crsl"},false);
helper1({owner:"",type:"decision"},false);
helper1({owner:"",type:"datepicker"},false);
helper1({owner:"",type:"dynamicButtons"},false);
helper1({owner:"",type:""},false);
  })

  it("decideDateRestrictionOption should be defined",()=>{
let data1=helper2({allowFutureDates:true,allowPastDates:false});
expect(data1).toEqual("Future Dates Only");
helper2({allowFutureDates:false,allowPastDates:true});
helper2({allowFutureDates:"",allowPastDates:""});
  })

  it("generateID should be defined",()=>{
    let data1=helper3();
    expect(typeof(data1)).toEqual("string");
      })

  it("should format string",()=>{
let data1=helper4("mock/g'{data:'mock'}'");
// expect(data1).toEqual("mock/g\'{data:\'mock\'}\'");
  })
})