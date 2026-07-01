'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface CreateConta {
  senha: string;
  tipo_conta: 'CORRENTE' | 'POUPANÇA' | 'UNIVERSITARIA' | 'SALARIO';
  saldo?: number;
  data_abertura?: string;
}

interface ResponseConta {
  id: number;
  senha: string;
  tipo_conta: string;
  saldo: number;
  data_abertura: string;
  [key: string]: unknown;
}

export async function createConta(
  clienteId: number,
  conta: CreateConta
): Promise<ResponseConta | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      redirect('/login');
    }

    // 1. Criar a conta
    const createResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        senha: conta.senha,
        tipo_conta: conta.tipo_conta,
        saldo: conta.saldo ?? 0,
        data_abertura: conta.data_abertura ?? new Date().toISOString(),
      }),
    });

    const contaData = (await createResponse.json()) as ResponseConta;

    if (createResponse.status !== 201) {
      if (createResponse.status === 401) {
        redirect('/login');
      }
      return null;
    }

    // 2. Conectar a conta ao cliente
    try {
      const connectResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contas/${contaData.id}/conectar`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            clienteIds: [clienteId],
          }),
        }
      );

      if (!connectResponse.ok) {
        console.error('Falha ao conectar conta ao cliente:', connectResponse.status);
      }
    } catch (connectError) {
      // Se falhar a conexão, a conta foi criada mesmo assim
      console.error('Erro ao conectar conta ao cliente:', connectError);
    }

    revalidateTag('listar','max');
    return contaData;
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return null;
  }
}