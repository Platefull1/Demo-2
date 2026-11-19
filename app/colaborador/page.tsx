import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/** Placeholder: redirect até as telas da etapa 5. */
export default async function ColaboradorIndexPage() {
  const jar = await cookies();
  const token = jar.get('employee_token')?.value;
  redirect(token ? '/colaborador/inicio' : '/colaborador/login');
}
