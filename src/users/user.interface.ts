import * as admin from 'firebase-admin';

export interface DecodedFirebaseToken {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
    firebase: {
        sign_in_provider: string;
        identities: any;
    };
    aud: string;
    auth_time: number;
    exp: number;
    iat: number;
    iss: string;
    sub: string;
    email_verified: boolean;
    phone_number: string;
}

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
    credits: {
        current: number;
        max: number;
    };
    provider: string;
    phoneNumber: string | null;
    emailVerified: boolean;
    createdAt: admin.firestore.Timestamp;
    updatedAt: admin.firestore.Timestamp;
    lastLoginAt: admin.firestore.Timestamp;
    isActive: boolean;
}
