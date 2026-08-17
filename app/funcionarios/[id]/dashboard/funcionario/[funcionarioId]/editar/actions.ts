"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { Funcionario } from "../../../../../../interfaces/clientes";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface UpdateFuncionario {
  nome: string;
  email: string;
  admin: boolean;
  senha?: string; // opcional: só envia se digitar uma nova
}

export async function getFuncionarioParaEdicao(id: number): Promise<Funcionario> {
  const response = await fetch(`${API_URL}/funcionario/${id}`, {
    next: { tags: [`funcionario-${id}`, "listar"] },
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`Erro ao buscar funcionário (${response.status})`);
  }

  return response.json();
}

export async function updateFuncionario(id: number, dados: UpdateFuncionario) {
  try {
    const body: Record<string, unknown> = {
      nome: dados.nome,
      email: dados.email,
      admin: dados.admin,
    };

    if (dados.senha && dados.senha.trim() !== "") {
      body.senha = dados.senha;
    }

    const response = await fetch(`${API_URL}/funcionarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      redirect("/login");
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message ?? data?.error ?? "Erro ao atualizar funcionário.",
      };
    }

    revalidateTag("listar", "max");
    revalidateTag(`funcionario-${id}`, "max");

    return { success: true, data };
  } catch (error) {
    console.error("[updateFuncionario] erro:", error);
    return { success: false, message: "Serviço indisponível. Tente novamente." };
  }
}