import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreSelectors, UserStoreActions } from 'src/app/root-store';
import { EmailSenderAddresses } from 'shared-models/email/email-vars.model';
import { SubOptInConfirmationData } from 'shared-models/subscribers/sub-opt-in-confirmation-data.model';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  templateUrl: './sub-confirmation.component.html',
  styleUrls: ['./sub-confirmation.component.scss']
})
export class SubConfirmationComponent implements OnInit {

  confirmSubscriberProcessing$: Observable<boolean>;
  subMarkedConfirmed$: Observable<boolean>;
  confirmSubcriberError$: Observable<any>;

  supportEmail = EmailSenderAddresses.MARY_DAPHNE_SUPPORT;
  // subConfCheckStarted: boolean;
  // subConfCheckFailed: boolean;

  constructor(
    private store$: Store<RootStoreState.State>,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId,
  ) { }

  ngOnInit() {
    // Only run on client
    if (!isPlatformServer(this.platformId)) {
      this.initializeSubConfirmationStatus();
      this.markSubscriberConfirmed();
    }
  }

  private initializeSubConfirmationStatus() {
    this.confirmSubscriberProcessing$ = this.store$.select(UserStoreSelectors.selectConfirmSubscriberProcessing);
    this.subMarkedConfirmed$ = this.store$.select(UserStoreSelectors.selectSubMarkedConfrimed);
    this.confirmSubcriberError$ = this.store$.select(UserStoreSelectors.selectConfirmSubscriberError);
  }

  private markSubscriberConfirmed() {
    // Check if id params are available
    const subIdParamName = 'subId';
    const pubIdParamName = 'pubId';
    const subscriberId = this.route.snapshot.params[subIdParamName];
    const publicId = this.route.snapshot.params[pubIdParamName];

    if (subscriberId && pubIdParamName) {

      const subConfData: SubOptInConfirmationData = {
        subscriberId,
        publicId
      };

      this.store$.dispatch(new UserStoreActions.ConfirmSubOptInRequested({subConfData}));
      console.log('marking subscriber confirmed with this id data', subConfData);
    }
  }

}
