import * as functions from 'firebase-functions';
import { EnvironmentTypes, PRODUCTION_APPS, SANDBOX_APPS } from '../../../shared-models/environments/env-vars.model';

export const currentEnvironmentType = functions.config().environment.type;

const getAdminProjectId = (): string => {
  let projectId: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      projectId = PRODUCTION_APPS.maryDaphneAdminApp.projectId;
      break;
    case EnvironmentTypes.SANDBOX:
      projectId = SANDBOX_APPS.maryDaphneAdminApp.projectId;
      break;
    default:
      projectId = SANDBOX_APPS.maryDaphneAdminApp.projectId;
      break;
  }
  return projectId;
}

export const adminProjectId = getAdminProjectId();

const getPublicProjectId = (): string => {
  let projectId: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      projectId = PRODUCTION_APPS.maryDaphnePublicApp.projectId;
      break;
    case EnvironmentTypes.SANDBOX:
      projectId = SANDBOX_APPS.maryDaphnePublicApp.projectId;
      break;
    default:
      projectId = SANDBOX_APPS.maryDaphnePublicApp.projectId;
      break;
  }
  return projectId;
}

export const publicProjectId = getPublicProjectId();

const getPublicAppUrl = (): string => {
  let appUrl: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      appUrl = PRODUCTION_APPS.maryDaphnePublicApp.websiteDomain;
      break;
    case EnvironmentTypes.SANDBOX:
      appUrl = SANDBOX_APPS.maryDaphnePublicApp.websiteDomain;
      break;
    default:
      appUrl = SANDBOX_APPS.maryDaphnePublicApp.websiteDomain;
      break;
  }
  return appUrl
}

export const publicAppUrl = getPublicAppUrl();