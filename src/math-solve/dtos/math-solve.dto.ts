import { IsString } from 'class-validator';

export class MathSolveDto {
    @IsString()
    prompt: string;
}
