import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(private readonly _firebaseService: FirebaseService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // Extraer token del header Authorization o del body
        const token = this.extractTokenFromRequest(request);

        if (!token) {
            throw new UnauthorizedException('Token de autenticación requerido');
        }

        try {
            // Verificar el token con Firebase Admin
            const decodedToken = await this._firebaseService.auth.verifyIdToken(token);

            // Agregar información del usuario decodificado al request
            console.log({ decodedToken });
            request.firebaseUser = decodedToken;

            return true;
        } catch (error) {
            if (error.code === 'auth/id-token-expired') {
                throw new UnauthorizedException('Token expirado');
            }
            if (error.code === 'auth/invalid-id-token') {
                throw new UnauthorizedException('Token inválido');
            }
            throw new UnauthorizedException('Token de autenticación inválido');
        }
    }

    private extractTokenFromRequest(request: any): string | null {
        // Prioridad: Header Authorization -> Body idToken
        const authHeader = request.headers?.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }

        // Fallback al campo idToken del body (para casos específicos)
        return request.body?.idToken || null;
    }
}
