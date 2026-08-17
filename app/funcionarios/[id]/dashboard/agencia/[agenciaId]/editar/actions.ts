"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080";

// =========================================================
// TIPOS
// =========================================================

interface Agencia {
  id: number;
  nome: string;
  numero: string;
  endereco: string;
}

interface UpdateAgencia {
  nome: string;
  numero: string;
  endereco: string;
}

// =========================================================
// BUSCAR AGÊNCIA PARA EDIÇÃO
// =========================================================

export async function getAgenciaParaEdicao(
  id: number,
): Promise<Agencia> {
  try {
    const response = await fetch(
      `${API_URL}/agencia/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          tags: [`agencia-${id}`, "listar"],
        },
      },
    );

    if (response.status === 401) {
      redirect("/login");
    }

    if (!response.ok) {
      const texto = await response.text();

      console.error(
        "[getAgenciaParaEdicao] Erro:",
        response.status,
        texto,
      );

      throw new Error(
        `Erro ao buscar agência (${response.status})`,
      );
    }

    const agencia =
      (await response.json()) as Agencia;

    console.log(
      "=================================",
    );
    console.log(
      "[AGENCIA] AGÊNCIA PARA EDIÇÃO",
    );
    console.log("ID:", id);
    console.log("NOME:", agencia.nome);
    console.log("NÚMERO:", agencia.numero);
    console.log("ENDEREÇO:", agencia.endereco);
    console.log(
      "=================================",
    );

    return agencia;
  } catch (error) {
    console.error(
      "[getAgenciaParaEdicao] erro:",
      error,
    );

    throw new Error(
      "Erro ao carregar os dados da agência.",
    );
  }
}

// =========================================================
// ATUALIZAR AGÊNCIA
// =========================================================

export async function updateAgencia(
  id: number,
  dados: UpdateAgencia,
) {
  try {
    const body = {
      nome: dados.nome,
      numero: dados.numero,
      endereco: dados.endereco,
    };

    console.log(
      "=================================",
    );
    console.log(
      "[AGENCIA] ATUALIZANDO AGÊNCIA",
    );
    console.log("ID:", id);
    console.log("BODY:", body);
    console.log(
      "URL:",
      `${API_URL}/agencias/${id}`,
    );
    console.log(
      "=================================",
    );

    const response = await fetch(
      `${API_URL}/agencias/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      },
    );

    if (response.status === 401) {
      redirect("/login");
    }

    const data =
      await response.json().catch(() => null);

    console.log(
      "[AGENCIA] STATUS ATUALIZAÇÃO:",
      response.status,
    );

    console.log(
      "[AGENCIA] RESPOSTA:",
      data,
    );

    if (!response.ok) {
      return {
        success: false,
        message:
          data?.message ??
          data?.error ??
          "Erro ao atualizar agência.",
      };
    }

    // =====================================================
    // ATUALIZA O CACHE
    // =====================================================

    revalidateTag("listar", "max");
    revalidateTag(`agencia-${id}`, "max");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(
      "[updateAgencia] erro:",
      error,
    );

    return {
      success: false,
      message:
        "Serviço indisponível. Tente novamente.",
    };
  }
}