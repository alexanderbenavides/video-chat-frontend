import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { MeetingComponent } from './modules/meeting/meeting.component';

const routes: Routes = [
  {
    component: HomeComponent,
    path: '',
  },
  {
    component: MeetingComponent,
    path: 'meeting',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
