import { Component, Input, OnInit } from '@angular/core';
import { NavBarItem } from '../../../models/nav-bar/nav-bar.model';
import { NavigationEnd, Router } from '@angular/router';
import {
  PAGE_ROUTE_TITLES,
  ROUTES_NAV_MAPPING,
} from '../../../shared/routing.utils';

@Component({
  selector: 'app-bar-nav-item',
  templateUrl: './nav-bar-item.component.html',
  styleUrls: ['./nav-bar-item.component.scss'],
})
export class NavBarItemComponent implements OnInit {
  @Input() item: NavBarItem | null = null;
  isActive: boolean = false;

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setRouteInfo(event);
      }
    });
  }

  setRouteInfo(event: NavigationEnd): void {
    let url = event.url?.slice(1); // Remove '/' from the url
    if (!url) {
      url = ROUTES_NAV_MAPPING.default;
    }

    let navItemUrl;
    switch (url) {
      case ROUTES_NAV_MAPPING.default:
      case ROUTES_NAV_MAPPING.home:
        navItemUrl = ROUTES_NAV_MAPPING.home;
        document.title = PAGE_ROUTE_TITLES.home;
        break;
      case ROUTES_NAV_MAPPING.games:
      case ROUTES_NAV_MAPPING.add:
      case ROUTES_NAV_MAPPING.edit:
        navItemUrl = ROUTES_NAV_MAPPING.games;
        document.title = PAGE_ROUTE_TITLES.games;
        break;
    }
    if (!navItemUrl && this.item?.routerLink.includes(ROUTES_NAV_MAPPING.games)) {
      navItemUrl = ROUTES_NAV_MAPPING.games;
    }
    this.isActive = !!navItemUrl && this.item?.routerLink === navItemUrl;
  }
}
