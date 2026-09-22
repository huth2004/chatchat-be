import { BaseRepository } from '@/infrastructure/database/persistence/base.repository';
import { Member } from '@/domains/chat/entities/member.entity';

export abstract class MemberRepository extends BaseRepository<Member> {
  abstract findAllByUserId(userId: string): Promise<Member[]>;
  abstract findAllByConversationId(conversationId: string): Promise<Member[]>;
  abstract findByUserIdAndConversationId(
    userId: string,
    conversationId: string,
  ): Promise<Member | null>;
}
