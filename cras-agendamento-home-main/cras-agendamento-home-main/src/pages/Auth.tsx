import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      {/* CONTAINER GERAL para empilhar o Logo e a Caixa */}
      <div className="w-full max-w-md flex flex-col items-center">

        {/* LOGO ADICIONADO AQUI */}
        <div className="mb-8 w-4/5 max-w-[250px]">
          <img
            // CAMINHO AJUSTADO PARA O NOVO NOME DO ARQUIVO
            src="/prefeitura.png"
            alt="Prefeitura de Fortaleza Logo"
            className="w-full h-auto"
          />
        </div>
        {/* FIM DO LOGO */}

        {/* CONTAINER BRANCO DE LOGIN/CADASTRO */}
        <div className="w-full bg-background rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 font-semibold transition-all ${activeTab === "login"
                ? "bg-background text-primary border-b-2 border-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              onClick={() => setActiveTab("login")}
            >
              Entrar
            </button>
            <button
              className={`flex-1 py-4 font-semibold transition-all ${activeTab === "register"
                ? "bg-background text-primary border-b-2 border-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              onClick={() => setActiveTab("register")}
            >
              Cadastrar
            </button>
          </div>

          <div className="p-6">
            {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
        {/* FIM DO CONTAINER BRANCO */}
      </div>
    </div>
  );
}