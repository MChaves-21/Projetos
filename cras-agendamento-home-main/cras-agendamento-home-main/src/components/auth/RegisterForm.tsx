import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function RegisterForm() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const { toast } = useToast();

  const validarCpf = (cpf: string) => {
    const regex = /^[0-9]{11}$/;
    return regex.test(cpf);
  };

  const validarTelefone = (telefone: string) => {
    const regex = /^[0-9]{10,11}$/;
    return regex.test(telefone);
  };

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const cpfExists = users.some((user: any) => user.cpf === cpf);

    if (!nome || !cpf || !telefone || !senha) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos!",
        variant: "destructive",
      });
      return;
    }

    if (!validarCpf(cpf)) {
      toast({
        title: "Erro",
        description: "CPF inválido!",
        variant: "destructive",
      });
      return;
    }

    if (!validarTelefone(telefone)) {
      toast({
        title: "Erro",
        description: "Telefone inválido!",
        variant: "destructive",
      });
      return;
    }

    if (cpfExists) {
      toast({
        title: "Erro",
        description: "CPF já cadastrado!",
        variant: "destructive",
      });
      return;
    }

    const newUser = { nome, cpf, telefone, senha };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    toast({
      title: "Sucesso!",
      description: "Usuário cadastrado com sucesso!",
    });

    setNome("");
    setCpf("");
    setTelefone("");
    setSenha("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-primary">Cadastro de Usuário</h2>

      <Input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <Input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
        maxLength={11}
      />

      <Input
        type="text"
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ""))}
        maxLength={11}
      />

      <Input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <Button onClick={handleRegister} className="w-full">
        Cadastrar
      </Button>
    </div>
  );
}
