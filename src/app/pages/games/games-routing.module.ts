import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from './games.component';
import { EditGameComponent } from '../../components/games/edit-game/edit-game.component';
import { AddGameComponent } from '../../components/games/add-game/add-game.component';
import { ROUTES_MAPPING } from '../../shared/routing.utils';

const routes: Routes = [
  {
    path: '',
    component: GamesComponent,
  },
  {
    path: ROUTES_MAPPING.add,
    component: AddGameComponent,
  },
  {
    path: ROUTES_MAPPING.edit,
    component: EditGameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {}
