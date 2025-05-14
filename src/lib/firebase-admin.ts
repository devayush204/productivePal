
import admin from 'firebase-admin';
import type { App as FirebaseAdminApp, ServiceAccount } from 'firebase-admin/app';

let app: FirebaseAdminApp;

if (!admin.apps.length) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Replace newlines characters for private key if stored directly in .env
    // If using base64, decode it first.
    privateKey: (process.env.FIREBASE_PRIVATE_KEY_BASE64 
        ? Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8') 
        : process.env.FIREBASE_PRIVATE_KEY || ''
    ).replace(/\\n/g, '\n'),
  };

  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    console.error("Firebase Admin SDK environment variables are not fully configured.");
    // Depending on your error handling strategy, you might throw an error here
    // or allow the app to continue with Firebase Admin features disabled.
  } else {
     try {
        app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin SDK initialized successfully.");
     } catch (error) {
        console.error("Firebase Admin SDK initialization error:", error);
     }
  }
} else {
  app = admin.app();
  console.log("Firebase Admin SDK already initialized.");
}

export const adminDb = app ? app.firestore() : null; // Export Firestore instance, or null if init failed
export const adminAuth = app ? app.auth() : null; // Export Auth instance, or null if init failed
export { app as adminApp }; // Export the app instance itself
