import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { FirebaseAuthGuard } from 'src/common/guards/firebase-auth.guard';
import { FirebaseUser } from 'src/common/decorators/firebase.user.decorator';
import { DecodedFirebaseToken } from './user.interface';

@Controller('user')
@UseGuards(FirebaseAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('')
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Post('auth')
    async handleUserAuth(@FirebaseUser() firebaseUser: DecodedFirebaseToken) {
        console.log({ firebaseUser });
        try {
            const result = await this.userService.handleUserAuth(firebaseUser);

            console.log({ result });

            return {
                success: true,
                message: result.isNewUser ? 'Usuario creado exitosamente' : 'Usuario autenticado exitosamente',
                user: result.user,
                isNewUser: result.isNewUser,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                error: error.code || 'UNKNOWN_ERROR',
            };
        }
    }
}
