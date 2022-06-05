export interface NavBar {
  items: NavBarItem[];
}

export interface NavBarItem {
  label: string;
  routerLink: string;
}

export const NAV_BAR_ITEMS: NavBar = {
  items: [
    {
      label: 'Home',
      routerLink: 'home',
    },
    {
      label: 'Games',
      routerLink: 'games',
    },
  ],
};
