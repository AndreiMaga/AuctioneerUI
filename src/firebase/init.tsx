import { FirebaseApp, initializeApp } from "firebase/app";

import { Analytics, getAnalytics } from "firebase/analytics";

import firebaseConfig from "./secret.json";
import { Firestore, getFirestore } from "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";

export default function initFirebase() {
  app = initializeApp(firebaseConfig);

  analytics = getAnalytics(app);
  auth = getAuth(app);
  database = getFirestore(app);
}

export var app: FirebaseApp;
export var analytics: Analytics;
export var auth: Auth;
export var database: Firestore;
