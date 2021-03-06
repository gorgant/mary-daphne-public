import { PublicUser } from './public-user.model';
import { BillingKeys } from '../billing/billing-details.model';

export enum ContactFormKeys {
  MESSAGE = 'message',
  OPT_IN = 'optIn'
}

export interface ContactForm {
  id: string;
  createdDate: number;
  [BillingKeys.FIRST_NAME]: string;
  [BillingKeys.EMAIL]: string;
  [ContactFormKeys.MESSAGE]: string;
  publicUser: PublicUser;
  [ContactFormKeys.OPT_IN]: boolean;
}
