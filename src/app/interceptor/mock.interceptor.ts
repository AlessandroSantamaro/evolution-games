import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EG_SERVICE_ENDPOINTS } from '../services/services.utils';
import { of } from 'rxjs';
import * as gamesData from '../../assets/mock/data.json';
import * as metaData from '../../assets/mock/meta.json';
import {
  FormOptions,
  GameResult,
  GamesDtoResponse,
} from '../models/games/games.model';
import { AddResponse } from '../models/games/add/add.model';
import { EditResponse } from '../models/games/edit/edit.model';
import { MetaDtoResponse } from '../models/games/meta.model';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  storedMockedGames!: GamesDtoResponse;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let response;

    switch (request.url) {
      case EG_SERVICE_ENDPOINTS.games:
        if (!this.storedMockedGames) {
          this.storedMockedGames = gamesData;
        }
        response = new HttpResponse({
          status: 200,
          body: this.storedMockedGames,
        });
        break;

      case EG_SERVICE_ENDPOINTS.metaTable:
        response = new HttpResponse({ status: 200, body: metaData });
        break;

      case EG_SERVICE_ENDPOINTS.addGame:
        response = this.getAddMockedResponse(request);
        break;

      case EG_SERVICE_ENDPOINTS.editGame:
        response = this.getEditMockedResponse(request);
        break;
    }
    if (response) {
      return of(response);
    } else {
      return next.handle(request);
    }
  }

  getEditMockedResponse(
    request: HttpRequest<unknown>
  ): HttpResponse<EditResponse> {
    let response;
    if (request instanceof HttpRequest) {
      if (!this.storedMockedGames) {
        this.storedMockedGames = gamesData;
      }

      // Simulate the edit game result response pushing the edited value
      const item: GameResult = request.body.item;

      // Simulate game_family label instead the key in the game response
      const metaOptions: MetaDtoResponse = metaData;
      const dropdownOptions = metaOptions.options['game_family'].options.map(
        (option: any) => {
          return {
            key: option.id,
            value: option['game_family'],
            label: option.descriptive_name,
          } as FormOptions;
        }
      );
      const gameFamilyLabel: FormOptions[] = dropdownOptions.filter(
        (el: any) => el?.value === item?.game_family
      );
      if (gameFamilyLabel?.length > 0) {
        item.game_family = gameFamilyLabel[0].label;
      }

      const newGameResponse: GamesDtoResponse = {
        ...this.storedMockedGames,
        results: [
          ...(this.storedMockedGames.results.filter(
            (result) => result.id !== item.id
          ) as GameResult[]),
          item,
        ],
      };

      const sortedGames: GamesDtoResponse =
        this.getSortedGames(newGameResponse);
      this.storedMockedGames = sortedGames;

      response = new HttpResponse({ status: 200, body: { success: true } });
    } else {
      response = new HttpResponse({ status: 500, body: { success: false } });
    }
    return response;
  }

  getAddMockedResponse(
    request: HttpRequest<unknown>
  ): HttpResponse<AddResponse> {
    let response;
    if (request instanceof HttpRequest) {
      if (!this.storedMockedGames) {
        this.storedMockedGames = gamesData;
      }

      // Simulate the new game result response pushing the new values
      const item: GameResult = request.body.item;
      let newGameResponse: GamesDtoResponse = this.storedMockedGames;

      // Retrieve the max id
      const gamesIds = [
        ...this.storedMockedGames.results.map(
          (game: GameResult) => game?.id || 0
        ),
      ];
      const maxId = Math.max(...gamesIds);
      item.id = maxId + 1; // Simulate the BE setting the id in the add request

      // Set other BE parameters
      item.updated_by_username = 'John Doe';
      item.updated_at = new Date().toUTCString();

      // Simulate game_family label instead the key in the game response
      const metaOptions: any = metaData;
      let dropdownOptions = metaOptions.options['game_family'].options.map(
        (option: any) => {
          return {
            key: option.id,
            value: option['game_family'],
            label: option.descriptive_name,
          } as FormOptions;
        }
      );
      const gameFamilyLabel: FormOptions[] = dropdownOptions.filter(
        (el: any) => el?.value === item?.game_family
      );
      if (gameFamilyLabel?.length > 0) {
        item.game_family = gameFamilyLabel[0].label;
      }

      // Simulate the new game result response pushing the new values, the next call will update the subject
      newGameResponse.results.push(item);
      const sortedGames: GamesDtoResponse =
        this.getSortedGames(newGameResponse);
      this.storedMockedGames = sortedGames;

      response = new HttpResponse({ status: 200, body: { success: true } });
    } else {
      response = new HttpResponse({ status: 500, body: { success: false } });
    }
    return response;
  }

  getSortedGames(newGameResponse: GamesDtoResponse): GamesDtoResponse {
    return {
      ...newGameResponse,
      results: [
        ...newGameResponse.results.sort(
          (game1: GameResult, game2: GameResult) => {
            if (game1?.id && game2?.id) {
              return game1.id - game2.id;
            } else {
              return 0;
            }
          }
        ),
      ],
    } as GamesDtoResponse;
  }
}
