import { Component } from '@angular/core';
import { SocketIoService } from './services/socket-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private readonly socketIoService: SocketIoService
  ) {

    this.getCurrentUser();
  }

  private getCurrentUser() {
    this.socketIoService.getCurrentUser().subscribe(val => {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
      sessionStorage.setItem('userInfo', JSON.stringify({name: userInfo?.name ? userInfo.name : '', id: val}));
    });
  }
}
