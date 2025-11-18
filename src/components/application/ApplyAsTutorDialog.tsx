import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PenSquare } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/auth/AuthContext'

const subjects = [
  'Matemáticas',
  'Física',
  'Programación',
  'Cálculo',
  'Álgebra',
  'Estadística',
  'Química',
]

const ApplyAsTutorDialog = () => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    null,
  )
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [selectedAvailability, setSelectedAvailability] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!user) {
        setIsCheckingStatus(false)
        return
      }

      setIsCheckingStatus(true)
      try {
        const { data, error } = await supabase
          .from('tutor_applications')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        if (data) {
          setApplicationStatus(data.status)
        }
      } catch (error: any) {
        toast.error('Error al verificar el estado de la postulación', {
          description: error.message,
        })
      } finally {
        setIsCheckingStatus(false)
      }
    }

    checkApplicationStatus()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('Debes iniciar sesión para postular como tutor')
      navigate('/auth')
      return
    }

    if (!selectedSubject) {
      toast.error('Por favor, selecciona una materia')
      return
    }

    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const name = user?.user_metadata?.full_name ?? ''
    const email = user?.email ?? ''
    const phone = formData.get('phone') as string
    const experience = formData.get('experience') as string
    const motivation = formData.get('motivation') as string
    const availability = formData.get('availability') as string
    const time = formData.get('time') as string

    const availabilityString =
      availability && time ? `${availability}: ${time}` : availability

    try {
      const { data, error } = await supabase
        .from('tutor_applications')
        .insert({
          user_id: user.id,
          name,
          email,
          phone: phone || null,
          subject: selectedSubject,
          experience,
          motivation,
          availability: availabilityString ? [availabilityString] : null,
        })
        .select('status')
        .single()

      if (error) throw error

      if (data) {
        setApplicationStatus(data.status)
      }

      toast.success('Postulación enviada exitosamente', {
        description: 'El director revisará tu solicitud pronto.',
      })
      setOpen(false)
      setSelectedAvailability('')
      setSelectedSubject('')
      ;(e.target as HTMLFormElement).reset()
    } catch (error: any) {
      toast.error('Error al enviar la postulación', {
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (isCheckingStatus) return 'Cargando...'
    if (applicationStatus === 'pending') return 'Postulación Pendiente'
    if (applicationStatus === 'approved') return 'Postulación Aprobada'
    if (applicationStatus === 'rejected') return 'Volver a Postular'
    return 'Postular como Tutor'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='border-primary text-primary hover:bg-primary hover:text-primary-foreground'
          disabled={
            isCheckingStatus ||
            applicationStatus === 'pending' ||
            applicationStatus === 'approved'
          }
        >
          <PenSquare className='mr-2 h-5 w-5' />
          {getButtonText()}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl max-h-[95vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl text-primary'>
            Formulario de Postulación para Tutor
          </DialogTitle>
          <DialogDescription>
            Completa tus datos para postular como tutor. El director revisará tu
            solicitud a la brevedad.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6 mt-4 pr-2'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Nombre Completo *</Label>
              <Input
                id='name'
                name='name'
                placeholder='Juan Pérez'
                required
                defaultValue={user?.user_metadata?.full_name ?? ''}
                readOnly
                className='bg-gray-100'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Correo Electrónico *</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='juan@ejemplo.com'
                required
                defaultValue={user?.email ?? ''}
                readOnly
                className='bg-gray-100'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Teléfono</Label>
              <Input
                id='phone'
                name='phone'
                type='tel'
                placeholder='+56 9 1234 5678'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='subject'>Materia a Enseñar *</Label>
              <Select
                onValueChange={setSelectedSubject}
                value={selectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona una materia' />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Disponibilidad</Label>
            <RadioGroup
              name='availability'
              className='flex items-center space-x-4'
              onValueChange={setSelectedAvailability}
              value={selectedAvailability}
            >
              {['Mañana', 'Tarde', 'Noche'].map((time) => (
                <div key={time} className='flex items-center space-x-2'>
                  <RadioGroupItem value={time} id={time} />
                  <Label htmlFor={time} className='font-normal'>
                    {time}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedAvailability && (
            <div className='space-y-2'>
              <Label htmlFor='time'>
                Horario para la {selectedAvailability}
              </Label>
              <Input
                id='time'
                name='time'
                placeholder={`Ej: 10:00 - 12:00`}
                required
              />
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='experience'>Experiencia Académica y Logros *</Label>
            <Textarea
              id='experience'
              name='experience'
              placeholder='Describe tus logros académicos, cursos relevantes, proyectos destacados, etc.'
              className='min-h-28'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='motivation'>
              ¿Por qué quieres ser tutor en nuestra plataforma? *
            </Label>
            <Textarea
              id='motivation'
              name='motivation'
              placeholder='Comparte tu motivación para enseñar y cómo puedes ayudar a otros estudiantes.'
              className='min-h-28'
              required
            />
          </div>

          <div className='flex justify-end gap-4 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => {
                setOpen(false)
                setSelectedAvailability('')
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              className='bg-gradient-to-r from-primary to-secondary text-white'
              disabled={isLoading}
            >
              {isLoading ? 'Enviando Postulación...' : 'Enviar Postulación'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ApplyAsTutorDialog
