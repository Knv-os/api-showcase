import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

export class CognitoLoginDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}

export class CognitoRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}

export class CognitoChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  public oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public newPassword: string;
}

export class CognitoForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

export class CognitoConfirmForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public confirmationCode: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public newPassword: string;
}

export class CognitoCreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;

  @IsOptional()
  @IsString()
  public groupName?: string;
}
