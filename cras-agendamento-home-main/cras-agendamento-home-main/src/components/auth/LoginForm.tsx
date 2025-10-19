import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const { toast } = useToast();

  // --- FUNÇÃO DE MÁSCARA ---

  // Formata o CPF para 000.000.000-00
  const formatCpf = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .substring(0, 14); // Limite da máscara
  };


  const handleLogin = () => {
    // 1. Limpa o CPF digitado no formulário (remove a máscara)
    const cleanCpf = cpf.replace(/\D/g, "");

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // 2. Procura o usuário usando o CPF limpo (sem a máscara)
    const userFound = users.find(
      (user: any) => user.cpf === cleanCpf && user.senha === senha
    );

    if (userFound) {
      toast({
        title: "Sucesso!",
        description: `Bem-vindo, ${userFound.nome}!`,
      });
    } else {
      toast({
        title: "Erro",
        description: "CPF ou senha incorretos!",
        variant: "destructive",
      });
    }

    setCpf("");
    setSenha("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-primary">Login no Sistema</h2>

      {/* CPF - COM MÁSCARA */}
      <Input
        type="text"
        placeholder="CPF (000.000.000-00)"
        value={cpf}
        onChange={(e) => setCpf(formatCpf(e.target.value))} // Aplica a máscara
        maxLength={14} // Limite da máscara
      />

      {/* Senha */}
      <Input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <Button onClick={handleLogin} className="w-full">
        Entrar
      </Button>
    </div>
  );
}