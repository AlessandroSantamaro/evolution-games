import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { GamesService } from './games.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { EG_SERVICE_ENDPOINTS } from '../services.utils';
import { GamesDtoResponse } from '../../models/games/games.model';

describe('GamesService', () => {
  let service: GamesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GamesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test the game list request', fakeAsync(() => {
    let isFirstTime = true;
    service.gamesData$.subscribe((data) => {
      if (isFirstTime) {
        expect(data).toBe(null);
        isFirstTime = false;
      } else {
        expect(data).toBeDefined();
        expect(data?.count).toBeDefined();
        expect(data?.next).toBeDefined();
        expect(data?.previous).toBeDefined();
        expect(data?.results).toBeDefined();
      }
    });
    service.getGamesData();
    tick(300);
    const req = httpTestingController.expectOne(
      environment.baseUrl + EG_SERVICE_ENDPOINTS.games
    );
    expect(req.request.method).toBe('GET');
  }));

  it('should test the add request', fakeAsync(() => {
    let isFirstTime = true;
    service.addGame$.subscribe((data) => {
      if (isFirstTime) {
        expect(data?.success).toBe(false);
        isFirstTime = false;
      } else {
        expect(data).toBeDefined();
        expect(data?.success).toBe(true);
      }
    });
    service.addGameData({ id: 1, name: 'Name' });
    tick(300);
    const req = httpTestingController.expectOne(
      environment.baseUrl + EG_SERVICE_ENDPOINTS.addGame
    );
    expect(req.request.method).toBe('POST');
  }));

  it('should test the edit request', fakeAsync(() => {
    let isFirstTime = true;
    service.editGame$.subscribe((data) => {
      if (isFirstTime) {
        expect(data?.success).toBe(false);
        isFirstTime = false;
      } else {
        expect(data).toBeDefined();
        expect(data?.success).toBe(true);
      }
    });
    service.editGameData({ id: 1, name: 'Name' });
    tick(300);
    const req = httpTestingController.expectOne(
      environment.baseUrl + EG_SERVICE_ENDPOINTS.editGame
    );
    expect(req.request.method).toBe('PUT');
  }));

  it('should test if add handler works', () => {
    spyOn(window, 'alert');
    service.addGameDataHandler({ success: true });
    expect(window.alert).toHaveBeenCalled();
    service.addGame$.subscribe(data => {
      expect(data).toBeDefined();
    })
  });

  it('should test if get games handler works', () => {
    const response: GamesDtoResponse = {count: 0, results: []};
    service.gamesDataHandler(response);
    service.gamesData$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data).toBe(response);
    })
  });

  it('should test if edit handler works', () => {
    spyOn(window, 'alert');
    service.editGameDataHandler({ success: true });
    expect(window.alert).toHaveBeenCalled();
    service.editGame$.subscribe(data => {
      expect(data).toBeDefined();
    })
  });
});
