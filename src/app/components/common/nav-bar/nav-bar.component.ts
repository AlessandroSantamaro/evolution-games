import { Component, OnInit } from '@angular/core';
import { NAV_BAR_ITEMS, NavBar } from '../../../models/nav-bar/nav-bar.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  navBar: NavBar = NAV_BAR_ITEMS;

  constructor() {}

  ngOnInit(): void {}

  trackByFn(index: number, obj: object): number {
    return index;
  }
}
