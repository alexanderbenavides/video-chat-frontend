import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
const Peer = require('simple-peer');

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  peer: any;

  constructor(private readonly socket: Socket) {

  }

  getCurrentUser() {
    return this.socket.fromEvent<string>('myInfo').pipe(map(data => data));
  }

  getAllUsers() {
    return this.socket.fromEvent<{name: string, id: string}[]>('allUsers').pipe(map(data => data));
  }

  setUsers(data: {name: string, id: string}) {
    return this.socket.emit('setUsers', data);
  }

  getUserInfo() {
    return this.socket.fromEvent<{ from: string, name: string, signal: any}>('callUser').pipe(map(data => data));
  }

  answerCallToUser (stream: MediaStream, call: any) {
   const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data: any) => {
      this.socket.emit('answerCallToUser', { signalData: data, to: call.from });
    });

    this.streamConfig(peer);

    peer.signal(call.signal);

    this.peer = peer;

  }

  callUser(id: string, name: string, stream: MediaStream, me: string) {

    const peer = this.setPeer(stream, true);

    peer.on('signal', (data: {sdp: string, type: string}) => {
      this.socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    this.streamConfig(peer);

    this.socket.on('callAccepted', (signal: any) => {
      console.log('raaaaaaaaaaaaaaaaaaaaaaaa');
      peer.signal(signal);
    });

    this.peer = peer;

  };


  private setPeer(stream: MediaStream, initiator = false) {
    return new Peer({ initiator, trickle: false, stream });
  }

  private streamConfig(peer: any) {
    peer.on('stream', (currentStream: MediaStream) => {
      this.sendData(currentStream);
    });
  }

  leaveCall () {
    console.log(this.peer);
    this.peer.destroy();
    window.location.reload();
  };

  // Crear servicio
  private dataSubject = new Subject<MediaStream>();

  dataCurrentStream$ = this.dataSubject.asObservable();

  private sendData(data: MediaStream): void {
    this.dataSubject.next(data);
  }



}
