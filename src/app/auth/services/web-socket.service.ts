import { Injectable } from '@angular/core';
import { io, Socket, Manager } from 'socket.io-client';
import { environments } from '../../../environments/environments';
import { Observable, Subject } from 'rxjs';
import { Product } from '../../mealproducts/interfaces/product.interface';
// import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
    private socket: Socket | null = null;
    private apiUrl = environments.baseURL;
    // private manager: Manager | null = null;
    // Subject for product/meal creation
    private itemCreated$ = new Subject<Product>();
    private itemUpdated$ = new Subject<Product>();
    
    constructor(){
        /* console.log('websocket initiated')

        //Se pudiera crear función para inicialiar el manageer.
        this.manager = new Manager(`${this.apiUrl}/socket.io/socket.io.js`);
        this.socket = this.manager.socket('/');

        console.log('this.socket', this.socket)

        this.addListeners( this.socket ); */
        console.log('WebSocketService initialized');
        this.initializeSocket();

    }

    private initializeSocket(): void {
      // Remove the /socket.io.js from the URL - just use the base URL
      this.socket = io(`${this.apiUrl}/products`, {
      // this.socket = io(`${this.apiUrl}/meals`, {
          path: '/socket.io', // This is the default path where Socket.IO connects
          transports: ['websocket'], // Recommended to specify transports
          autoConnect: true, // Whether to connect automatically
          /* new properties recommended */
          reconnectionAttempts: 5, // Try to reconnect 5 times
          reconnectionDelay: 1000, // Start with 1 second delay
          reconnectionDelayMax: 5000 // Maximum 5 seconds delay
      });

      // this.addSocketListeners();
      this.setupSocketListeners();
  }

    /* connect( socket: string ) {
      console.log(socket);
    } */

    /* public connect(namespace?: string): void {
      if (namespace) {
          // If you need to connect to a specific namespace
          this.socket = io(`${this.apiUrl}/${namespace}`);
          this.addSocketListeners();
      } else if (!this.socket?.connected) {
          this.socket?.connect();
      }
    } */

    public disconnect(): void {
      this.socket?.disconnect();
    }

    private setupSocketListeners(): void {
      if ( !this.socket ) return; //Add null check

      // Listen for new product/meal creation
      this.socket.on('item-created', (item: Product) => {
          this.itemCreated$.next(item);
      });

      // Listen for product updates
      this.socket.on('item-updated', (updatedItem: Product) => {
        this.itemUpdated$.next(updatedItem);
      });

      // Basic connection listeners
      this.socket.on('connect', () => {
          console.log('Connected to meals namespace');
      });

      this.socket.on('disconnect', () => {
          console.log('Disconnected from meals namespace');
      });
    }

    // Observable for new items
    onItemCreated(): Observable<Product> {
      return this.itemCreated$.asObservable();
    }

    // Observable for updated items
    onItemUpdated(): Observable<Product> {
      return this.itemUpdated$.asObservable();
    }

    /* private addSocketListeners(): void {
      if (!this.socket) return;

      this.socket.on('connect', () => {
          console.log('Connected to WebSocket server');
      });

      this.socket.on('disconnect', (reason) => {
          console.log('Disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
      });

      this.socket.on('clients-updated', (clients: string[]) => {
          console.log('Clients updated:', clients);
      });

      this.socket.on('message-from-server', (payload: { fullName: string, message: string }) => {
          console.log('Message from server:', payload);
      });
    } */

    public sendMessage(message: string): void {
      if (!this.socket?.connected) {
          console.warn('Socket not connected');
          return;
      }
      
      this.socket.emit('message-from-client', {
          id: this.socket.id,
          message: message
      });
    } 

    public getSocketId(): string | null {
        return this.socket?.id || null;
    }

    /* addListeners( socket: Socket ) {
      socket.on('connect', () => {
        console.log('connected');
      })

      socket.on('disconnect', () => {
        console.log('disconnect');
      })

      socket.on('clients-updated', (clients: string[]) => {
        console.log({ clients });
      })

      socket.on('message-from-server', ( payload: { fullName: string, message: string } ) => {
        console.log(payload);
      })

      comentar función. (debería ejecutarse bajo un evento)
      socket.emit('message-from-client', {
        id: 'YO!!',
        message: 'prueba socket.emit(message-from-client)'
      })

    } */

}