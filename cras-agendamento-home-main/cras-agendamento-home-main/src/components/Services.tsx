import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, GraduationCap, Briefcase, Home, Baby, Users } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Assistência Social",
    description: "Orientação e encaminhamento para serviços de assistência social.",
  },
  {
    icon: GraduationCap,
    title: "Educação",
    description: "Apoio educacional e inscrição em programas de capacitação.",
  },
  {
    icon: Briefcase,
    title: "Trabalho e Renda",
    description: "Orientação profissional e encaminhamento para oportunidades.",
  },
  {
    icon: Home,
    title: "Habitação",
    description: "Informações sobre programas habitacionais e moradia.",
  },
  {
    icon: Baby,
    title: "Criança e Adolescente",
    description: "Proteção e promoção dos direitos de crianças e adolescentes.",
  },
  {
    icon: Users,
    title: "Família",
    description: "Fortalecimento de vínculos familiares e comunitários.",
  },
];

const Services = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Serviços Disponíveis
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça os principais serviços oferecidos pelo CRAS
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group hover:shadow-[var(--shadow-medium)] transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-accent/5"
            >
              <CardHeader>
                <div className="rounded-lg bg-accent/50 p-3 w-fit mb-3 group-hover:bg-primary/10 transition-colors duration-300">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
