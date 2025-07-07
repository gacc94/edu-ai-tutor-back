import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FirebaseUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log({ request: request.firebaseUser });
    return request.firebaseUser;
});
