import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import {
  useTutoringsData,
  useApplicationsData,
} from '@/hooks/useDirectorQueries'
import {
  type TutoringWithProfile,
  type TutorApplicationWithProfile,
} from '@/lib/api'
import { TutoringReviewCard } from '@/components/reviews/TutoringReviewCard'
import { ApplicationReviewCard } from '@/components/application/ApplicationReviewCard'
import { ReviewSection } from '@/components/reviews/ReviewSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DirectorPanel = () => {
  const navigate = useNavigate()
  const { isDirector, isLoading: authLoading, user } = useAuth()

  const {
    tutorings,
    isLoading: tutoringsLoading,
    isError: tutoringsError,
    error: tutoringsErrorMsg,
    updateStatus: updateTutoringStatus,
    delete: deleteTutoring,
  } = useTutoringsData(isDirector, user)

  const {
    applications,
    isLoading: applicationsLoading,
    isError: applicationsError,
    error: applicationsErrorMsg,
    updateStatus: updateApplicationStatus,
    delete: deleteApplication,
  } = useApplicationsData(isDirector, user)

  // Authorization Effect
  if (!authLoading && !isDirector) {
    toast.error('No tienes permisos para acceder a esta página')
    navigate('/')
  }

  // Memoized data filtering
  const pendingTutorings = useMemo(
    () => tutorings.filter((t) => t.status === 'pending'),
    [tutorings],
  )
  const approvedTutorings = useMemo(
    () => tutorings.filter((t) => t.status === 'approved'),
    [tutorings],
  )
  const rejectedTutorings = useMemo(
    () => tutorings.filter((t) => t.status === 'rejected'),
    [tutorings],
  )

  const pendingApplications = useMemo(
    () => applications.filter((a) => a.status === 'pending'),
    [applications],
  )
  const approvedApplications = useMemo(
    () => applications.filter((a) => a.status === 'approved'),
    [applications],
  )
  const rejectedApplications = useMemo(
    () => applications.filter((a) => a.status === 'rejected'),
    [applications],
  )

  if (authLoading || tutoringsLoading || applicationsLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <p className='text-center text-muted-foreground'>Cargando...</p>
      </div>
    )
  }

  if (tutoringsError || applicationsError) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-red-500'>
          Error al cargar los datos:{' '}
          {tutoringsErrorMsg?.message || applicationsErrorMsg?.message}
        </p>
      </div>
    )
  }

  return (
    <>
      <h1 className='text-4xl font-bold text-primary mb-8'>
        Panel del Director
      </h1>

      <Tabs defaultValue='tutorings'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='tutorings'>Tutorías</TabsTrigger>
          <TabsTrigger value='applications'>Postulaciones</TabsTrigger>
        </TabsList>
        <TabsContent value='tutorings'>
          <div className='space-y-8 mt-6'>
            <ReviewSection
              title={`Tutorías Pendientes (${pendingTutorings.length})`}
              items={pendingTutorings}
              emptyMessage='No hay tutorías pendientes de aprobación'
              renderItem={(tutoring: TutoringWithProfile) => (
                <TutoringReviewCard
                  key={tutoring.id}
                  tutoring={tutoring}
                  updateStatusMutation={updateTutoringStatus}
                  deleteMutation={deleteTutoring}
                />
              )}
            />
            <ReviewSection
              title={`Tutorías Aprobadas (${approvedTutorings.length})`}
              items={approvedTutorings}
              emptyMessage='No hay tutorías aprobadas'
              renderItem={(tutoring: TutoringWithProfile) => (
                <TutoringReviewCard
                  key={tutoring.id}
                  tutoring={tutoring}
                  updateStatusMutation={updateTutoringStatus}
                  deleteMutation={deleteTutoring}
                />
              )}
            />
            <ReviewSection
              title={`Tutorías Rechazadas (${rejectedTutorings.length})`}
              items={rejectedTutorings}
              emptyMessage='No hay tutorías rechazadas'
              renderItem={(tutoring: TutoringWithProfile) => (
                <TutoringReviewCard
                  key={tutoring.id}
                  tutoring={tutoring}
                  updateStatusMutation={updateTutoringStatus}
                  deleteMutation={deleteTutoring}
                />
              )}
            />
          </div>
        </TabsContent>
        <TabsContent value='applications'>
          <div className='space-y-8 mt-6'>
            <ReviewSection
              title={`Postulaciones de Tutores Pendientes (${pendingApplications.length})`}
              items={pendingApplications}
              emptyMessage='No hay postulaciones pendientes de revisión'
              renderItem={(app: TutorApplicationWithProfile) => (
                <ApplicationReviewCard
                  key={app.id}
                  application={app}
                  updateStatusMutation={updateApplicationStatus}
                  deleteMutation={deleteApplication}
                />
              )}
            />
            <ReviewSection
              title={`Postulaciones Aprobadas (${approvedApplications.length})`}
              items={approvedApplications}
              emptyMessage='No hay postulaciones aprobadas'
              renderItem={(app: TutorApplicationWithProfile) => (
                <ApplicationReviewCard
                  key={app.id}
                  application={app}
                  updateStatusMutation={updateApplicationStatus}
                  deleteMutation={deleteApplication}
                />
              )}
            />
            <ReviewSection
              title={`Postulaciones Rechazadas (${rejectedApplications.length})`}
              items={rejectedApplications}
              emptyMessage='No hay postulaciones rechazadas'
              renderItem={(app: TutorApplicationWithProfile) => (
                <ApplicationReviewCard
                  key={app.id}
                  application={app}
                  updateStatusMutation={updateApplicationStatus}
                  deleteMutation={deleteApplication}
                />
              )}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default DirectorPanel
