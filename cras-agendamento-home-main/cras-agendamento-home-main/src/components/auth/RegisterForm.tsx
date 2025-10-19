import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function RegisterForm() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState(""); // NOVO ESTADO
  const { toast } = useToast();

  // --- FUNÇÕES DE MÁSCARA ---

  // Formata o CPF para 000.000.000-00
  const formatCpf = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .substring(0, 14);
  };

  // Formata o Telefone para (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  const formatTelefone = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length > 10) {
      return numericValue
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .substring(0, 15);
    }

    return numericValue
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 14);
  };


  // --- FUNÇÕES DE VALIDAÇÃO ---

  // A validação agora espera o CPF limpo (apenas dígitos)
  const validarCpf = (cpfLimpo: string) => {
    const regex = /^[0-9]{11}$/;
    return regex.test(cpfLimpo);
  };

  // A validação agora espera o telefone limpo (apenas dígitos)
  const validarTelefone = (telefoneLimpo: string) => {
    const regex = /^[0-9]{10,11}$/;
    return regex.test(telefoneLimpo);
  };


  const handleRegister = () => {
    // Limpa CPF e Telefone para validação e armazenamento
    const cleanCpf = cpf.replace(/\D/g, "");
    const cleanTelefone = telefone.replace(/\D/g, "");

    // 1. Validação de Campos Vazios e Senha
    if (!nome || !cleanCpf || !cleanTelefone || !senha || !confirmarSenha) { // Inclui confirmarSenha
      toast({
        title: "Erro",
        description: "Preencha todos os campos!",
        variant: "destructive",
      });
      return;
    }

    // 2. Validação de Senhas Coincidentes
    if (senha !== confirmarSenha) {
      toast({
        title: "Erro",
        description: "A senha e a confirmação de senha não coincidem!",
        variant: "destructive",
      });
      return;
    }

    // 3. Validação de Força da Senha (Mínimo de 6 caracteres)
    if (senha.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter no mínimo 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // 4. Validação de Formato (usando os valores limpos)
    if (!validarCpf(cleanCpf)) {
      toast({
        title: "Erro",
        description: "CPF inválido! (Apenas 11 dígitos).",
        variant: "destructive",
      });
      return;
    }

    if (!validarTelefone(cleanTelefone)) {
      toast({
        title: "Erro",
        description: "Telefone inválido! Use 10 ou 11 dígitos.",
        variant: "destructive",
      });
      return;
    }

    // 5. Validação de Usuário Existente
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const cpfExists = users.some((user: any) => user.cpf === cleanCpf); // Usa cleanCpf para comparação

    if (cpfExists) {
      toast({
        title: "Erro",
        description: "CPF já cadastrado!",
        variant: "destructive",
      });
      return;
    }

    // --- SUCESSO ---
    // Armazena os valores limpos (sem máscara)
    const newUser = { nome, cpf: cleanCpf, telefone: cleanTelefone, senha };
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
    setConfirmarSenha(""); // Limpa o novo campo
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-primary">Cadastro de Usuário</h2>

      {/* Nome */}
      <Input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      {/* CPF - COM MÁSCARA */}
      <Input
        type="text"
        placeholder="CPF (000.000.000-00)"
        value={cpf}
        onChange={(e) => setCpf(formatCpf(e.target.value))} // Aplica a máscara
        maxLength={14} // Limite da máscara
      />

      {/* Telefone - COM MÁSCARA */}
      <Input
        type="text"
        placeholder="Telefone ((00) 00000-0000)"
        value={telefone}
        onChange={(e) => setTelefone(formatTelefone(e.target.value))} // Aplica a máscara
        maxLength={15} // Limite da máscara
      />

      {/* Senha */}
      <Input
        type="password"
        placeholder="Senha (mínimo 6 caracteres)"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      {/* Confirmação de Senha (NOVO CAMPO) */}
      <Input
        type="password"
        placeholder="Confirmar Senha"
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
      />


      <Button onClick={handleRegister} className="w-full">
        Cadastrar
      </Button>
    </div>
  );
}
