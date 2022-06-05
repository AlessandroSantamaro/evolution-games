import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GamesService } from '../../../services/games/games.service';
import { GameResult } from '../../../models/games/games.model';
import { EditResponse } from '../../../models/games/edit/edit.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.scss'],
})
export class EditGameComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<any> = new Subject<any>();

  constructor(private _router: Router, private _gamesService: GamesService) {}

  ngOnInit(): void {}

  submit(game: GameResult): void {
    this._gamesService.editGame$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data: EditResponse) => {
        if (data?.success) {
          this._router.navigate(['games']);
        }
      });
    this._gamesService.editGameData(game);
    this._router.navigate(['games']);
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}
