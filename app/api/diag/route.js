import { getFirestoreDb } from '../../../lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  let firestoreTest = 'not_attempted';
  let firestoreError = null;

  const db = getFirestoreDb();
  if (db) {
    try {
      const snap = await db.collection('leads').limit(1).get();
      firestoreTest = `success_read_${snap.size}_docs`;
    } catch (err) {
      firestoreTest = 'failed';
      firestoreError = {
        message: err.message,
        code: err.code,
        stack: err.stack?.split('\n').slice(0, 3),
      };
    }
  } else {
    firestoreTest = 'db_instance_null';
  }

  return Response.json({
    deployTime: new Date().toISOString(),
    commit: 'diag-check-v1',
    envChecks: {
      hasProjectId: Boolean(projectId),
      projectIdValue: projectId ? projectId.trim() : null,
      hasClientEmail: Boolean(clientEmail),
      hasPrivateKey: Boolean(privateKey),
      privateKeyLength: privateKey ? privateKey.length : 0,
      privateKeyStartsWith: privateKey ? privateKey.slice(0, 28) : null,
      privateKeyEndsWith: privateKey ? privateKey.slice(-28) : null,
    },
    firestoreTest,
    firestoreError,
  });
}
