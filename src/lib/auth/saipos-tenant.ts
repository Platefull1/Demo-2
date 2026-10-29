/** A UserAPI Saipos pertence à conta logada (não ao tenant RH). */
export function saiposApiBelongsToUser(
  api: { userId: string; type: string } | null | undefined,
  userId: string,
): boolean {
  return Boolean(api && api.type === 'saipos' && api.userId === userId);
}
