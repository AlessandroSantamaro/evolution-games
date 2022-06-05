import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarItemComponent } from './nav-bar-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Subject } from 'rxjs';

describe('NavItemComponent', () => {
  let component: NavBarItemComponent;
  let fixture: ComponentFixture<NavBarItemComponent>;
  let router: Router;
  let routerEventsSubject: Subject<RouterEvent>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<RouterEvent>();
    const routerStub = {
      events: routerEventsSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      declarations: [NavBarItemComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: Router,
          useValue: routerStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarItemComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if the default has on the home the active class in the header', () => {
    component.item = {
      label: 'Home',
      routerLink: 'home',
    };
    const homeEvent = new NavigationEnd(1, '/', '/home');
    component.setRouteInfo(homeEvent);
    expect(component.isActive).toBeTruthy();
  });

  it('should check if home has active class in the header', () => {
    component.item = {
      label: 'Home',
      routerLink: 'home',
    };
    const homeEvent = new NavigationEnd(1, '/home', '/home');
    component.setRouteInfo(homeEvent);
    expect(component.isActive).toBeTruthy();
  });

  it('should check if games has active class in the header', () => {
    component.item = {
      label: 'games',
      routerLink: 'games',
    };
    const gamesEvent = new NavigationEnd(1, '/games', '/games');
    component.setRouteInfo(gamesEvent);
    expect(component.isActive).toBeTruthy();
  });

  it('should check if route change calls setRouterInfo method', () => {
    component.item = {
      label: 'Edit',
      routerLink: 'games',
    };
    const gamesEvent = new NavigationEnd(1, 'games/edit/1', 'games/edit/1');
    component.setRouteInfo(gamesEvent);
    expect(component.isActive).toBeTruthy();
  });

  it('should check if a not valid url has not the active class in the header', () => {
    component.item = {
      label: 'item-not-valid',
      routerLink: 'item-not-valid',
    };
    const invalidEvent = new NavigationEnd(
      1,
      '/item-not-valid',
      '/item-not-valid'
    );
    component.setRouteInfo(invalidEvent);
    expect(component.isActive).toBeFalsy();
  });

  it('should check if an empty item link has not the active class in the header', () => {
    component.item = null;
    const invalidEvent = new NavigationEnd(1, '/empty', '/empty');
    component.setRouteInfo(invalidEvent);
    expect(component.isActive).toBeFalsy();
  });

  it('should check if route change calls setRouterInfo method', () => {
    spyOn(component, 'setRouteInfo');
    const event = new NavigationEnd(1, 'home', 'home');
    routerEventsSubject.next(event);
    expect(component.setRouteInfo).toHaveBeenCalledOnceWith(event);
  });
});
