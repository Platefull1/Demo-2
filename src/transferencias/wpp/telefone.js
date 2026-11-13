/** Mesma regra de src/tarefas/tarefaHandler.js / src/transferencias/telefone.ts */
export function canonicalizarTelefone(telefone) {
  let d = String(telefone || '').replace(/\D/g, '');
  if (!d) return d;
  if ((d.length === 12 || d.length === 13) && d.startsWith('55')) {
    d = d.slice(2);
  }
  if (d.length === 11 && d[2] === '9') {
    d = d.slice(0, 2) + d.slice(3);
  }
  return d;
}
