import React, { useState } from "react";
import RegisterForms from "../components/registerForms";
import LoginForms from "../components/loginForms";
import "../styles/AuthPages.css";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-container">
      {/* Abas de alternância */}
      <div className="auth-tabs">
        <button
          className={activeTab === "login" ? "active" : ""}
          onClick={() => setActiveTab("login")}
        >
          Entrar
        </button>
        <button
          className={activeTab === "register" ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          Cadastrar
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="auth-content">
        {activeTab === "login" ? <LoginForms /> : <RegisterForms />}
      </div>
    </div>
  );
}
