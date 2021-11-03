import { FirebaseApp, initializeApp } from "firebase/app";

import { Analytics, getAnalytics } from "firebase/analytics";

import firebaseConfig from "./secret.json";

export default function initFirebase() {
  app = initializeApp(firebaseConfig);

  analytics = getAnalytics(app);
}

export var app: FirebaseApp;
export var analytics: Analytics;
