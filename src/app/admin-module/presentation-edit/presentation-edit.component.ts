import { AppConstants } from 'src/app/commons/app.constants';
import { Component, OnInit } from '@angular/core';
import { Presentation } from 'src/app/entities/presentation';
import { PresentationService } from 'src/app/service/presentation.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-presentation-edit',
  templateUrl: './presentation-edit.component.html',
  styleUrls: ['./presentation-edit.component.scss']
})
export class PresentationEditComponent implements OnInit {
  presentation: Presentation;
  botonInactive: boolean;

  constructor(private _presentationService: PresentationService
    , private activatedRoute: ActivatedRoute
    , public constants: AppConstants
    , private router: Router
    , private _snackBar: MatSnackBar
    , private _menuService: MenuService) {
    this.presentation = new Presentation();
    this.botonInactive = false;
    this.activatedRoute.params.subscribe(params => {
      this.presentation.eventId = params['idEvent'] as number;
      this.presentation.id = params['id'] as number;
    });
  }
  ngOnInit(): void {
    if (!(this.presentation.id === undefined)) {
      this._presentationService.getById(this.presentation.id).subscribe(resp => {
        this.presentation = resp;
      });
    }
  }
  executeAction(f: NgForm) {
    if (f.invalid) {
      return
    }
    this._presentationService.insert(this.presentation).subscribe(resp => {
      this.botonInactive = true;
      this._snackBar.open('Operación exitosa', this.constants.CLOSE).onAction().subscribe(resp => {
        this.sendListPresentation();
      });
    });
  }
  cancelar() {
    this.sendListPresentation();
  }
  sendListPresentation() {
    this.router.navigateByUrl(`presentation/${this.presentation.eventId}`);
  }
  getMenu(){
    return this._menuService.itemsMenu;
  }
  validatePermissions():boolean{
    return this._menuService.seeMenu([this.constants.ROLE_ADMIN, this.constants.ROLE_MANAGER]);
  }
}