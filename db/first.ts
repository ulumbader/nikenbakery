export async function first<T>(query: PromiseLike<T[]>): Promise<T | undefined> {
  return (await query)[0];
}
