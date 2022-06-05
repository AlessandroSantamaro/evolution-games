import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GamesService } from '../../../services/games/games.service';
import {
  GameResult,
  GamesDtoResponse,
  TableHeaders,
  TableHeadersKeys,
} from '../../../models/games/games.model';
import { MetaService } from '../../../services/meta-table/meta.service';
import { MetaDtoResponse } from '../../../models/games/meta.model';
import { Router } from '@angular/router';
import { ButtonStyles } from '../../../models/styles/buttons.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
})
export class GamesListComponent implements OnInit, OnDestroy {
  tableHeadersKeys!: TableHeadersKeys[]; // Take all the table headers keys
  tableHeaders: TableHeaders = {}; // Each table header has a true/false to show/hide the value

  gameResultItemsResponse: GameResult[] = []; // Items retrieved by the response
  tableRowItems: GameResult[] = []; // Items to show in the table base on headers

  addButtonStyle: ButtonStyles = ButtonStyles.primary;

  private _unsubscribe$: Subject<any> = new Subject<any>();

  constructor(
    private _gamesService: GamesService,
    private _metaService: MetaService,
    private _router: Router,
    private _changeDetectionRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._gamesService.gamesData$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data: GamesDtoResponse | null) => {
        this.gamesDataHandler(data);
      });
    this._gamesService.getGamesData();

    this._metaService.metaData$.subscribe((data: MetaDtoResponse | null) => {
      this.metaDataHandler(data);
    });
    this._metaService.geMetaData();
  }

  gamesDataHandler(data: GamesDtoResponse | null): void {
    if (data?.results) {
      this.gameResultItemsResponse = data.results;
      this._changeDetectionRef.detectChanges(); // To prevent missing updates
    }
  }

  metaDataHandler(data: MetaDtoResponse | null): void {
    if (data) {
      const tableKeys: string[] = [];
      this.tableHeaders = {};

      // If an header is present in the Meta response, show the column
      this.tableHeadersKeys = data.fields.map((item) => {
        tableKeys.push(item.key); // Store header keys to show
        this.tableHeaders[item.key] = true;

        return {
          id: item.key,
          label: item.label,
        } as TableHeadersKeys;
      });

      // Add Edit column
      this.tableHeadersKeys = [
        ...this.tableHeadersKeys,
        { id: 'edit', label: 'Edit' },
      ];

      // Calculate for each item the data to show, build the array for app-games-list-item component
      this.tableRowItems = [];
      this.gameResultItemsResponse.forEach((item: GameResult) => {
        const newTableItem: { [key: string]: any } = {};

        Object.keys(item).forEach((key) => {
          // If the item field is in the table header, add it to show it in the table
          if (tableKeys.indexOf(key) > -1) {
            newTableItem[key as unknown as any] = item[key as keyof GameResult];
          }
        });
        this.tableRowItems.push(newTableItem);
      });
    }
  }

  goToEdit(item: GameResult): void {
    if (item.id) {
      this._router.navigate(['games/edit', item.id]);
    }
  }

  goToAdd(): void {
    this._router.navigate(['games/add']);
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }

  trackByFn(index: number, obj: object): number {
    return index;
  }
}
