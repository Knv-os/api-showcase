import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY, SESSION_EXPIRES } from '@config';
import { AuthLoginDto } from '@/apis/auth/dtos/auth.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@/apis/auth/interfaces/auth.interface';
import { User } from '@/apis/users/interfaces/users.interface';
import { isEmpty } from '@/utils/util';
import { UserRepository } from '@/apis/users/repositories/users.repository';

class AuthService {
  public userRepository = new UserRepository();

  public async login(userData: AuthLoginDto): Promise<{ cookie: string; tokenData: TokenData; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You not send userData");

    const findUser: User = await this.userRepository.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `Email ${userData.email} not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password not matching");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, tokenData, findUser };
  }

  public createToken(authEntity: Partial<User>): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: authEntity.id };
    const secretKey: string = SECRET_KEY;
    const expiresIn = Number(SESSION_EXPIRES);

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
