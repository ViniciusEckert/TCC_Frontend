'use server';

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

interface CadastroPayload {
  nome: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  senha: string;
}

interface CadastroResponse {
  success: boolean;
  message?: string;
  data?: Cliente;
}

export async function cadastroAction(
  payload: CadastroPayload
): Promise<CadastroResponse> {
  console.log(process.env.NEXT_PUBLIC_API_URL)
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error: { message?: string } = await response.json();

      return {
        success: false,
        message: error.message || 'Erro ao criar conta.',
      };
    }

    const data: Cliente = await response.json();

    return {
      success: true,
      data,
    };

  } catch (error) {
    console.error('Erro ao cadastrar:', error);

    return {
      success: false,
      message: 'Serviço indisponível. Tente novamente.',
    };
  }
}