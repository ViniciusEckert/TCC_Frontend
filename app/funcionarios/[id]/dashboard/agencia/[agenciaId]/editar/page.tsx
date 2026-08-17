"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Loader2,
} from "lucide-react";

import {
  useRouter,
  useParams,
} from "next/navigation";

import {
  getAgenciaParaEdicao,
  updateAgencia,
} from "./actions";

export default function EditarAgenciaPage() {
  const router = useRouter();
  const params = useParams();

  // =========================================================
  // IDS DA ROTA
  // =========================================================

  const funcionarioId =
    params.id as string;

  const agenciaId =
    params.agenciaId as string;

  // =========================================================
  // ESTADOS
  // =========================================================

  const [carregando, setCarregando] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // =========================================================
  // FORMULÁRIO
  // =========================================================

  const [form, setForm] = useState({
    nome: "",
    numero: "",
    endereco: "",
  });

  // =========================================================
  // CARREGAR AGÊNCIA
  // =========================================================

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        setError(null);

        const agencia =
          await getAgenciaParaEdicao(
            Number(agenciaId),
          );

        setForm({
          nome: agencia.nome ?? "",
          numero: agencia.numero ?? "",
          endereco: agencia.endereco ?? "",
        });
      } catch (err) {
        console.error(
          "[EDITAR AGENCIA] Erro ao carregar:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar agência.",
        );
      } finally {
        setCarregando(false);
      }
    };

    if (agenciaId) {
      carregar();
    }
  }, [agenciaId]);

  // =========================================================
  // VALIDAÇÃO
  // =========================================================

  function validateForm() {
    if (!form.nome.trim()) {
      return "Preencha o nome da agência.";
    }

    if (!form.numero.trim()) {
      return "Preencha o número da agência.";
    }

    if (!form.endereco.trim()) {
      return "Preencha o endereço da agência.";
    }

    return null;
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    setError(null);

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result =
        await updateAgencia(
          Number(agenciaId),
          {
            nome: form.nome.trim(),
            numero: form.numero.trim(),
            endereco: form.endereco.trim(),
          },
        );

      if (!result.success) {
        setError(
          result.message ??
            "Erro ao atualizar agência. Tente novamente.",
        );

        return;
      }

      // Volta para o dashboard do funcionário
      router.push(
        `/funcionarios/${funcionarioId}/dashboard`,
      );
    } catch (err) {
      console.error(
        "[EDITAR AGENCIA] Erro no submit:",
        err,
      );

      setError(
        "Serviço indisponível. Tente novamente em instantes.",
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // CARREGANDO
  // =========================================================

  if (carregando) {
    return (
      <div className="w-full max-w-2xl mx-auto flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
      </div>
    );
  }

  // =========================================================
  // PÁGINA
  // =========================================================

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

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
            <Building2 className="text-red-400 w-5 h-5" />
          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">
              Editar Agência
            </h1>

            <p className="text-gray-400 text-sm">
              Atualize os dados da agência
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          CARD
      ===================================================== */}

      <div className="bg-red-900/20 border border-red-500/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >

          {/* =================================================
              NOME
          ================================================= */}

          <div className="space-y-1.5">

            <label
              htmlFor="nome"
              className="block text-sm text-gray-300"
            >
              Nome da Agência
            </label>

            <input
              id="nome"
              type="text"
              autoComplete="organization"
              placeholder="Digite o nome da agência"
              value={form.nome}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  nome: e.target.value,
                }))
              }
              disabled={loading}
              className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
            />

          </div>

          {/* =================================================
              NÚMERO
          ================================================= */}

          <div className="space-y-1.5">

            <label
              htmlFor="numero"
              className="block text-sm text-gray-300"
            >
              Número da Agência
            </label>

            <input
              id="numero"
              type="text"
              inputMode="numeric"
              placeholder="Digite o número da agência"
              value={form.numero}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  numero: e.target.value,
                }))
              }
              disabled={loading}
              className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
            />

          </div>

          {/* =================================================
              ENDEREÇO
          ================================================= */}

          <div className="space-y-1.5">

            <label
              htmlFor="endereco"
              className="block text-sm text-gray-300"
            >
              Endereço
            </label>

            <input
              id="endereco"
              type="text"
              autoComplete="street-address"
              placeholder="Digite o endereço da agência"
              value={form.endereco}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  endereco: e.target.value,
                }))
              }
              disabled={loading}
              className="w-full px-4 py-3 bg-red-950/60 border border-red-500/20 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/40 transition disabled:opacity-50"
            />

          </div>

          {/* =================================================
              ERRO
          ================================================= */}

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">

              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />

              <span>
                {error}
              </span>

            </div>
          )}

          {/* =================================================
              AÇÕES
          ================================================= */}

          <div className="flex items-center gap-3 pt-1">

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 bg-linear-to-r from-red-500 to-red-700 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-red-500/30 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Salvando...
                </>
              ) : (
                <>
                  <Building2 size={18} />

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