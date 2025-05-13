import { Injectable } from '@angular/core';
import { io, Socket, Manager } from 'socket.io-client';
import { environments } from '../../../environments/environments';
// import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
    private socket: Socket | null = null;
    private apiUrl = environments.baseURL;
    private manager: Manager | null = null;

    constructor(){
        console.log('websocket initiated')
        this.manager = new Manager(`${this.apiUrl}/socket.io/socket.io.js`);
        this.socket = this.manager.socket('/');

        console.log('this.socket', this.socket)

    }

    connect( socket: string ) {

    }

}