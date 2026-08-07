'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Mail,
  Wallet,
  Phone,
  FileText,
  Calendar,
} from 'lucide-react';

import { buscarCliente } from '../../../[id]/dashboard/actions';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  data_nascimento: string;

  contas: {
    id: number;
    tipo_conta: string;
    saldo: number | string;
    pix?: string | null;
    data_abertura: string;
  }[];
}

export default function ClienteDetalhesPage() {
  const router = useRouter();
  const params = useParams();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const id = Number(params.id);

  useEffect(() => {
    if (Number.isNaN(id)) {
      return;
    }

    async function carregar() {
      try {
        const dados = await buscarCliente(id);
        setCliente(dados);
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        setErro('Não foi possível carregar os dados do cliente.');
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id]);

  if (Number.isNaN(id)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto p-8">

          <p className="mb-6">
            ID do cliente inválido.
          </p>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-red-300 hover:text-white"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto p-8">
          Carregando cliente...
        </div>
      </div>
    );
  }

  if (erro || !cliente) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto p-8">

          <p className="mb-6">
            {erro || 'Cliente não encontrado.'}
          </p>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-red-300 hover:text-white"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <div className="max-w-7xl mx-auto p-8">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-red-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8">

          {/* CABEÇALHO */}

          <div className="flex items-center gap-4 mb-8">

            <User
              size={40}
              className="text-red-400"
            />

            <div>

              <h1 className="text-3xl font-bold">
                {cliente.nome}
              </h1>

              <p className="text-gray-400">
                Cliente #{cliente.id}
              </p>

            </div>

          </div>

          {/* INFORMAÇÕES */}

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">

                <Mail
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Email
                </p>

              </div>

              <p>
                {cliente.email}
              </p>

            </div>

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">

                <FileText
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  CPF
                </p>

              </div>

              <p>
                {cliente.cpf}
              </p>

            </div>

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">

                <Phone
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Telefone
                </p>

              </div>

              <p>
                {cliente.telefone || 'Não informado'}
              </p>

            </div>

            <div className="bg-black/20 rounded-xl p-5">

              <div className="flex items-center gap-2 mb-2">

                <Calendar
                  size={18}
                  className="text-red-400"
                />

                <p className="text-gray-400">
                  Data de nascimento
                </p>

              </div>

              <p>
                {new Date(
                  cliente.data_nascimento
                ).toLocaleDateString('pt-BR')}
              </p>

            </div>

          </div>

          {/* CONTAS */}

          <div className="mt-10">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Wallet />
              Contas
            </h2>

            {cliente.contas.length === 0 ? (

              <p className="text-gray-400">
                Nenhuma conta vinculada.
              </p>

            ) : (

              cliente.contas.map((conta) => (

                <div
                  key={conta.id}
                  className="bg-black/20 rounded-xl p-4 mb-3"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="font-bold">
                        Conta #{conta.id}
                      </p>

                      <p className="text-gray-400">
                        {conta.tipo_conta}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-green-400">
                        R${' '}
                        {Number(
                          conta.saldo
                        ).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </p>

                      <p className="text-gray-400 text-sm">
                        {conta.pix || 'Sem PIX'}
                      </p>

                    </div>

                  </div>

                  <div className="mt-3 text-sm text-gray-400">

                    <p>
                      Abertura:{' '}
                      {new Date(
                        conta.data_abertura
                      ).toLocaleDateString('pt-BR')}
                    </p>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}