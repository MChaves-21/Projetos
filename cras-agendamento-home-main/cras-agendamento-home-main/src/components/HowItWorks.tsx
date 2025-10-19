import { CheckCircle2, Calendar, FileText, UserCheck } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "1. Cadastre-se",
    description: "Crie sua conta com seus dados pessoais de forma simples e segura.",
  },
  {
    icon: Calendar,
    title: "2. Escolha a Data",
    description: "Selecione o serviço desejado e escolha o melhor horário disponível.",
  },
  {
    icon: FileText,
    title: "3. Confirme os Dados",
    description: "Revise suas informações e confirme o agendamento.",
  },
  {
    icon: CheckCircle2,
    title: "4. Compareça",
    description: "Receba a confirmação e compareça no dia e horário marcado.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Como Funciona
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Em apenas 4 passos simples você agenda seu atendimento no CRAS
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all duration-300 h-full">
                <div className="rounded-full bg-gradient-to-br from-primary to-secondary p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
