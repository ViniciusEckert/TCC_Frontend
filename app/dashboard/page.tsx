import React from 'react';
import {
  Shield,
  Wallet,
  CreditCard,
  Landmark,
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  LogOut,
  Bell,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { getDashboardData, logoutAction, type Transacao } from './actions';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function brl(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `há ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  return `há ${Math.floor(hrs / 24)}d`;
}

function txIcon(t: Transacao) {
  if (t.tipo === 'entrada')
    return <ArrowDownLeft size={16} className="text-emerald-400" />;
  if (t.tipo === 'transferencia')
    return <ArrowLeftRight size={16} className="text-red-400" />;
  return <ArrowUpRight size={16} className="text-red-400" />;
}

// ─── Componentes de card reutilizáveis ────────────────────────────────────────

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative p-6 rounded-2xl border transition group overflow-hidden ${
        accent
          ? 'bg-gradient-to-br from-red-600/30 to-red-900/40 border-red-500/30'
          : 'bg-red-900/20 border-red-500/10 hover:border-red-500/30'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            accent ? 'bg-red-500/30' : 'bg-red-500/10'
          }`}
        >
          <Icon size={20} className="text-red-400" />
        </div>
        {accent && (
          <TrendingUp size={14} className="text-emerald-400 opacity-70" />
        )}
      </div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function DashboardPage() {
  const data = await getDashboardData();

  const primeiroNome = data.cliente.nome.split(' ')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-black text-white">

      {/* BLOBS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-3xl top-0 left-[5%]" />
        <div className="absolute w-80 h-80 bg-gradient-to-br from-pink-500/8 to-red-500/8 rounded-full blur-3xl bottom-0 right-[5%]" />
      </div>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-red-950/80 backdrop-blur border-b border-red-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-white font-bold text-lg">FinanceBank</span>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Notificações"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-red-500/10 transition"
            >
              <Bell size={18} />
            </button>

            {/* Avatar + logout */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-red-500/10 transition"
              >
                <div className="w-7 h-7 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center text-xs font-bold text-red-300">
                  {data.cliente.nome.charAt(0)}
                </div>
                <span className="hidden sm:inline">{primeiroNome}</span>
                <LogOut size={14} />
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* SAUDAÇÃO */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Bem-vindo de volta,</p>
            <h1 className="text-3xl font-bold">{data.cliente.nome}</h1>
            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
              <Clock size={11} />
              Último acesso {relativeTime(data.cliente.ultimoAcesso)}
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs">
            Conta verificada
          </span>
        </div>

        {/* CARDS DE RESUMO */}
        <section>
          <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Visão geral</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              icon={Wallet}
              label="Saldo total"
              value={brl(data.saldoTotal)}
              sub="Todas as contas"
              accent
            />
            <SummaryCard
              icon={CreditCard}
              label="Cartões"
              value={String(data.cartoes.length)}
              sub={`${data.cartoes.filter(c => c.status === 'Ativo').length} ativo(s)`}
            />
            <SummaryCard
              icon={Landmark}
              label="Contas"
              value={String(data.contas.length)}
              sub={data.contas.map(c => c.tipo).join(' · ')}
            />
            <SummaryCard
              icon={ArrowLeftRight}
              label="Transferências"
              value={String(data.transferenciasRealizadas)}
              sub="neste mês"
            />
          </div>
        </section>

        {/* CONTAS + CARTÕES */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* CONTAS */}
          <section>
            <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Minhas contas</h2>
            <div className="space-y-3">
              {data.contas.map(conta => (
                <div
                  key={conta.id}
                  className="p-5 bg-red-900/20 border border-red-500/10 rounded-xl hover:border-red-500/30 transition flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Landmark size={14} className="text-red-400" />
                      <span className="text-sm font-medium">{conta.tipo}</span>
                    </div>
                    <p className="text-gray-500 text-xs">
                      Ag. {conta.agencia} · Cc. {conta.numero}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Saldo</p>
                    <p className="text-white font-bold">{brl(conta.saldo)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CARTÕES */}
          <section>
            <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Meus cartões</h2>
            <div className="space-y-3">
              {data.cartoes.map(cartao => {
                const pct = Math.round((cartao.usado / cartao.limite) * 100);
                return (
                  <div
                    key={cartao.id}
                    className="p-5 bg-red-900/20 border border-red-500/10 rounded-xl hover:border-red-500/30 transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-red-400" />
                        <span className="text-sm font-medium">
                          {cartao.bandeira} •••• {cartao.final}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          cartao.status === 'Ativo'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {cartao.status}
                      </span>
                    </div>

                    {/* Barra de uso */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Usado: {brl(cartao.usado)}</span>
                        <span>Limite: {brl(cartao.limite)}</span>
                      </div>
                      <div className="h-1.5 bg-red-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct > 80 ? 'bg-red-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 text-right">{pct}% utilizado</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ÚLTIMAS TRANSAÇÕES */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs text-gray-500 uppercase tracking-widest">Últimas transações</h2>
            <a href="/extrato" className="text-xs text-red-400 hover:text-red-300 transition">
              Ver extrato completo →
            </a>
          </div>

          <div className="bg-red-900/20 border border-red-500/10 rounded-2xl overflow-hidden">
            {data.transacoes.map((tx, i) => (
              <div
                key={tx.id}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-red-500/5 transition ${
                  i !== data.transacoes.length - 1 ? 'border-b border-red-500/10' : ''
                }`}
              >
                {/* Ícone */}
                <div className="w-8 h-8 bg-red-950/60 border border-red-500/10 rounded-xl flex items-center justify-center shrink-0">
                  {txIcon(tx)}
                </div>

                {/* Descrição */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.descricao}</p>
                  <p className="text-xs text-gray-500">{tx.categoria}</p>
                </div>

                {/* Valor + tempo */}
                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-bold ${
                      tx.valor > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {tx.valor > 0 ? '+' : ''}
                    {brl(tx.valor)}
                  </p>
                  <p className="text-xs text-gray-600">{relativeTime(tx.data)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}