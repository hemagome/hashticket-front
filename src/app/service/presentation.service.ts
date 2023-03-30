import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Presentation } from '../entities/presentation';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class PresentationService {
  constructor(private _urlService: UrlService, private http: HttpClient) {}

  getAll() {
    return this.http.get<Presentation[]>(
      this._urlService.getEndPointPresentation()
    );
  }

  getById(id: number){
    const URL_SERVICE = `${this._urlService.getEndPointPresentation() + id.toString()}`;
    return this.http.get<Presentation>(URL_SERVICE);
  }
  getByIdPromise(id: number){
    const promise = new Promise( (resolve, reject) =>{
      const URL_SERVICE = `${this._urlService.getEndPointPresentation() + id.toString()}`;  
      this.http.get<Presentation>(URL_SERVICE).subscribe({
        next: (res: Presentation) => {
          console.log(res);
          resolve(res);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {
          console.log('complete');
        },
      });
    });
    return promise;
  }

  insert(presentation: Presentation) {
    return this.http.post<Presentation>(
      this._urlService.getEndPointPresentation(),
      presentation
    );
  }
}
