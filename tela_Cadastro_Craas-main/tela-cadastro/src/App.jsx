import React from "react";
import AuthPage from "./pages/AuthPages"; 
import "./styles/App.css";
import logoPrefeitura from "../public/prefeitura-de-fortaleza-seeklogo.png";

export default function App() {
  return (
    <div className="Principal">
      <div className="Header">
          <img src={logoPrefeitura} alt="Prefeitura de Fortaleza" className="logo-prefeitura" />
        <h1 className="Text-Primary">Bem-vindo ao Sistema CRAS</h1>
      </div>

      <div className="auth-pages">
        <AuthPage /> {/* nome correto */}
      </div>
    </div>
  );
}
