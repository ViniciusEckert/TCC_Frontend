'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Conta {
  id: string;
  tipo: 'Corrente' | 'Poupança' | 'Salário';
  numero: string;
  agencia: string;
  saldo: number;
}

export interface Cartao {
  id: string;
  final: string;
  bandeira: 'Visa' | 'Mastercard';
  limite: number;
  usado: number;
  status: 'Ativo' | 'Bloqueado';
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;          // positivo = entrada, negativo = saída
  tipo: 'entrada' | 'saida' | 'transferencia';
  data: string;           // ISO 8601
  categoria: string;
}

export interface DashboardData {
  cliente: {
    nome: string;
    cpf: string;
    ultimoAcesso: string;
  };
  saldoTotal: number;
  contas: Conta[];
  cartoes: Cartao[];
  transferenciasRealizadas: number;   // total de transferências no mês
  transacoes: Transacao[];
}

// ─── Helper de sessão ─────────────────────────────────────────────────────────

async function getSessionToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get('session')?.value ?? null;
}

// ─── Action principal ─────────────────────────────────────────────────────────

export async function getDashboardData(): Promise<DashboardData> {
  const token = await getSessionToken();

  if (!token) {
    redirect('/login');
  }

  // ── Integração real (descomente e adapte) ────────────────────────────────
  //
  // const [clienteRes, contasRes, cartoesRes, transacoesRes] = await Promise.all([
  //   fetch(`${process.env.API_URL}/cliente/me`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //     cache: 'no-store',
  //   }),
  //   fetch(`${process.env.API_URL}/contas`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //     cache: 'no-store',
  //   }),
  //   fetch(`${process.env.API_URL}/cartoes`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //     cache: 'no-store',
  //   }),
  //   fetch(`${process.env.API_URL}/transacoes?limit=8`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //     cache: 'no-store',
  //   }),
  // ]);
  //
  // if (!clienteRes.ok) redirect('/login');
  //
  // const cliente   = await clienteRes.json();
  // const contas    = await contasRes.json();
  // const cartoes   = await cartoesRes.json();
  // const { transacoes, transferenciasRealizadas } = await transacoesRes.json();
  //
  // return { cliente, saldoTotal: contas.reduce(...), contas, cartoes,
  //          transferenciasRealizadas, transacoes };

  // ── Dados simulados para desenvolvimento ────────────────────────────────────
  return {
    cliente: {
      nome: 'Rafael Mendonça',
      cpf: '***.***.890-12',
      ultimoAcesso: new Date(Date.now() - 1000 * 60 * 32).toISOString(), // 32 min atrás
    },
    saldoTotal: 48_320.75,
    contas: [
      {
        id: 'c1',
        tipo: 'Corrente',
        numero: '12345-6',
        agencia: '0042',
        saldo: 25_450.0,
      },
      {
        id: 'c2',
        tipo: 'Poupança',
        numero: '78901-2',
        agencia: '0042',
        saldo: 22_870.75,
      },
    ],
    cartoes: [
      {
        id: 'k1',
        final: '4829',
        bandeira: 'Visa',
        limite: 15_000,
        usado: 3_240.5,
        status: 'Ativo',
      },
      {
        id: 'k2',
        final: '1173',
        bandeira: 'Mastercard',
        limite: 8_000,
        usado: 0,
        status: 'Bloqueado',
      },
    ],
    transferenciasRealizadas: 14,
    transacoes: [
      {
        id: 't1',
        descricao: 'Pix recebido · João Alves',
        valor: 1_200.0,
        tipo: 'entrada',
        data: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        categoria: 'Pix',
      },
      {
        id: 't2',
        descricao: 'Mercado Extra',
        valor: -347.8,
        tipo: 'saida',
        data: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        categoria: 'Alimentação',
      },
      {
        id: 't3',
        descricao: 'TED · Fernanda Lima',
        valor: -2_500.0,
        tipo: 'transferencia',
        data: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
        categoria: 'Transferência',
      },
      {
        id: 't4',
        descricao: 'Salário · Acme Corp',
        valor: 9_800.0,
        tipo: 'entrada',
        data: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        categoria: 'Salário',
      },
      {
        id: 't5',
        descricao: 'Netflix',
        valor: -55.9,
        tipo: 'saida',
        data: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        categoria: 'Streaming',
      },
      {
        id: 't6',
        descricao: 'Pix recebido · Mariana Costa',
        valor: 450.0,
        tipo: 'entrada',
        data: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        categoria: 'Pix',
      },
      {
        id: 't7',
        descricao: 'Posto Shell',
        valor: -210.0,
        tipo: 'saida',
        data: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
        categoria: 'Combustível',
      },
      {
        id: 't8',
        descricao: 'TED enviado · Carlos Rocha',
        valor: -800.0,
        tipo: 'transferencia',
        data: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
        categoria: 'Transferência',
      },
    ],
  };
}

// ─── Action de logout ─────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete('session');
  redirect('/login');
}