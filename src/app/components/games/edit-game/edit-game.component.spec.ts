import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGameComponent } from './edit-game.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GamesService } from '../../../services/games/games.service';
import createSpyObj = jasmine.createSpyObj;
import { delay } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import { EditResponse } from '../../../models/games/edit/edit.model';

describe('EditGameComponent', () => {
  let component: EditGameComponent;
  let fixture: ComponentFixture<EditGameComponent>;
  let gamesServiceSpy: SpyObj<GamesService>;
  const gameEvent = {
    id: 1,
    name: 'Name',
  };

  beforeEach(async () => {
    // Mock Games Service
    const gamecardSpy = createSpyObj('_gamesService', [
      'editGameData',
      'editGame$',
    ]);
    gamecardSpy.editGameData.and.callFake(() => {
      return of(true).pipe(delay(100));
    });
    const editResponse: EditResponse = { success: true };
    gamecardSpy.editGame$ = new BehaviorSubject(editResponse);

    await TestBed.configureTestingModule({
      declarations: [EditGameComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: GamesService, useValue: gamecardSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGameComponent);
    gamesServiceSpy = TestBed.inject(GamesService) as SpyObj<GamesService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if the edit submit method call the service', () => {
    component.submit(gameEvent);
    expect(gamesServiceSpy.editGameData).toHaveBeenCalled();
    expect(gamesServiceSpy.editGameData).toHaveBeenCalledTimes(1);
  });
});
