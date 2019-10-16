import { Component, OnInit, ViewChild } from '@angular/core';
import { UiService } from './core/services/ui.service';
import { MatSidenav } from '@angular/material';
import { AuthService } from './core/services/auth.service';
import { Store } from '@ngrx/store';
import {
  RootStoreState,
  UserStoreSelectors,
  AuthStoreSelectors,
  AuthStoreActions,
  UserStoreActions,
  UiStoreActions,
  UiStoreSelectors
} from './root-store';
import { withLatestFrom, map, takeWhile, filter, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { metaTagDefaults } from 'shared-models/analytics/metatags.model';
import { ProductStrings } from 'shared-models/products/product-strings.model';
import { Product } from 'shared-models/products/product.model';
import { Observable } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = metaTagDefaults.maryDaphnePublic.metaTagDefaultTitle;
  appVersion = '1.1.7';

  private userAuthenticationRequested: boolean;
  private userLoaded: boolean;
  private routeNavCount = 0;
  cachedHtmlActive$: Observable<boolean>;
  private isBot: boolean;

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  constructor(
    private uiService: UiService,
    private authService: AuthService,
    private store$: Store<RootStoreState.State>,
    private afs: AngularFirestore,
    private metaTagService: Meta,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkForBot();
    this.checkIfCachedHtml();
    this.monitorCachedHtmlStatus();
    this.detectRouteChange();
    this.setUserSessionId();
    this.configureSideNav();
    this.configureAuthDetection();
    this.checkForOfflineProductData();
    this.initializePublicUser();
  }

  private checkForBot() {
    const botMetaTag = this.metaTagService.getTag(`name=${metaTagDefaults.explearningPublic.metaTagIsBot}`);
    if (botMetaTag) {
      this.store$.dispatch(new UiStoreActions.BotDetected());
      console.log('Bot detected', botMetaTag);
    }
    console.log('No bot detected');

    // Keep this updated in the app component state;
    this.store$.select(UiStoreSelectors.selectBotDetected)
      .subscribe(isBot => {
        if (isBot) {
          this.isBot = true;
        }
      });
  }

  private checkIfCachedHtml() {
    const cachedMetaTag = this.metaTagService.getTag(`name=${metaTagDefaults.explearningPublic.metaTagCachedHtml}`);
    if (cachedMetaTag) {
      this.store$.dispatch(new UiStoreActions.HTMLCacheActivated());
      console.log('Cached content detected', cachedMetaTag);
      return true;
    }
    console.log('No cached content detected');
    return false;
  }

  // Used to turn off HTML Cache async logic
  private detectRouteChange() {
    this.router.events.pipe(
      takeWhile(() => this.routeNavCount < 2),
      filter(event =>
        event instanceof NavigationStart
      ),
      tap(event => {
        console.log('Router change detected');
        this.routeNavCount++;
        if (this.routeNavCount > 1) {
          this.store$.dispatch(new UiStoreActions.HTMLCacheDeactivated());
          console.log('Valid router nav detected');
        }
      })
    ).subscribe();
  }

  private monitorCachedHtmlStatus() {
    this.cachedHtmlActive$ = this.store$.select(UiStoreSelectors.selectHTMLCacheActive)
      .pipe(map(htmlCacheActive => htmlCacheActive));
  }


  private setUserSessionId() {
    const userSessionId = this.afs.createId();
    this.store$.dispatch(new UserStoreActions.SetUserSessionId({userSessionId}));
  }

  private initializePublicUser() {
    if (this.isBot) {
      console.log('Bot detected, not initializing user');
      return;
    }
    this.store$.select(UserStoreSelectors.selectUser)
      .pipe(
        takeWhile(() => !this.userLoaded),
        withLatestFrom(
          this.store$.select(UserStoreSelectors.selectUserLoaded)
        ),
        map(([user, userLoaded]) => {
          if (!userLoaded && !this.userAuthenticationRequested) {
            console.log('No user in store, dispatching authentication request');
            this.store$.dispatch(new AuthStoreActions.AuthenticationRequested());
          }
          this.userAuthenticationRequested = true; // Prevents auth from firing multiple times
          if (user) {
            this.userLoaded = true; // Mark user loaded to close the subscription
          }
          return user;
        })
      ).subscribe();
  }

  // Handles sideNav clicks
  private configureSideNav() {
    this.uiService.sideNavSignal$.subscribe(signal => {
      this.toggleSideNav();
    });
  }

  // Opens and closes sidenav
  private toggleSideNav() {
    if (this.sidenav.opened) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
  }

  private configureAuthDetection() {
    if (this.isBot) {
      console.log('Bot detected, not initializing auth services');
      return;
    }
    this.authService.initAuthListener();
    this.authService.authStatus$
    .pipe(
      withLatestFrom(
        this.store$.select(UserStoreSelectors.selectUserIsLoading),
        this.store$.select(AuthStoreSelectors.selectIsAuth)
      )
    )
    .subscribe(([userId, userIsLoading, isAuth]) => {
      // These if statements determine how to load user data
      if (userId && !userIsLoading && !isAuth) {
        // Fires only when app is loaded and user is already logged in
        this.store$.dispatch( new AuthStoreActions.AuthenticationComplete());
        this.store$.dispatch( new UserStoreActions.UserDataRequested({userId}));
      } else if (userId && !userIsLoading && isAuth) {
        // Fires only when user logged in via Google Auth
        this.store$.dispatch( new UserStoreActions.UserDataRequested({userId}));
      } else if (!userId && isAuth) {
        // Fires only when logout detected on separate client, logs out user automatically
        this.authService.logout();
        this.store$.dispatch(new AuthStoreActions.SetUnauthenticated());
      }
    });
  }

  private checkForOfflineProductData() {
    if (this.isBot) {
      console.log('Bot detected, not checking for offline product data');
      return;
    }
    const offlineProductData = localStorage.getItem(ProductStrings.OFFLINE_PRODUCT_DATA);
    if (offlineProductData) {
      const productData: Product = JSON.parse(localStorage.getItem(ProductStrings.OFFLINE_PRODUCT_DATA));
      this.store$.dispatch(new UserStoreActions.SetCartData({productData}));
    }
  }
}
