const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground mb-4 md:mb-0">
          &copy; 1981 - {new Date().getFullYear()} Universidad Arica. Todos los
          derechos reservados.
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Términos de Servicio
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Política de Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
