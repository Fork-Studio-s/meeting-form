import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

let db = null;

export function getFirestoreDb() {
  if (db) return db;

  const projectId = process.env.FIREBASE_PROJECT_ID
    ? process.env.FIREBASE_PROJECT_ID.trim().replace(/^["']+|["']+$/g, '')
    : '';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    ? process.env.FIREBASE_CLIENT_EMAIL.trim().replace(/^["']+|["']+$/g, '')
    : '';
  let privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.trim()
    : '';

  if (!projectId || !clientEmail || !privateKey) {
    console.error('[Firebase] Missing credentials:', {
      hasProjectId: Boolean(projectId),
      hasClientEmail: Boolean(clientEmail),
      hasPrivateKey: Boolean(privateKey),
    });
    return null;
  }

  // Strip any leading or trailing quotes (single or double)
  privateKey = privateKey.replace(/^["']+|["']+$/g, '').trim();

  // Convert escaped literal \n to actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n').replace(/\r\n/g, '\n').trim();

  try {
    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });

    db = getFirestore(app);
    console.log('[Firebase] Cloud Firestore initialized successfully for project:', projectId);
    return db;
  } catch (err) {
    console.error('[Firebase] Initialization error:', err);
    return null;
  }
}

export { FieldValue };
