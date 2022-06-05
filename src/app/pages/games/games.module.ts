import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesRoutingModule } from './games-routing.module';
import { GamesListComponent } from '../../components/games/games-list/games-list.component';
import { GamesListItemComponent } from '../../components/games/games-list-item/games-list-item.component';
import { GamesComponent } from './games.component';
import { AddGameComponent } from '../../components/games/add-game/add-game.component';
import { EditGameComponent } from '../../components/games/edit-game/edit-game.component';
import { SharedModule } from '../../shared/shared.module';
import { GamesFormComponent } from '../../components/games/games-form/games-form.component';

@NgModule({
  declarations: [
    GamesComponent,
    GamesListComponent,
    GamesListItemComponent,
    AddGameComponent,
    EditGameComponent,
    GamesFormComponent,
  ],
  imports: [CommonModule, SharedModule, GamesRoutingModule],
  exports: [
    GamesComponent,
    GamesListComponent,
    GamesListItemComponent,
    AddGameComponent,
    EditGameComponent,
    GamesFormComponent,
  ],
})
export class GamesModule {}
