import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketIoService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

  @ViewChild('miVideo') miVideo!: ElementRef;
  @ViewChild('otherVideo') otherVideo!: ElementRef;
  private userId!: string;
  private myStream!: MediaStream;
  otherStream!: MediaStream;
  isCalling = false;
  showCancelButton = false;
  private userCallerInfo = { isReceivingCall: true, from: '', name: '', signal: '' };
  users: {name: string, id: string}[] = [];
  storageInfo =  {name: '', id: ''};
  otherUser = {name: 'No se ha unido nadie aún', id: ''};
  constructor(
    private readonly socketIoService: SocketIoService
  ) {

    this.startStream();
    this.storageInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    this.socketIoService.setUsers(this.storageInfo);
    this.getAllUsers()
  }

  ngOnInit(): void {
    this.getUserInfo();

    this.socketIoService.dataCurrentStream$.subscribe(val => {
      this.otherStream = val;
      this.showCancelButton = true;
      if (this.otherVideo.nativeElement) this.otherVideo.nativeElement.srcObject = val;
    })
  }


  private getAllUsers() {
    //
    this.socketIoService.getAllUsers().subscribe(val => {
      this.users = val;
      const otherUser = this.users.filter(user => user.name !== this.storageInfo?.name);

      if (otherUser.length > 0) {
        this.otherUser = otherUser[0];
      }
    });
  }


  private startStream() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        this.myStream = currentStream;
        if (this.miVideo.nativeElement) this.miVideo.nativeElement.srcObject = currentStream;
      });
  }

  private getUserInfo() {
    this.socketIoService.getUserInfo().subscribe(({ from, name, signal }) => {
      this.isCalling = true;
      this.userCallerInfo = { isReceivingCall: true, from, name , signal };
    })
  }

  callUser(item: {name: string, id: string}) {
    this.userId = item.id;
    this.socketIoService.callUser(this.userId,  item.name, this.myStream, this.storageInfo.id);
  }

  acceptCall() {
    this.userCallerInfo.from = this.otherUser.id;
    this.socketIoService.answerCallToUser(this.myStream, this.userCallerInfo);
  }

  rejectCall() {
    this.socketIoService.leaveCall();
  }

}
