import { Injectable } from '@nestjs/common';
import { MemberRepository } from '@/infrastructure/database/persistence/chat/repositories/member.repository';
import { Member } from '@/domains/chat/entities/member.entity';
import { MemberInfrastructure } from '../entities/member-infra.entity';
import { MemberMapper } from '../mappers/member.mapper';

const members: MemberInfrastructure[] = [];

@Injectable()
export class MemberImplRepository implements MemberRepository {
  memberMapper: MemberMapper = new MemberMapper();

  findAll(): Promise<Member[]> {
    return Promise.resolve(
      members.map((member) => this.memberMapper.toDomainEntity(member)),
    );
  }
  findById(id: string): Promise<Member | null> {
    const member = members.find((member) => member.id === id);
    return Promise.resolve(
      member ? this.memberMapper.toDomainEntity(member) : null,
    );
  }
  create(
    entity: Omit<
      Member,
      'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'
    >,
  ): Promise<Member> {
    const newMember: Member = {
      id: members.length.toString(),
      createdAt: new Date(),
      updatedAt: null,
      isDeleted: false,
      deletedAt: null,
      ...entity,
    };
    members.push(this.memberMapper.toInfraEntity(newMember));
    return Promise.resolve(newMember);
  }
  update(
    id: string,
    entity: Partial<
      Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'deletedAt'>
    >,
  ): Promise<Member | null> {
    const index = members.findIndex((member) => member.id === id);
    if (index === -1) {
      return Promise.resolve(null);
    }
    const updatedMember: MemberInfrastructure = {
      ...members[index],
      ...entity,
      updatedAt: new Date(),
    };
    members[index] = updatedMember;
    return Promise.resolve(this.memberMapper.toDomainEntity(updatedMember));
  }
  delete(id: string): Promise<boolean> {
    const index = members.findIndex((member) => member.id === id);
    if (index === -1) {
      return Promise.resolve(false);
    }
    members.splice(index, 1);
    return Promise.resolve(true);
  }

  findAllByUserId(userId: string): Promise<Member[]> {
    const userMembers = members.filter((member) => member.userId === userId);
    return Promise.resolve(
      userMembers.map((member) => this.memberMapper.toDomainEntity(member)),
    );
  }

  findAllByConversationId(conversationId: string): Promise<Member[]> {
    const conversationMembers = members.filter(
      (member) => member.conversationId === conversationId,
    );
    return Promise.resolve(
      conversationMembers.map((member) =>
        this.memberMapper.toDomainEntity(member),
      ),
    );
  }

  findByUserIdAndConversationId(
    userId: string,
    conversationId: string,
  ): Promise<Member | null> {
    const member = members.find(
      (member) =>
        member.userId === userId && member.conversationId === conversationId,
    );
    return Promise.resolve(
      member ? this.memberMapper.toDomainEntity(member) : null,
    );
  }
}
