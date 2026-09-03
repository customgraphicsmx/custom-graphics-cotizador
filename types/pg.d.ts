declare module "pg" {
  export const types: {
    setTypeParser(oid: number, parser: (value: string) => unknown): void;
  };

  export type QueryResult<T extends Record<string, unknown> = Record<string, unknown>> = {
    rows: T[];
    rowCount: number;
  };

  export interface PoolClient {
    query<T extends Record<string, unknown> = Record<string, unknown>>(
      text: string,
      values?: unknown[],
    ): Promise<QueryResult<T>>;
    release(): void;
  }

  export class Pool {
    constructor(config?: { connectionString?: string });
    query<T extends Record<string, unknown> = Record<string, unknown>>(
      text: string,
      values?: unknown[],
    ): Promise<QueryResult<T>>;
    connect(): Promise<PoolClient>;
  }
}
