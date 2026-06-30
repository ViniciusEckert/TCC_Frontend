
import { Cliente} from "../../../interfaces/clientes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCliente(id: number) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  const response = await fetch(`http://localhost:8080/clientes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ["pegar dados"] },
  });

  if (response.status === 401) {
    redirect("/login");
  }

  try {
    const data = await response.json();
    return data as Cliente;
  } catch (e) {
    console.error(e);
    return {} as Cliente;
  }
}