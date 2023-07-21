import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketIoService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  inputValue = '';

  constructor(
    private readonly router: Router
  ) {

  }

  goToMeeting() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    sessionStorage.setItem('userInfo', JSON.stringify({name: this.inputValue, id: userInfo?.id}));
    this.router.navigate(['meeting']);
  }

}
