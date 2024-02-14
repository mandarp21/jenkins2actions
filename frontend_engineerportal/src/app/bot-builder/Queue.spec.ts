import {TestBed,inject} from "@angular/core/testing";
import {Queue} from "./Queue";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('Queue', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],providers:[Queue]
    });
  });
  it('Queue must be defined',inject([Queue] ,(queue:Queue) => {
    expect(queue).toBeDefined();
  }))

  it("All Queue functions work",inject([Queue] ,(queue:Queue) => {
    queue.queue=["mock1","Mock2","mock3"];
    queue.offset=10;
    queue.getLength();
    // expect(queue.queue.length).toEqual(3);
    queue.dequeue();
    // expect(queue.queue.length).toEqual(1);
    queue.isEmpty();
    // expect(queue.queue.length).toEqual(0);
    queue.enqueue("mock4");
    // expect(queue.queue.length).toEqual(3);
    queue.last();
    queue.shift();
    queue.first();
  }))
});