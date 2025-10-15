import { Menu, Search, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">ST</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block">Santo Tomás</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium border-b-2 border-primary-foreground pb-1">
              Inicio
            </a>
            <a href="#" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Información académica
            </a>
            <a href="#" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Comunidad
            </a>
            <a href="#" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Mi cuenta
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Calendar className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center ml-2">
              <span className="text-primary-foreground font-semibold">N</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
