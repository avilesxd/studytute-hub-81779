import { Menu, Search, Bell, Calendar, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Header = () => {
  const { user, isDirector } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
    } else {
      toast.success("Sesión cerrada");
      navigate("/");
    }
  };

  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">UA</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block">Universidad Arica</span>
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
            {user ? (
              <span className="text-primary-foreground/90">
                {user.user_metadata?.name || user.email}
              </span>
            ) : (
              <a href="#" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
                Mi cuenta
              </a>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isDirector && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10 gap-2"
                onClick={() => navigate("/director")}
              >
                <Shield className="h-5 w-5" />
                <span className="hidden sm:inline">Panel Director</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Calendar className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Bell className="h-5 w-5" />
            </Button>
            {user ? (
              <>
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center ml-2">
                  <span className="text-primary-foreground font-semibold">
                    {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="ml-2"
                onClick={() => navigate("/auth")}
              >
                Ingresar
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
