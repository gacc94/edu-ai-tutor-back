import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIRESTORE_PROVIDER, AUTH_PROVIDER, FIREBASE_APP_PROVIDER } from './firebase.tokens';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
    controllers: [],
    providers: [
        {
            provide: FIREBASE_APP_PROVIDER,
            useFactory: () => {
                if (admin.apps.length > 0) {
                    return admin.app();
                }
                return admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
                    }),
                });
            },
        },
        {
            provide: FIRESTORE_PROVIDER,
            useFactory: (app: admin.app.App) => app.firestore(),
            inject: [FIREBASE_APP_PROVIDER],
        },
        {
            provide: AUTH_PROVIDER,
            useFactory: (app: admin.app.App) => app.auth(),
            inject: [FIREBASE_APP_PROVIDER],
        },
        FirebaseService,
    ],
    exports: [FIREBASE_APP_PROVIDER, FIRESTORE_PROVIDER, AUTH_PROVIDER, FirebaseService],
})
export class FirebaseModule {}
