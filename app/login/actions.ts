"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(cpf: string, password: string) {
  let tipo: "cliente" | "funcionario" | null = null;
  let accessToken: string | null = null;

  try {
    let response = await fetch("http://localhost:8080/funcionarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cpf,
        senha: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      tipo = "funcionario";
      accessToken = data.access_token;
    } else {
      response = await fetch("http://localhost:8080/clientes/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cpf,
          senha: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        tipo = "cliente";
        accessToken = data.access_token;
      }
    }
  } catch (error) {
    console.error("Erro no login:", error);

    return {
      success: false,
      message: "Erro interno do servidor.",
    };
  }

  if (!tipo || !accessToken) {
    return {
      success: false,
      message: "CPF ou senha inválidos.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken);
  cookieStore.set("user_type", tipo);

  if (tipo === "funcionario") {
    redirect("/dashboard/funcionario");
  }

  redirect("/dashboard/cliente");
}