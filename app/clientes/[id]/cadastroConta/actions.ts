"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

 interface CreateConta {
  id: string;
  senha: string;
  tipo_conta: 'CORRENTE' | 'POUPANÇA' | 'UNIVERSITARIA' | 'SALARIO'
  saldo: number;
  data_abertura: Date
}


export async function createCliente(cliente: CreateConta){


    const response = await fetch("http://localhost:8080/contas", {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente)
    })

    const data = await response.json();
    if(response.status === 201){
        revalidateTag("listar", "max")
        return;
    }

    if (response.status === 401){
        redirect("/login")
    }
    return data
}