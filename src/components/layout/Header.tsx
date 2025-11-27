import { Menu, Bell, LogOut, Shield, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CalendarSheet } from '@/components/layout/CalendarSheet'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { useApplicationsData } from '@/hooks/queries/useDirectorQueries'
import { Badge } from '@/components/ui/badge'

import {
  useNotificationsData,
} from '@/hooks/queries/useUserQueries'

const Header = () => {
  const { user, isDirector, profile } = useAuth()
  const navigate = useNavigate()
  const { applications } = useApplicationsData(isDirector, user)
  const { notifications, unreadCount, markAsRead } = useNotificationsData(user)

  const pendingApplicationsCount =
    applications?.filter((app) => app.status === 'pending').length ?? 0

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error al cerrar sesión')
    } else {
      toast.success('Sesión cerrada')
      navigate('/')
    }
  }

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const renderNavLinks = (isMobile = false) => (
    <nav
      className={`flex items-center gap-6 ${
        isMobile ? 'flex-col items-start space-y-4 text-lg' : 'hidden md:flex'
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
    </nav>
  )

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
                        onClick={() => navigate('/')}
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
                    <div className="flex items-center w-full">
                      <Button
                        variant="link"
                        className="flex-1 text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/10 gap-2"
                        onClick={() => navigate('/director')}
                      >
                        <Shield className="h-5 w-5" />
                        <span>Panel Director</span>
                      </Button>
                      {user && <CalendarSheet isMobile />}
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
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
                onClick={() => navigate('/director')}
              >
                <Shield className="h-5 w-5" />
                <span className="hidden sm:inline">Panel Director</span>
              </Button>
            )}
            {user && <CalendarSheet />}
            {user && !isDirector && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        onSelect={() => handleNotificationClick(notification)}
                        className={!notification.is_read ? 'font-bold' : ''}
                      >
                        <div className="flex flex-col">
                          <span>{notification.message}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              notification.created_at,
                            ).toLocaleString()}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No tienes notificaciones.
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {user && isDirector && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex relative"
                  >
                    <Bell className="h-5 w-5" />
                    {pendingApplicationsCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0"
                      >
                        {pendingApplicationsCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <DropdownMenuLabel>
                    Postulaciones Pendientes
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {pendingApplicationsCount > 0 ? (
                    applications
                      .filter((app) => app.status === 'pending')
                      .map((app) => (
                        <DropdownMenuItem
                          key={app.id}
                          onSelect={() => navigate('/director')}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {app.profiles?.full_name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {app.subject}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No hay postulaciones pendientes.
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate('/director')}>
                    <Button
                      variant="link"
                      className="w-full justify-center"
                    >
                      Ir al panel de director
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={profile?.avatarUrl ?? ''}
                        alt={profile?.fullName ?? ''}
                      />
                      <AvatarFallback>
                        {profile?.fullName?.charAt(0) ||
                          user.email?.charAt(0) ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/perfil')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Mi perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="ml-2"
                onClick={() => navigate('/auth')}
              >
                Ingresar
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
