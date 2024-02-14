import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'channels-editor',
  styleUrls: ['channels-editor.component.sass'],
  templateUrl: 'channels-editor.component.html'
})

/**
 * @internal
 * This class is a  component that displays the ChannelsEditor component.
 */
export class ChannelsEditorComponent {
  @Input()
  type: string;
  @Output()
  editorAction = new EventEmitter();
  @Input()
  channelsAvailable: Array<string>;
  @Input()
  currentChannelName: string;
  @Input()
  copyChannelError: boolean;
  @Input()
  addChannelError: boolean;

  /**
   * @description passes through the button click action
   * @param data form data submitted
   */
  handleAction(data) {
    this.editorAction.emit(data);
  }
}
