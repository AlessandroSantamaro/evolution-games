import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';
import { FooterComponent } from './components/footer/footer.component';
import { NavBarComponent } from './components/common/nav-bar/nav-bar.component';
import { NavBarItemComponent } from './components/common/nav-bar-item/nav-bar-item.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MockInterceptor } from './interceptor/mock.interceptor';
import { GamesModule } from './pages/games/games.module';
import { LayoutComponent } from './components/common/layout/layout.component';
import { LayoutContentComponent } from './components/common/layout/layout-content/layout-content.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavBarComponent,
    NavBarItemComponent,
    FooterComponent,
    LayoutComponent,
    LayoutContentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    GamesModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
