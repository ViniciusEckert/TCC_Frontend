'use server';

import { redirect } from 'next/navigation';

export interface LoginPayload {
  cpf: string;   // apenas dígitos, ex: "01234567890"
  senha: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
}

export async function loginAction(payload: LoginPayload): Promise<LoginResult> {
  const { cpf, senha } = payload;

  // ── Validação básica ─────────────────────────────────────────────────────────
  if (!cpf || cpf.length !== 11) {
    return { success: false, message: 'CPF inválido.' };
  }

  if (!senha || senha.length < 6) {
    return { success: false, message: 'Senha deve ter ao menos 6 caracteres.' };
  }

  // ── Chamada à API / banco de dados ───────────────────────────────────────────
  // Substitua pelo seu serviço real de autenticação.
  // Exemplo com fetch para uma API REST interna:
  //
  // const res = await fetch(`${process.env.API_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ cpf, senha }),
  //   cache: 'no-store',
  // });
  //
  // if (!res.ok) {
  //   const body = await res.json().catch(() => ({}));
  //   return { success: false, message: body?.message ?? 'CPF ou senha incorretos.' };
  // }
  //
  // const { token } = await res.json();
  //
  // ── Persistência da sessão ───────────────────────────────────────────────────
  // Exemplo com next-auth, iron-session, ou cookies:
  //
  // (await cookies()).set('session', token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'strict',
  //   path: '/',
  //   maxAge: 60 * 60 * 8, // 8 horas
  // });

  // ── Simulação para desenvolvimento ──────────────────────────────────────────
  // Remova este bloco quando integrar o serviço real.
  if (cpf === '00000000000' && senha === 'senha123') {
    // Simula sucesso → redireciona para o dashboard
    redirect('/dashboard');
  }

  return { success: false, message: 'CPF ou senha incorretos.' };
}