import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'channels-form-copy',
  styleUrls: ['../../channels-editor.component.sass'],
  templateUrl: 'channels-form-copy.component.html'
})

/**
 * @internal
 * This class is a  component that displays the ChannelsEditor component.
 */
export class ChannelsFormCopyComponent implements OnInit {
  @Output()
  editorAction = new EventEmitter();
  isCopyFrom = true;
  @Input()
  contentChannels: Array<any>;
  @Input()
  currentChannelName: string;
  @Input()
  copyChannelError: boolean;
  selectedChannelType: string;
  selectedContentOption: any;
  selectedContentSource: any;
  contentName: string;
  contentPlaceholder: string;
  contentChannelsDuplicate: Array<any>;

  channelTypes = ['web', 'voice', 'sms', 'skype', 'facebook', 'email', 'msteams', 'slack', 'whatsapp', 'alexa','zendesk','pinpoint'];

  contentOptions = [
    {
      colName: 'Copy entire flow',
      key: 'copy-flow'
    },
    {
      colName: 'Select steps to copy',
      key: 'create-empty'
    }
  ];

  ngOnInit() {
    this.contentName = 'source';
    this.contentPlaceholder = 'Select Content Source';
    this.contentChannelsDuplicate = this.contentChannels;
    this.contentChannels = this.contentChannels.filter(item => item.key !== this.currentChannelName);
   }

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
    return this.contentChannelsDuplicate.filter(item => item.key === type || (item.key === 'twilioText' && type === 'sms')).length > 0;
  }

  /**
   * @description handles 'copy from' and 'copy to' radio buttons
   * @param value isCopyFrom value to be set
   */
  changeCopyFrom(value) {
    this.isCopyFrom = value;

    if (this.isCopyFrom) {
      this.contentName = 'source';
      this.contentPlaceholder = 'Select Content Source';
      this.contentChannels = this.contentChannels.filter(item => item.key !== 'new-channel');
      if (this.selectedContentSource && this.selectedContentSource.key === 'new-channel') {
        this.selectedContentSource = null;
      }
    } else {
      this.contentName = 'destination';
      this.contentPlaceholder = 'Select Content Destination';
      this.contentChannels = this.contentChannels.filter(item => item.key !== this.currentChannelName);
      this.contentChannels.push({ colName: 'Create new channel', key: 'new-channel' });
    }
  }

  /**
   * @description handles the cancel button click
   */
  handleCancel() {
    this.editorAction.emit('close');
  }

  /**
   * @description checks if save button should be enabled
   */
  isSaveEnabled() {
    let enabled = true;

    if (this.selectedContentSource==undefined || this.selectedContentOption==undefined)
      enabled = false;

    return enabled;
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
      isCopyFrom: this.isCopyFrom,
      formType: 'copy'
    });
  }
}
