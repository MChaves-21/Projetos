import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">CRAS</h3>
            <p className="text-muted-foreground">
              Centro de Referência de Assistência Social - Promovendo dignidade e cidadania.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                <span>Rua Exemplo, 123 - Centro<br />CEP: 12345-678</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>(11) 1234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>contato@cras.gov.br</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Horário de Funcionamento</h3>
            <div className="flex items-start gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
              <div>
                <p>Segunda a Sexta</p>
                <p className="font-medium text-foreground">08:00 - 17:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CRAS. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
