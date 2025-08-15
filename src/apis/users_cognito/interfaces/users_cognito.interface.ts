import { Request } from 'express';

export interface CognitoUser {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  groups?: string[];
  [key: string]: any;
}

export interface RequestWithCognitoUser extends Request {
  cognitoUser: CognitoUser;
}

export interface CognitoUserProfile {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  groups: string[];
  attributes?: { [key: string]: any };
}

export interface CognitoAuthResponse {
  user: CognitoUserProfile;
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  cookie?: string;
}
