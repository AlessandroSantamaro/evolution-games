import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamesListComponent } from './games-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { GamesDtoResponse } from '../../../models/games/games.model';
import { MetaDtoResponse } from '../../../models/games/meta.model';

describe('GamesListComponent', () => {
  let component: GamesListComponent;
  let fixture: ComponentFixture<GamesListComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamesListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: Router, useValue: router }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test the add router navigate', () => {
    component.goToAdd();
    expect(router.navigate).toHaveBeenCalledWith(['games/add']);
  });

  it('should test the edit router navigate', () => {
    component.goToEdit({ id: 1 });
    expect(router.navigate).toHaveBeenCalledWith(['games/edit', 1]);
  });

  it('should check if the trackByFn returns the index', () => {
    expect(component.trackByFn(1, {})).toBe(1);
  });

  it('should check if games handler set the results', () => {
    const response: GamesDtoResponse = { count: 1, results: [{}] };
    component.gamesDataHandler(response);
    expect(component.gameResultItemsResponse).toBeDefined();
    expect(component.gameResultItemsResponse.length).toBe(
      response.results.length
    );
  });

  it("should check if no values in games response don't set the results", () => {
    component.gamesDataHandler(null);
    expect(component.gameResultItemsResponse).toBeDefined();
    expect(component.gameResultItemsResponse.length).toBe(0);
  });

  it('should check if ', () => {
    const response: MetaDtoResponse = {
      name: 'Game Viewset List',
      fields: [],
      options: {},
    };
    component.metaDataHandler(response);
  });
});
