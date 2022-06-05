import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GamesDtoResponse } from '../../models/games/games.model';
import { environment } from '../../../environments/environment';
import { EG_SERVICE_ENDPOINTS } from '../services.utils';
import { MetaDtoResponse } from '../../models/games/meta.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  metaData$ = new BehaviorSubject<MetaDtoResponse | null>(null);

  constructor(private _httpClient: HttpClient) {}

  geMetaData(): void {
    this._httpClient
      .get<MetaDtoResponse>(
        environment.baseUrl + EG_SERVICE_ENDPOINTS.metaTable
      )
      .subscribe((data: MetaDtoResponse) => {
        this.metaData$.next(data);
      });
  }
}
