import { useState } from 'react'
import TutoringCard from '@/components/tutoring/TutoringCard'
import BecomeATutorDialog from '@/components/application/BecomeATutorDialog'
import ApplyAsTutorDialog from '@/components/application/ApplyAsTutorDialog'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import mathTutoringImage from '@/assets/math-tutoring.jpg'
import { useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * This function fetches approved tutorings with associated profiles from a database using Supabase in a TypeScript React application.
 * @returns The function `fetchTutorings` is returning the data of approved tutorings with the associated profiles' full names, ordered by the
 * creation date in descending order. If there is an error during the fetch operation, it will throw the error. If there is no data returned,
 * it will return an empty array.
 */
const fetchTutorings = async () => {
  const { data, error } = await supabase
    .from('tutorings')
    .select('*, profiles(full_name)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Component that displays a list of available tutoring sessions.
 * Allows users to search for tutoring sessions by title, tutor name, or topic.
 * Also provides options for users to become tutors or create new sessions if they are already approved.
 *
 * @returns {JSX.Element} The tutoring page component.
 */
const Tutoring = () => {
  const { isApprovedTutor, user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const {
    data: tutorings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tutorings'],
    queryFn: fetchTutorings,
  })

  const filteredTutorings = tutorings.filter((tutoring) => {
    const query = searchQuery.toLowerCase()
    const tutorName = (tutoring.profiles as any)?.full_name || ''

    return (
      tutoring.title.toLowerCase().includes(query) ||
      tutorName.toLowerCase().includes(query) ||
      tutoring.topics.some((topic: string) =>
        topic.toLowerCase().includes(query),
      )
    )
  })

  if (isError) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-red-500'>
          Error al cargar las tutorías: {error.message}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='mb-8'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-4xl font-bold text-primary mb-2'>
              Tutoría Entre Estudiantes
            </h1>
            <p className='text-muted-foreground text-lg'>
              Encuentra el apoyo académico que necesitas o comparte tu
              conocimiento
            </p>
          </div>
          <div className='flex gap-3'>
            {user &&
              (isApprovedTutor ? (
                <BecomeATutorDialog />
              ) : (
                <ApplyAsTutorDialog />
              ))}
          </div>
        </div>

        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
          <Input
            placeholder='Buscar tutorías por tema, materia o tutor...'
            className='pl-10 bg-card shadow-sm border-border'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>Cargando tutorías...</p>
        </div>
      ) : filteredTutorings.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>
            {searchQuery
              ? 'No se encontraron tutorías que coincidan con tu búsqueda'
              : 'No hay tutorías disponibles en este momento'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredTutorings.map((tutoring) => (
            <TutoringCard
              key={tutoring.id}
              id={tutoring.id}
              title={tutoring.title}
              tutor={
                (tutoring.profiles as any)?.full_name || 'Tutor no encontrado'
              }
              schedule={tutoring.schedule}
              room={tutoring.room}
              availableSpots={tutoring.available_spots}
              totalSpots={tutoring.total_spots}
              price={tutoring.price}
              materials={tutoring.materials}
              topics={tutoring.topics}
              rating={5}
              image={mathTutoringImage}
              userId={tutoring.user_id}
              onEnrollment={() =>
                queryClient.invalidateQueries({ queryKey: ['tutorings'] })
              }
              date={tutoring.date}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Tutoring
