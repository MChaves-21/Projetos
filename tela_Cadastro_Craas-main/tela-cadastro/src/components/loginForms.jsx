import React, { useState } from "react";

export default function LoginForms() {
// estados para armazenar o CPF e senha digitados
const [cpf, setCpf] = useState("");
const [senha, setSenha] = useState("");
const [mensagem, setMensagem] = useState("");
const [tipoMensagem, setTipoMensagem] = useState("");

// função para verificar login
const handleLogin = () => {
const users = JSON.parse(localStorage.getItem("users")) || [];

// procura o usuário pelo cpf e senha
const userFound = users.find(
(user) => user.cpf === cpf && user.senha === senha
);

if (userFound) {
setMensagem(` Bem-vindo, ${userFound.nome}!`);

setTipoMensagem("successo");
// aqui ira redirecionar o token de login
} else {
setMensagem(" CPF ou senha incorretos!");
setTipoMensagem("error");
}

// limpa os campos
setCpf("");
setSenha("");
};

return (
<div className="login-forms">
<h2>Login no Sistema</h2>

<input
type="text"
placeholder="CPF"
value={cpf}
onChange={(e) => setCpf(e.target.value)}
/>

<input
type="password"
placeholder="Senha"
value={senha}
onChange={(e) => setSenha(e.target.value)}

/>

<button onClick={handleLogin}>Entrar</button>

{mensagem && <p className={`mensagem ${tipoMensagem}`}>{mensagem}</p>}
</div>
);
};