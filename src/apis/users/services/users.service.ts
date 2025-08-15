import { HttpException } from '@exceptions/HttpException';
import { User, UserCreateBody, UserUpdateBody } from '@apis/users/interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { UserRepository } from '@apis/users/repositories/users.repository';
import { PaginationReqInterface } from '@helpers/pagination.helper';

class UserService {
  public userRepository = new UserRepository();

  public async findAllUser(paginationParams: PaginationReqInterface): Promise<User[]> {
    return this.userRepository.findAll(paginationParams);
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'You not send userId');

    const findUser: User = await this.userRepository.findById(userId);
    if (!findUser) throw new HttpException(409, 'Not find user');

    return findUser;
  }

  public async createUser(userData: UserCreateBody): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'You not send userData');

    const findUser: User = await this.userRepository.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `E-mail ${userData.email} already exists`);

    const createUserData: User = await this.userRepository.create(userData);
    return createUserData;
  }

  public async updateUser(userId: string, userData: UserUpdateBody): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'You not send userData');

    const findUser: User = await this.userRepository.findById(userId);
    if (!findUser) throw new HttpException(409, 'Not find user');

    await this.userRepository.update(userData, userId);

    const updateUser: User = await this.userRepository.findById(userId);
    return updateUser;
  }

  public async deleteUser(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'You not send userId');

    const findUser: User = await this.userRepository.findById(userId);
    if (!findUser) throw new HttpException(409, 'Not find user');

    await this.userRepository.destroy(findUser.id);

    return findUser;
  }

  public async userCount(where?: string): Promise<number> {
    return this.userRepository.count(where ? { where: JSON.parse(where) } : undefined);
  }
}

export default UserService;
