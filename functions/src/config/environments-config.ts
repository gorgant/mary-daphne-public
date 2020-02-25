import * as functions from 'firebase-functions';
import { EnvironmentTypes, PRODUCTION_APPS, SANDBOX_APPS } from '../../../shared-models/environments/env-vars.model';
import { ProductIdList, ProductUrlSlugList, ProductReferenceList } from '../../../shared-models/products/product-id-list.model';
import { PublicAppRoutes } from '../../../shared-models/routes-and-paths/app-routes.model';

export const currentEnvironmentType = functions.config().environment.type;

const getAdminProjectId = (): string => {
  let projectId: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      projectId = PRODUCTION_APPS.explearningAdminApp.projectId
      break;
    case EnvironmentTypes.SANDBOX:
      projectId = SANDBOX_APPS.explearningAdminApp.projectId
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when getting admin project ID`);
  }
  return projectId;
}
export const adminProjectId = getAdminProjectId();

const getPublicProjectId = (): string => {
  let projectId: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      projectId = PRODUCTION_APPS.explearningPublicApp.projectId;
      break;
    case EnvironmentTypes.SANDBOX:
      projectId = SANDBOX_APPS.explearningPublicApp.projectId;
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when getting public project ID`);
  }
  return projectId;
}

export const publicProjectId = getPublicProjectId();

const getPublicAppUrl = (): string => {
  let appUrl: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      appUrl = PRODUCTION_APPS.explearningPublicApp.websiteDomain;
      break;
    case EnvironmentTypes.SANDBOX:
      appUrl = SANDBOX_APPS.explearningPublicApp.websiteDomain;
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when getting public project ID`);
  }
  return appUrl
}
export const publicAppUrl = getPublicAppUrl();

const getRemoteCoachProductId = (): string => {
  let remoteCoachId: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      remoteCoachId = ProductIdList.EXPLEARNING_REMOTE_COACH
      break;
    case EnvironmentTypes.SANDBOX:
      remoteCoachId = ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH;
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when getting Remote Coach product ID`);
  }
  return remoteCoachId
}
export const remoteCoachProductId = getRemoteCoachProductId();

const getRemoteCoachSlug = (): string => {
  let slug: string;
  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      slug = ProductUrlSlugList.REMOTE_COACH;
      break;
    case EnvironmentTypes.SANDBOX:
      slug = ProductUrlSlugList.SANDBOX_REMOTE_COACH;
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when getting Remote Coach slug`);
  }
  return slug;
}
export const remoteCoachProductSlug = getRemoteCoachSlug();

export const getProductUrlById = (productId: string): string => {
  const productSlug = ProductReferenceList[productId].productUrlSlug;
  const url = `https://${publicAppUrl}${PublicAppRoutes.PRODUCTS}/${productId}/${productSlug}`;
  return url;
};