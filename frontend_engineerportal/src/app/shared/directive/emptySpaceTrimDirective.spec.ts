import { EmptySpaceTrimDirective } from "./emptySpaceTrimDirective";
import { TestBed, inject } from "@angular/core/testing";
import { ElementRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { componentFactoryName } from "@angular/compiler";
import { BehaviorSubject } from "rxjs";

export class MockElementRef extends ElementRef {
  constructor() { super(null); }

  nativeElement={value:"/gmv;'"};
}

describe("empty spac directive",function(){
beforeEach(()=>{TestBed.configureTestingModule({schemas:[NO_ERRORS_SCHEMA],
  providers:[EmptySpaceTrimDirective,{provide:ElementRef,useClass:MockElementRef}]
});})

it("should be defined",inject([EmptySpaceTrimDirective],(directive:EmptySpaceTrimDirective)=>{
expect(directive).toBeDefined();
directive.ngOnInit();
directive.keyup(new Event("change"));
}))

})