import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const { toast } = useToast();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userFound = users.find(
      (user: any) => user.cpf === cpf && user.senha === senha
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

      <Input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
      />

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
