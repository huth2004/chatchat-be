import { Injectable } from '@nestjs/common';
import { User } from '@/domains/user/entities/user.entity';
import { UserRepository } from '@/infrastructure/database/persistence/user/repositories/user.repository';

import { UserInfrastructure } from '@/infrastructure/database/persistence/user/entities/user-infra.entity';
import { UserMapper } from '@/infrastructure/database/persistence/user/mappers/user.mapper';

const users: UserInfrastructure[] = [
  {
    id: '0',
    username: 'admin',
    avatarUrl: null,
    role: 'admin',
    password: '$2a$10$XAGtJD/pfjYR1f9/4p6I.ODHsWJs/4HPSBqgfr3n4qYUxrW6egAXa',
    createdAt: new Date(),
    updatedAt: null,
    isDeleted: false,
    deletedAt: null,
  },
  {
    id: '1',
    username: 'user',
    avatarUrl: null,
    role: 'user',
    password: '$2a$10$XAGtJD/pfjYR1f9/4p6I.ODHsWJs/4HPSBqgfr3n4qYUxrW6egAXa',
    createdAt: new Date(),
    updatedAt: null,
    isDeleted: false,
    deletedAt: null,
  },
];

@Injectable()
export class UserImplRepository implements UserRepository {
  userMapper: UserMapper = new UserMapper();

  findAll(): Promise<User[]> {
    return new Promise((resolve) => {
      const domainUsers = users.map((user) =>
        this.userMapper.toDomainEntity(user),
      );
      resolve(domainUsers);
    });
  }
  findById(id: string): Promise<User | null> {
    return new Promise((resolve) => {
      const user = users.find((user) => user.id === id);
      if (user) {
        resolve(this.userMapper.toDomainEntity(user));
      } else {
        resolve(null);
      }
    });
  }
  create(
    entity: Omit<
      User,
      'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'
    >,
  ): Promise<User> {
    return new Promise((resolve) => {
      const newUser: User = {
        id: users.length.toString(),
        createdAt: new Date(),
        updatedAt: null,
        isDeleted: false,
        deletedAt: null,
        ...entity,
      };
      users.push(this.userMapper.toInfraEntity(newUser));
      resolve(newUser);
    });
  }
  update(id: string, entity: Partial<User>): Promise<User | null> {
    return new Promise((resolve) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        const updatedUser = {
          ...users[userIndex],
          ...entity,
          updatedAt: new Date(),
        };
        users[userIndex] = updatedUser;
        resolve(this.userMapper.toDomainEntity(updatedUser));
      } else {
        resolve(null);
      }
    });
  }
  delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  findByUsername(username: string): Promise<User | null> {
    return new Promise((resolve) => {
      const user = users.find((user) => user.username === username);
      if (user) {
        resolve(this.userMapper.toDomainEntity(user));
      } else {
        resolve(null);
      }
    });
  }

  searchByUsername(query: string): Promise<User[]> {
    return new Promise((resolve) => {
      const matchedUsers = users.filter((user) =>
        user.username.includes(query),
      );
      const domainUsers = matchedUsers.map((user) =>
        this.userMapper.toDomainEntity(user),
      );
      resolve(domainUsers);
    });
  }

  isExist(userIds: string[]): Promise<boolean> {
    return new Promise((resolve) => {
      const existingUsers = users.filter((user) => userIds.includes(user.id));
      resolve(existingUsers.length === userIds.length);
    });
  }
}
