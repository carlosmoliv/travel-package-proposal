import { DataSource, EntityTarget } from 'typeorm';

export class OrmHelper {
  static async clearTables(
    dataSource: DataSource,
    entities: EntityTarget<any>[],
  ): Promise<void> {
    for (const entity of entities) {
      const tableName = dataSource.getMetadata(entity).tableName;
      await dataSource.query(`TRUNCATE TABLE ${tableName} CASCADE`);
    }
  }
}
