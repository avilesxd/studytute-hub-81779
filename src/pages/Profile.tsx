import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

export default function Profile() {
  const { profile, updateProfile, user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [major, setMajor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '')
      setMajor(profile.major || '')
    }
  }, [profile])

  const handleSaveChanges = async () => {
    setIsLoading(true)
    await updateProfile({
      fullName,
      major,
    })
    setIsLoading(false)
    toast.success('Perfil actualizado correctamente')
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    const file = event.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${user?.id}.${fileExt}`
    const filePath = `${fileName}`

    setIsUploading(true)

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      toast.error('Error al subir la imagen')
      console.error(uploadError)
      setIsUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

    if (!data) {
      toast.error('Error al obtener la URL de la imagen')
      setIsUploading(false)
      return
    }

    await updateProfile({
      avatarUrl: data.publicUrl,
    })

    toast.success('Foto de perfil actualizada correctamente')
    setIsUploading(false)
  }

  return (
    <div className='flex justify-center'>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Aquí puedes ver y editar tus datos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='grid gap-6'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-20 w-20'>
                <AvatarImage
                  src={profile?.avatarUrl ?? ''}
                  alt={profile?.fullName ?? ''}
                />
                <AvatarFallback>
                  {profile?.fullName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                type='button'
                onClick={handleAvatarClick}
                disabled={isUploading}
              >
                {isUploading ? 'Subiendo...' : 'Cambiar foto'}
              </Button>
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='image/*'
                onChange={handleFileChange}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='full-name'>Nombre completo</Label>
              <Input
                id='full-name'
                placeholder='Ingresa tu nombre completo'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Correo electrónico</Label>
              <Input
                id='email'
                type='email'
                placeholder='Ingresa tu correo electrónico'
                value={user?.email || ''}
                disabled
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='major'>Carrera</Label>
              <Input
                id='major'
                placeholder='Ingresa tu carrera'
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className='border-t px-6 py-4'>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </CardFooter>
      </Card>
      .
    </div>
  )
}
