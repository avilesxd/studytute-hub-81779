import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Layout from '@/components/layout/Layout'
import Index from './pages/Index'
import Tutoring from './pages/tutoring/Tutoring'
import Auth from './pages/auth/Auth'
import DirectorPanel from './pages/director/DirectorPanel'
import NotFound from './pages/NotFound'
import TermsOfService from './pages/legal/TermsOfService'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'

const queryClient = new QueryClient()

/**
 * The App component sets up the routing for different pages in a React application with various layouts and providers.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path='/'
              element={
                <Layout>
                  <Index />
                </Layout>
              }
            />
            <Route
              path='/tutorias'
              element={
                <Layout>
                  <Tutoring />
                </Layout>
              }
            />
            <Route
              path='/director'
              element={
                <Layout>
                  <DirectorPanel />
                </Layout>
              }
            />
            <Route
              path='/terminos-de-servicio'
              element={
                <Layout>
                  <TermsOfService />
                </Layout>
              }
            />
            <Route
              path='/politica-de-privacidad'
              element={
                <Layout>
                  <PrivacyPolicy />
                </Layout>
              }
            />

            {/* Routes without Layout */}
            <Route path='/auth' element={<Auth />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
