import React, { useState } from "react";

export default function RegisterForms() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [senha, setSenha] = useState("");

  // validar o 11 digitos do cpf
  const validarCpf = (cpf) => {
    const regex = /^[0-9]{11}$/;
    return regex.test(cpf);
  }

  const validarTelefone = (telefone) => {
    const regex = /^[0-9]{10,11}$/;
    return regex.test(telefone);
  }

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const cpfExists = users.some((user) => user.cpf === cpf);

    if (!nome || !cpf || !telefone || !senha) {
      setMensagem("Preencha todos os campos!")
      setTipoMensagem("error");
      return;
    }

    if (!validarCpf(cpf)) {
      setMensagem("CPF inválido!")
      setTipoMensagem("error");
      return;
    }

    if (!validarTelefone(telefone)) {
      setMensagem("Telefone inválido!")
      setTipoMensagem("error");
      return;
    }

    if (cpfExists) {
      setMensagem("CPF já cadastrado!")
      setTipoMensagem("error");
      return;
    }

    const newUser = { nome, cpf, telefone, senha };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setMensagem("Usuário cadastrado com sucesso!");
    setTipoMensagem("successo");

    setNome("");
    setCpf("");
    setTelefone("");
    setSenha("");
  };

  return (
    <div className="register-forms">
      <h2>Cadastro de Usuário</h2>

      <input type="text" placeholder="Nome" value={nome} onChange={(e) =>setNome(e.target.value)} />

      <input type="text" placeholder="CPF" value={cpf} onChange={(e) =>setCpf(e.target.value.replace(/\D/g, ""))}
        maxLength="11" />

      <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ""))} 
        maxLength="11" />

      <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />

      <button onClick={handleRegister}>Cadastrar</button>

      {mensagem && (<p className={`mensagem
${tipoMensagem}`}>{mensagem}</p>)}
    </div>
  );
};