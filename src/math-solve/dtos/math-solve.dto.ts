import { IsNotEmpty, IsString } from 'class-validator';

export class MathSolveDto {
    @IsString()
    @IsNotEmpty()
    prompt: string;
}
