import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { GameResult, TableHeaders } from '../../../models/games/games.model';

@Component({
  selector: '[app-games-list-item]',
  templateUrl: './games-list-item.component.html',
  styleUrls: ['./games-list-item.component.scss'],
})
export class GamesListItemComponent implements OnInit {
  @Input() item!: GameResult;
  @Input() itemFields!: (keyof GameResult)[];
  @Input() tableHeaders: TableHeaders = {};

  @Output() onEditItem = new EventEmitter<GameResult>();

  constructor() {}

  ngOnInit(): void {}

  editItem(item: GameResult): void {
    this.onEditItem.emit(item);
  }
}
