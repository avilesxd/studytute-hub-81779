import { Menu, Search, Bell, Calendar, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

  const renderNavLinks = (isMobile = false) => (
    <nav
      className={`flex items-center gap-6 ${
        isMobile ? "flex-col items-start space-y-4 text-lg" : "hidden md:flex"
      }`}
    >
      <a
        href="/"
        className="text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium"
      >
        Inicio
      </a>
      <a
        href="#"
        className="text-primary-foreground/90 hover:text-primary-foreground transition-colors"
      >
        Información académica
      </a>
      <a
        href="#"
        className="text-primary-foreground/90 hover:text-primary-foreground transition-colors"
      >
        Comunidad
      </a>
      {user ? (
        <span className="text-primary-foreground/90">
          {user.user_metadata?.name || user.email}
        </span>
      ) : (
        <a
          href="#"
          className="text-primary-foreground/90 hover:text-primary-foreground transition-colors"
        >
          Mi cuenta
        </a>
      )}
    </nav>
  );

  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-primary text-primary-foreground border-r-0"
                >
                  <SheetHeader>
                    <SheetTitle>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate("/")}
                      >
                        <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-lg">
                            UA
                          </span>
                        </div>
                        <span className="font-semibold text-lg text-white">
                          Universidad Arica
                        </span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="py-8">{renderNavLinks(true)}</div>
                  {isDirector && (
                    <Button
                      variant="outline"
                      className="w-full text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/10 gap-2"
                      onClick={() => navigate("/director")}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Panel Director</span>
                    </Button>
                  )}
                </SheetContent>
              </Sheet>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">UA</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block">
                Universidad Arica
              </span>
            </div>
          </div>

          {renderNavLinks()}

          <div className="flex items-center gap-2">
            {isDirector && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10 gap-2 hidden sm:flex"
                onClick={() => navigate("/director")}
              >
                <Shield className="h-5 w-5" />
                <span className="hidden sm:inline">Panel Director</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex"
            >
              <Calendar className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex"
            >
              <Bell className="h-5 w-5" />
            </Button>
            {user ? (
              <>
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center ml-2">
                  <span className="text-primary-foreground font-semibold">
                    {user.user_metadata?.name?.charAt(0) ||
                      user.email?.charAt(0) ||
                      "U"}
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
