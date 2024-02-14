import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ServiceAPIs } from '../../core/services/service-apis.service';
import * as socketIo from 'socket.io-client';
import { UtilService } from '../../services/util.service';

@Injectable()
export class ChatService {
  socket: any;
  endpoint: string;
  socketId: string;

  constructor(private serviceAPIs: ServiceAPIs, private utilService: UtilService) {}

  public async initSocket() {
    this.endpoint = this.serviceAPIs.getWSAPIUrl('ENGINEERPORTAL_ADAPTER_CHAT');
    console.log('Web Chat Pointing at ' + this.endpoint);
    console.log('AND PATH WAS: ' + this.serviceAPIs.getUrlPath('ENGINEERPORTAL_ADAPTER_SOCKET'));

    this.socket = await socketIo(this.endpoint, {
      path: this.serviceAPIs.getUrlPath('ENGINEERPORTAL_ADAPTER_SOCKET'),
      transports: ['websocket']
    });

    // console.log('Socket Info: ');
    this.socketId = this.socket.id;
    console.log('initialised WS connection with socket ID: ' + this.socketId);

    console.log('socket', this.socket);
  }

  public send(message): void {
    this.socket.emit('message', message);
  }

  public onMessage() {
    return new Observable(observer => {
      this.socket.on('message', data => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
