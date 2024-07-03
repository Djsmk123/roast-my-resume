import { cert, getApp, getApps, initializeApp, } from 'firebase-admin/app';
import { getFirestore, } from 'firebase-admin/firestore';
import { getRemoteConfig } from 'firebase-admin/remote-config';
const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);
let regularObj = {};
Object.assign(regularObj, serviceAccount);
const firebaseAdminConfig = {
    credential: cert(regularObj)
}
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseAdminConfig);
const firestoreInstance = getFirestore(app);
const resumeRoastCollection = firestoreInstance.collection("resumeRoast");
//remote config
const remoteConfig = getRemoteConfig(app);

export default

    {
        resumeRoastCollection,
        remoteConfig


    };