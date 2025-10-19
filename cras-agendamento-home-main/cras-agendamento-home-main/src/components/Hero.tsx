import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Sistema de Agendamento
            <span className="block mt-2">CRAS</span>
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/90 max-w-2xl mx-auto sm:text-xl">
            Agende seus atendimentos no Centro de Referência de Assistência Social de forma rápida, fácil e segura.
          </p>
          
          <div className="mt-10 flex justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/cadastro")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Atendimento
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Fácil e Rápido</h3>
              <p className="mt-2 text-sm text-white/80">Agende em poucos cliques</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">24/7 Disponível</h3>
              <p className="mt-2 text-sm text-white/80">Agende a qualquer hora</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Atendimento Humanizado</h3>
              <p className="mt-2 text-sm text-white/80">Profissionais qualificados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
