"use server";

import { cookies } from "next/headers";
import { Prisma } from "../../../generated/prisma";

const API_URL = "http://localhost:8080";

async function api<T = unknown>(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
  }
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

/* ===================================================
                    CLIENTES
=================================================== */

export async function listarClientes() {
  return api("/clientes");
}

export async function buscarCliente(id: number) {
  return api(`/clientes/${id}`);
}

export async function atualizarCliente(
  id: number,
  data: Prisma.ClienteUpdateInput
) {
  return api(`/clientes/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function excluirCliente(id: number) {
  return api(`/clientes/${id}`, {
    method: "DELETE",
  });
}

/* ===================================================
                 FUNCIONÁRIOS
=================================================== */

export async function listarFuncionarios() {
  return api("/funcionarios");
}

export async function buscarFuncionario(id: number) {
  return api(`/funcionarios/${id}`);
}

export async function cadastrarFuncionario(
  data: Prisma.FuncionarioCreateInput
) {
  return api("/funcionarios", {
    method: "POST",
    body: data,
  });
}

export async function atualizarFuncionario(
  id: number,
  data: Prisma.FuncionarioUpdateInput
) {
  return api(`/funcionarios/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function excluirFuncionario(id: number) {
  return api(`/funcionarios/${id}`, {
    method: "DELETE",
  });
}

