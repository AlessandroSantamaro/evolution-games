import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGameComponent } from './add-game.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GamesService } from '../../../services/games/games.service';
import createSpyObj = jasmine.createSpyObj;
import { delay, of } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import { BehaviorSubject } from 'rxjs';
import { AddResponse } from '../../../models/games/add/add.model';

describe('AddGameComponent', () => {
  let component: AddGameComponent;
  let fixture: ComponentFixture<AddGameComponent>;
  let gamesServiceSpy: SpyObj<GamesService>;
  const gameEvent = {
    id: 1,
    name: 'Name',
  };

  beforeEach(async () => {
    // Mock Games Service
    const gamecardSpy = createSpyObj('_gamesService', [
      'addGameData',
      'addGame$',
    ]);
    gamecardSpy.addGameData.and.callFake(() => {
      return of(true).pipe(delay(100));
    });
    const addResponse: AddResponse = { success: true };
    gamecardSpy.addGame$ = new BehaviorSubject(addResponse);

    await TestBed.configureTestingModule({
      declarations: [AddGameComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: GamesService, useValue: gamecardSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGameComponent);
    gamesServiceSpy = TestBed.inject(GamesService) as SpyObj<GamesService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if the add method call the service', () => {
    component.addGame(gameEvent);
    expect(gamesServiceSpy.addGameData).toHaveBeenCalled();
    expect(gamesServiceSpy.addGameData).toHaveBeenCalledTimes(1);
  });
});
