import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { secrets } from "../secrets.js";

initializeApp({
  credential: cert(secrets)
});

export const db = getFirestore();
