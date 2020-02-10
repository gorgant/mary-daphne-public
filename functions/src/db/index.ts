import { publicApp, getMaryDaphneAdminApp } from "../apps";

// LOCAL VARIABLES
export const publicFirestore = publicApp.firestore();

// ADMIN VARIABLES
export const adminFirestore = getMaryDaphneAdminApp().firestore();