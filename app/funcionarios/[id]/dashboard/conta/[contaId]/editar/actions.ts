"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { Conta } from "../../../../../../interfaces/clientes";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface UpdateConta {
  tipo_conta: "CORRENTE" | "POUPANCA" | "UNIVERSITARIA" | "SALARIO";
  pix: string;
  senha?: string;
}

export async function getContaParaEdicao(id: number): Promise<Conta> {
  const response = await fetch(`${API_URL}/conta/${id}`, {
    next: { tags: [`conta-${id}`, "listar"] },
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error(`Erro ao buscar conta (${response.status})`);
  }

  return response.json();
}

export async function updateConta(id: number, dados: UpdateConta) {
  try {
    const body: Record<string, unknown> = {
      tipo_conta: dados.tipo_conta,
      pix: dados.pix,
    };

    if (dados.senha && dados.senha.trim() !== "") {
      body.senha = dados.senha;
    }

    const response = await fetch(`${API_URL}/contas/${id}`, {
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
        message: data?.message ?? data?.error ?? "Erro ao atualizar conta.",
      };
    }

    revalidateTag("listar", "max");
    revalidateTag(`conta-${id}`, "max");

    return { success: true, data };
  } catch (error) {
    console.error("[updateConta] erro:", error);
    return { success: false, message: "Serviço indisponível. Tente novamente." };
  }
}