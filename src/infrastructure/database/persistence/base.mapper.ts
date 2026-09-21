export interface BaseMapper<DomainEntity, InfraEntity> {
  toDomainEntity(infraEntity: InfraEntity): DomainEntity;
  toInfraEntity(domainEntity: DomainEntity): InfraEntity;
}
