import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GameResult, GamesDtoResponse } from '../../models/games/games.model';
import { environment } from '../../../environments/environment';
import { EG_SERVICE_ENDPOINTS } from '../services.utils';
import { take } from 'rxjs/operators';
import { AddResponse } from '../../models/games/add/add.model';
import { EditResponse } from '../../models/games/edit/edit.model';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  gamesData$ = new BehaviorSubject<GamesDtoResponse | null>(null);
  addGame$ = new BehaviorSubject<AddResponse>({ success: false });
  editGame$ = new BehaviorSubject<EditResponse>({ success: false });

  constructor(private _httpClient: HttpClient) {}

  getGamesData(): void {
    this._httpClient
      .get<GamesDtoResponse>(environment.baseUrl + EG_SERVICE_ENDPOINTS.games)
      .subscribe(
        (games: GamesDtoResponse) => {
          this.gamesDataHandler(games);
        },
        (error) => {
          alert('Error, game list not retrived'); // Simple user feedback
        }
      );
  }

  gamesDataHandler(games: GamesDtoResponse): void {
    this.gamesData$.next(games);
  }

  editGameData(item: GameResult): void {
    this._httpClient
      .put<EditResponse>(environment.baseUrl + EG_SERVICE_ENDPOINTS.editGame, {
        item,
      })
      .subscribe(
        (data: EditResponse) => {
          this.editGameDataHandler(data);
        },
        (error) => {
          alert('Error, game not edited'); // Simple user feedback
        }
      );
  }

  editGameDataHandler(data: EditResponse): void {
    alert('Game edited'); // Simple user feedback
    this.editGame$.next(data);
  }

  addGameData(item: GameResult): void {
    this._httpClient
      .post<AddResponse>(environment.baseUrl + EG_SERVICE_ENDPOINTS.addGame, {
        item,
      })
      .subscribe(
        (data: AddResponse) => {
          this.addGameDataHandler(data);
        },
        (error) => {
          alert('Error, game not added'); // Simple user feedback
        }
      );
  }

  addGameDataHandler(data: AddResponse): void {
    alert('Game added'); // Simple user feedback
    this.addGame$.next(data);
  }
}
