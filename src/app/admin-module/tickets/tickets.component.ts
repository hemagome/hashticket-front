import { AppConstants } from 'src/app/commons/app.constants';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from 'src/app/entities/event';
import { Presentation } from 'src/app/entities/presentation';
import { EventService } from 'src/app/service/event.service';
import { PresentationService } from 'src/app/service/presentation.service';
import { TicketsService } from 'src/app/service/tickets.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, SortDirection} from '@angular/material/sort';
import { TicketView } from 'src/app/entities/ticket-view';
import { MenuService } from 'src/app/service/menu.service';
import { GenericQuery } from 'src/app/entities/generic-query';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent {
  presentations:Presentation[];
  events:Event[];
  eventId:number;
  presentationId:number;
  tickets:TicketView[];
  resultsLength:number = 0;
  records:number=10;
  pageEvent: PageEvent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['numberTicket', 'zone', 'category', 'presentation', 'state' ];
  pageSizeOptions = [5, 10, 25];

  constructor(private _eventService: EventService
    , private _presentationService: PresentationService
    , private _snackBar: MatSnackBar
    , private _ticketService: TicketsService
    , private _menuService: MenuService
    , public constants: AppConstants){
    this.events = [];
    this.presentations = [];
    this.tickets=[];
    this.eventId = 0;
    this.presentationId = 0;
    this.getEvents();
  }

  getEvents(){
    this._eventService.getAll().subscribe(resp => {
      this.events = resp;
    });
  }
  getPresentationsByEvent(){
    this._presentationService.getByIdEvent(this.eventId).subscribe(resp => {
      this.presentations = resp;
    });
  }

  executeAction(f: NgForm){

  }

  generarTickets(){
    this._ticketService.generateTickets(this.eventId, this.presentationId).subscribe(res => {
      if(res.code === 1){
        this._snackBar.open(res.message, this.constants.CLOSE, {
          duration: 20000,
          panelClass: ['green-snackbar'],
        });
      }else if(res.code === 2 ){
        this._snackBar.open(res.message, this.constants.CLOSE, {
          duration: 20000,
          panelClass: ['red-snackbar'],
        });
      }
    });
  }
  buscarTickets(page:number){
    this._ticketService.getByEventAndPresentation(this.eventId, this.presentationId, this.records, page).subscribe(data => {
      var result: GenericQuery<TicketView> = new GenericQuery();
      Object.assign(result, data );
      this.tickets =  result.results;
      this.resultsLength =  result.totalRecords;
    });
  }
  handlePageEvent(e: PageEvent) {
    this.records = e.pageSize;
    this.buscarTickets(e.pageIndex);
  }
  getMenu(){
    return this._menuService.itemsMenu;
  }
  validatePermissions():boolean{
    return this._menuService.seeMenu([this.constants.ROLE_ADMIN, this.constants.ROLE_MANAGER]);
  }
}