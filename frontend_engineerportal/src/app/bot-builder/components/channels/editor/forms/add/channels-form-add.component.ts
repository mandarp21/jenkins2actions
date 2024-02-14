import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'channels-form-add',
  styleUrls: ['../../channels-editor.component.sass'],
  templateUrl: 'channels-form-add.component.html'
})

/**
 * @internal
 * This class is a  component that displays the ChannelsEditor component.
 */
export class ChannelsFormAddComponent {
  @Output()
  editorAction = new EventEmitter();
  @Input()
  contentChannels: Array<any>;
  @Input()
  addChannelError: boolean;

  selectedChannelType: string;
  selectedContentOption: any;
  selectedContentSource: any;

  channelTypes = [
    {
      id: 'web',
      tooltip: 'Web'
    },
    {
      id: 'voice',
      tooltip: 'Voice'
    },
    {
      id: 'sms',
      tooltip: 'SMS'
    },
    {
      id: 'skype',
      tooltip: 'Skype'
    },
    {
      id: 'facebook',
      tooltip: 'Facebook'
    },
    {
      id: 'email',
      tooltip: 'Email'
    },
    {
      id: 'msteams',
      tooltip: 'Teams'
    },
    {
      id: 'slack',
      tooltip: 'Slack'
    },
    {
      id: 'whatsapp',
      tooltip: 'WhatsApp'
    },
    {
      id: 'alexa',
      tooltip: 'Alexa'
    },
    {
      id: 'zendesk',
      tooltip: 'Zendesk'
    },
    {
      id: 'pinpoint',
      tooltip: 'PinPoint'
    }
  ];

  contentOptions = [
    {
      colName: 'Copy entire flow from another channel',
      key: 'copy-flow'
    },
    {
      colName: 'Create empty channel',
      key: 'create-empty'
    }
  ];

  /**
   * @description handles content option dropdown
   * @param data content option selected
   */
  onSelectContentOption(data) {
    this.selectedContentOption = data;
  }

  /**
   * @description handles content source dropdown
   * @param data content source selected
   */
  onSelectContentSource(data) {
    this.selectedContentSource = data;
  }

  /**
   * @description handles channel type radio buttons
   * @param newType channel type selected
   */
  changeChannelType(newType) {
    if (!this.doesChannelExist(newType)) {
      this.selectedChannelType = newType;
    }
  }

  /**
   * @description checks if channel is already created
   * @param type channel type to check
   */
  doesChannelExist(type) {
    return this.contentChannels.filter(item => item.key === type || (item.key === 'twilioText' && type === 'sms')).length > 0;
  }

  /**
   * @description handles the cancel button click
   */
  handleCancel() {
    this.editorAction.emit('close');
  }

  /**
   * @description handles the save button click
   */
  handleSave() {
    if(this.selectedChannelType === 'sms') {
      this.selectedChannelType = 'twilioText';
    }
    this.editorAction.emit({
      channelType: this.selectedChannelType,
      contentOp: this.selectedContentOption ? this.selectedContentOption.key : undefined,
      source: this.selectedContentSource ? this.selectedContentSource.key : undefined,
      formType: 'add'
    });
  }
}
