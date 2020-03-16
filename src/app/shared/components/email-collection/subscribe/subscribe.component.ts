import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RootStoreState, UserStoreActions, UserStoreSelectors } from 'src/app/root-store';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { SUBSCRIBE_VALIDATION_MESSAGES } from 'shared-models/forms-and-components/public-validation-messages.model';
import { PublicUser } from 'shared-models/user/public-user.model';
import { EmailSubData } from 'shared-models/subscribers/email-sub-data.model';
import { SubscriptionSource } from 'shared-models/subscribers/subscription-source.model';
import { EmailSenderAddresses } from 'shared-models/email/email-vars.model';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  subscribeForm: FormGroup;
  formValidationMessages = SUBSCRIBE_VALIDATION_MESSAGES;

  subscribeProcessing$: Observable<boolean>;
  subscribeSubmitted$: Observable<boolean>;
  emailSubmitted: boolean;
  senderEmail: string = EmailSenderAddresses.MARY_DAPHNE_NEWSLETTER;

  constructor(
    private fb: FormBuilder,
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    this.subscribeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.initializeSubscribeObservers(); // Used to disable subscribe buttons
  }

  onSubmit() {
    // Prevent submission if either field is blank (allows submit button to stay illuminated even when blank)
    if (this.email.value === '' || this.firstName.value === '') {
      return;
    }

    this.store$.select(UserStoreSelectors.selectUser) // User initialized in app component
      .pipe(
        takeWhile(() => !this.emailSubmitted)
      )
      .subscribe(user => {
        console.log('Checking for user to subscribe', user);
        if (user) {
          // Update the user's name and email address (or add to a new billing details object)
          const updatedUser: PublicUser = {
            ...user,
            billingDetails: user.billingDetails ? {
              ...user.billingDetails,
              firstName: (this.firstName.value as string).trim(),
              email: (this.email.value as string).trim()
            } : {
              firstName: (this.firstName.value as string).trim(),
              email: (this.email.value as string).trim()
            }
          };

          console.log('Subscribe email submitted', updatedUser);

          // Update user record
          this.store$.dispatch(new UserStoreActions.StoreUserDataRequested({userData: updatedUser}));

          // Submit subscriber data to admin
          const emailSubData: EmailSubData = {
            user: updatedUser,
            subSource: SubscriptionSource.WEBSITE_BOX
          };
          this.store$.dispatch(new UserStoreActions.SubscribeUserRequested({emailSubData}));

          // Mark email submitted to close the subscription
          this.emailSubmitted = true;
        }
      });
  }

  private initializeSubscribeObservers() {
    this.subscribeProcessing$ = this.store$.select(UserStoreSelectors.selectSubscribeProcessing);
    this.subscribeSubmitted$ = this.store$.select(UserStoreSelectors.selectSubscribeSubmitted);
  }

  // These getters are used for easy access in the HTML template
  get firstName() { return this.subscribeForm.get('firstName'); }
  get email() { return this.subscribeForm.get('email'); }

}
