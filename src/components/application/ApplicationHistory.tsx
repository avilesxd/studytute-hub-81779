import { useAuth } from '@/contexts/auth/AuthContext'
import { useGetUserApplications } from '@/hooks/queries/useUserQueries'
import ApplicationHistoryCard from './ApplicationHistoryCard'
import { Skeleton } from '../ui/skeleton'

const ApplicationHistory = () => {
  const { user, isDirector } = useAuth()
  const {
    data: applications,
    isLoading,
    isError,
  } = useGetUserApplications(user)

  if (isDirector) {
    return null
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error al cargar el historial de postulaciones.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Historial de Postulaciones</h2>
      {applications && applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {applications.map((application) => (
            <ApplicationHistoryCard
              key={application.id}
              application={application}
            />
          ))}
        </div>
      ) : (
        <p>No tienes postulaciones todavía.</p>
      )}
    </div>
  )
}

export default ApplicationHistory
