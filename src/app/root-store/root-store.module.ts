import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStoreModule } from './auth-store/auth-store.module';
import { UserStoreModule } from './user-store/user-store.module';
import { PostStoreModule } from './post-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers } from './meta-reducers';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterStateSerializer, NavigationActionTiming } from '@ngrx/router-store';
import { CustomSerializer } from '../core/utils/router-state-serializer';
import { UiStoreModule } from './ui-store';
import { ProductStoreModule } from './product-store';
import { BillingStoreModule } from './billing-store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthStoreModule,
    UserStoreModule,
    PostStoreModule,
    ProductStoreModule,
    UiStoreModule,
    BillingStoreModule,
    StoreModule.forRoot({}, {metaReducers}),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot(
      {
        stateKey: 'router',
        // navigationActionTiming: NavigationActionTiming.PostActivation // navigation isn't dispatched until all guards/resolvers are run
      }
    ),
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
  ],
})
export class RootStoreModule { }
