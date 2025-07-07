import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Inject } from '@nestjs/common';
import { FIRESTORE_PROVIDER, AUTH_PROVIDER } from './firebase.tokens';

export class FirebaseService {
    private readonly logger = new Logger(FirebaseService.name);
    constructor(
        @Inject(FIRESTORE_PROVIDER) private readonly _firestore: admin.firestore.Firestore,
        @Inject(AUTH_PROVIDER) private readonly _auth: admin.auth.Auth,
    ) {
        this.logger.log('FirebaseService initialized');
    }

    get firestore(): admin.firestore.Firestore {
        return this._firestore;
    }

    get auth(): admin.auth.Auth {
        return this._auth;
    }
}
