import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.sass']
})
export class VariableComponent implements OnInit {
  @Input()
  variable: any;
  @Output()
  handleClickEvent = new EventEmitter();
  askToDelete: boolean;
  constructor() {
    this.askToDelete = false;
  }

  ngOnInit() {}

  /**
   * @description - Method - To edit api variable
   */
  editVariable() {
    this.handleClickEvent.emit({ action: 'editVariable', variable: this.variable });
  }

  /**
   * @description - Method - To confirm delete master bot
   */
  askToUser(): void {
    this.askToDelete = true;
  }

  /**
   * @description - Method - To handle user selection
   * @returns - void
   */
  handleConfirmEvent(confirmedToDelete: boolean): void {
    this.askToDelete = false;
    if (confirmedToDelete) {
      this.handleClickEvent.emit({ action: 'deleteVariable', variableId: this.variable.id });
    }
  }
}
