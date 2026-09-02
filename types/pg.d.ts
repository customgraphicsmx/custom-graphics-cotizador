declare module "pg" {
  export const types: {
    setTypeParser(oid: number, parser: (value: string) => unknown): void;
  };

  export class Pool {
    constructor(config?: { connectionString?: string });
    query<T extends Record<string, unknown> = Record<string, unknown>>(text: string, values?: unknown[]): Promise<{ rows: T[] }>;
  }
}
