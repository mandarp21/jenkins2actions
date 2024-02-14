import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'converse-use-case-add-channel',
  styleUrls: ['use-case-add-channel.component.sass'],
  templateUrl: 'use-case-add-channel.component.html'
})
export class UseCaseChannelComponent implements OnInit {
  @Input() channels: Array<string>;
  addedChannel: string;
  removedChannel: string;
  @Output() addChannelEmitter = new EventEmitter();
  @Output() removeChannelEmitter = new EventEmitter();
  channelname: string;
  displayIcon: string;
  channelarray: any[];
  dropwidth: string;
  iconleft: string;


  constructor() {
    this.channelname = 'Add Channel';
    this.displayIcon = 'plus';
    this.dropwidth = '14.16em';
    this.iconleft = '11.5em';

    this.channelarray = [
      { value: 'Web', key: 'Web' },
      { value: 'Email', key: 'Email' },
      { value: 'Twilio Text', key: 'Twilio Text' },
      { value: 'MS Teams', key: 'MS Teams' },
      { value: 'Twilio Voice', key: 'Twilio Voice' },
      { value: 'Facebook', key: 'Facebook' },
      { value: 'Skype', key: 'Skype' },
      { value: 'Alexa', key: 'Alexa' },
      { value: 'Zendesk', key: 'Zendesk'},
      { value: 'PinPoint', key: 'PinPoint'}];
  }

  ngOnInit() {
    if (!this.channels) {
      this.channels = [];
    }
  }

  addChannel(item) {

    if (item) {
      this.channels.push(item.value);
      this.addedChannel = '';
      this.addChannelEmitter.emit(this.channels);
    }
  }

  removeChannel(value: string) {
    this.addChannelEmitter.emit(this.channels);
  }
}
