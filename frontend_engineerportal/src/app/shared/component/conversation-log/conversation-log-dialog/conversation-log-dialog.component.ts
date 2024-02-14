import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'converse-conversation-log-dialog',
  styleUrls: ['conversation-log-dialog.component.sass'],
  templateUrl: 'conversation-log-dialog.component.html'
})

/**
 * @internal
 * This class is a  component that displays conversation log.
 *
 */
export class ConversationLogDialogComponent implements OnInit {
  @Input() itemHeaders;
  @Input() itemList;
  @Input() conversationDetails;
  @Output() closeClickEvent = new EventEmitter<string>();
  @Input() paginationFlag;
  // @Input() isDetailsShown;
  ngOnInit() {

  }
  closeDialog() {
    this.closeClickEvent.emit();
  }

}
