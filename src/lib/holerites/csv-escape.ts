/**
 * Escapa célula CSV (separador `;`) e neutraliza CSV injection
 * (=, +, -, @, tab, CR no início).
 */
export function csvEscapeCell(v: string): string {
  let s = v ?? '';
  if (/^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }
  if (/[;"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
