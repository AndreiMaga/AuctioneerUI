import { FirebaseApp, initializeApp } from "firebase/app";

import { Analytics, getAnalytics } from "firebase/analytics";

import firebaseConfig from "./secret.json";
import { Firestore, getFirestore } from "firebase/firestore";

export default function initFirebase() {
  app = initializeApp(firebaseConfig);

  analytics = getAnalytics(app);
  database = getFirestore(app);
}

export var app: FirebaseApp;
export var analytics: Analytics;

export var database: Firestore;
