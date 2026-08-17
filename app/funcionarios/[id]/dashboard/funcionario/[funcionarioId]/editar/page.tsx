'use client';

import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, UserCog, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getFuncionarioParaEdicao, updateFuncionario } from './actions';

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const params = useParams();
  const funcionarioId = params.id as string;
  const funcionarioEditadoId = params.funcionarioId as string;

  const [carregando, setCarregando] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nome: '',
    email: '',
    admin: false,
    senha: '', // vazio = "não alterar"
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const funcionario = await getFuncionarioParaEdicao(Number(funcionarioEditadoId));

        setForm({
          nome: funcionario.nome ?? '',
          email: funcionario.email ?? '',
          admin: funcionario.admin ?? false,
          senha: '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar funcionário.');
      } finally {
        setCarregando(false);
      }
    };

    if (funcionarioEditadoId) carregar();
  }, [funcionarioEditadoId]);

  function validateForm() {
    if (!form.nome.trim()) return 'Preencha o nome completo.';
    if (!form.email.trim()) return 'Preencha o email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email inválido.';
    if (form.senha && form.senha.length < 6)
      return 'Nova senha deve ter no mínimo 6 caracteres.';
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await updateFuncionario(Number(funcionarioEditadoId), {
        nome: form.nome.trim(),
        email: form.email.trim(),
        admin: form.admin,
        senha: form.senha || undefined,
      });

      if (!result.success) {
        setError(result.message ?? 'Erro ao atualizar funcionário. Tente novamente.');
        return;
      }

      router.push(`/funcionarios/${funcionarioId}/dashboard`);
    } catch {
      setError('Serviço indisponível. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  }

  if (carregando) {
    return (
      <div className="w-full max-w-2xl mx-auto flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-2 transition"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center shrink-0">
            <UserCog className="text-red-400 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Editar Funcionário</h1>
            <p className="text-gray-400 text-sm">Atualize os dados do funcionário</p>
          </div>
        </div>
      </div>

      {/* CARD */}
      <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* NOME */}
          <div className="space-y-1.5">
            <label htmlFor="nome" className="block text-sm text-gray-300">
              Nome Completo
            </label>
            <input
              id="nome"
              type="text"
              autoComplete="name"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              disabled={loading}
              className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              disabled={loading}
              className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
            />
          </div>

          {/* ADMIN */}
          <div className="space-y-1.5">
            <span className="block text-sm text-gray-300">Permissão</span>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, admin: !f.admin }))}
              disabled={loading}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition disabled:opacity-50 ${
                form.admin
                  ? 'bg-red-500/10 border-red-500/40 text-white'
                  : 'bg-red-950/60 border-red-500/20 text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={18} className={form.admin ? 'text-red-400' : 'text-gray-500'} />
                Administrador
              </span>
              <span
                className={`w-11 h-6 rounded-full relative transition ${
                  form.admin ? 'bg-red-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    form.admin ? 'translate-x-5' : ''
                  }`}
                />
              </span>
            </button>
          </div>

          {/* NOVA SENHA (opcional) */}
          <div className="space-y-1.5">
            <label htmlFor="senha" className="block text-sm text-gray-300">
              Nova Senha{' '}
              <span className="text-gray-500 font-normal">
                (deixe em branco para manter a atual)
              </span>
            </label>
            <div className="relative">
              <input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.senha}
                onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
                disabled={loading}
                className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition pr-12 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AÇÕES */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 bg-linear-to-r from-red-500 to-red-700 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-red-500/30 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <UserCog size={18} />
                  Salvar Alterações
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-5 py-3.5 border border-red-500/20 rounded-xl text-gray-300 font-medium hover:bg-red-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}