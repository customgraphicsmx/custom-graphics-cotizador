declare module "pg" {
  export class Pool {
    constructor(config?: { connectionString?: string });
    query<T extends Record<string, unknown> = Record<string, unknown>>(text: string, values?: unknown[]): Promise<{ rows: T[] }>;
  }
}
