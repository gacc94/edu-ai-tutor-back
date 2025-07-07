import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { DecodedFirebaseToken, User } from './user.interface';
import * as admin from 'firebase-admin';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    private readonly INITIAL_CREDITS = 10;
    private readonly INITIAL_MAX_CREDITS = 10;

    constructor(private readonly _firebaseService: FirebaseService) {
        this.logger.log('UserService initialized');
    }

    async findAll() {
        this.logger.log('findAll');
        const users = await this._firebaseService.firestore.collection('users').get();
        return users.docs.map((doc) => doc.data());
    }

    async findOne(id: string) {
        this.logger.log('findOne');
        const user = await this._firebaseService.firestore.collection('users').doc(id).get();
        return user.data();
    }

    async create(user: any) {
        this.logger.log('create');
        const docRef = await this._firebaseService.firestore.collection('users').add(user);
        return docRef;
    }

    async handleUserAuth(decodedToken: DecodedFirebaseToken): Promise<{ user: User; isNewUser: boolean }> {
        const { uid, email, name, picture, firebase, email_verified, phone_number } = decodedToken;

        try {
            // 1. Verificar si el usuario ya existe en Firestore
            const userRef = this._firebaseService.firestore.collection('users').doc(uid);

            const userDoc = await userRef.get();

            // 2. Si el usuario existe, retornarlo
            if (userDoc.exists) {
                const existingUser = userDoc.data() as User;

                // Actualizar última conexión
                await userRef.update({
                    lastLoginAt: admin.firestore.Timestamp.now(),
                    updatedAt: admin.firestore.Timestamp.now(),
                });

                return {
                    user: {
                        ...existingUser,
                        lastLoginAt: admin.firestore.Timestamp.now(),
                        updatedAt: admin.firestore.Timestamp.now(),
                    },
                    isNewUser: false,
                };
            }

            // 3. Si no existe, crear nuevo usuario
            const newUser: User = {
                uid,
                email: email ?? '',
                displayName: name ?? '',
                photoURL: picture ?? '',
                phoneNumber: phone_number ?? null,
                emailVerified: email_verified ?? null,
                credits: {
                    current: this.INITIAL_CREDITS,
                    max: this.INITIAL_MAX_CREDITS,
                },
                provider: firebase.sign_in_provider ?? 'unknown',
                createdAt: admin.firestore.Timestamp.now(),
                updatedAt: admin.firestore.Timestamp.now(),
                lastLoginAt: admin.firestore.Timestamp.now(),
                isActive: true,
            };

            // 4. Guardar en Firestore
            await userRef.set(newUser);

            return {
                user: newUser,
                isNewUser: true,
            };
        } catch (error) {
            console.error('Error handling user auth:', error);
            throw error;
        }
    }
}
