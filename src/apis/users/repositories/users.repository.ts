import { Prisma } from '@prisma/client';
import { prisma } from '@databases';
import { hash } from 'bcrypt';
import { User, UserFindWhere, UserCreateBody, UserUpdateBody } from '@/apis/users/interfaces/users.interface';
import { PaginationReqInterface, paginationReqHelper } from '@/helpers/pagination.helper';

export class UserRepository {
  public async findAll(paginationParams?: PaginationReqInterface, options?: Prisma.UsersFindManyArgs): Promise<User[]> {
    const users = await prisma.users.findMany({ ...paginationReqHelper(paginationParams), ...options });

    return users;
  }

  public async findById(userId: string): Promise<User> {
    const result = await prisma.users.findUnique({ where: { id: userId } });
    return result;
  }

  public async findOne(options: UserFindWhere): Promise<User | null> {
    const result = await prisma.users.findFirst({ where: { ...options } });

    return result ? result : null;
  }

  public async create(userData: UserCreateBody): Promise<User> {
    const hashedPassword = await hash(userData.password, 10);
    return prisma.users.create({ data: { ...userData, password: hashedPassword } });
  }

  public async update(userData: UserUpdateBody, userId: string): Promise<any> {
    let hashedPassword;
    if (userData.password) {
      hashedPassword = hash(`${userData.password}`, 10);
    }
    return prisma.users.update({ where: { id: userId }, data: { ...userData, password: hashedPassword ? hashedPassword : undefined } });
  }

  public async destroy(userId: string): Promise<User> {
    return prisma.users.delete({ id: userId });
  }

  public async count(where?: Prisma.Subset<Prisma.UsersCountArgs, Prisma.UsersCountArgs>): Promise<number> {
    return prisma.users.count({ ...where });
  }
}
