import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { EventComponent } from './event/event.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HomeAdminComponent,
    EventComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AdminModuleModule { }