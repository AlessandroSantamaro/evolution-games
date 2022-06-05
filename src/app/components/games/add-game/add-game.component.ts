import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameResult } from '../../../models/games/games.model';
import { GamesService } from '../../../services/games/games.service';
import { AddResponse } from '../../../models/games/add/add.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss'],
})
export class AddGameComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<any> = new Subject<any>();

  constructor(private _router: Router, private _gamesService: GamesService) {}

  ngOnInit(): void {}

  addGame(game: GameResult): void {
    this._gamesService.addGame$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data: AddResponse) => {
        if (data?.success) {
          this._router.navigate(['games']);
        }
      });
    this._gamesService.addGameData(game);
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}
