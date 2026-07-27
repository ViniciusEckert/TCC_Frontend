'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

interface AtualizarSaldo {
  saldo: number;
}

export async function atualizarSaldo(
  contaId: number,
  dados: AtualizarSaldo
): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      redirect('/login');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contas/${contaId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          saldo: dados.saldo,
        }),
      }
    );

    if (response.status === 401) {
      redirect('/login');
    }

    if (!response.ok) {
      console.error(await response.text());
      return false;
    }

    revalidateTag('listar', 'max');

    return true;
  } catch (error) {
    console.error('Erro ao atualizar saldo:', error);
    return false;
  }
}