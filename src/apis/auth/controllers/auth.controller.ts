import { NextFunction, Request, Response } from 'express';
import { AuthLoginDto } from '@/apis/auth/dtos/auth.dto';
import { RequestWithUser } from '@/apis/auth/interfaces/auth.interface';
import AuthService from '@/apis/auth/services/auth.service';

class AuthController {
  public authService = new AuthService();

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData: AuthLoginDto = req.body;
      const { cookie, tokenData, findUser } = await this.authService.login(loginData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ user: findUser, token: tokenData.token });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).send('ok');
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
