import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TutorApplication } from '@/lib/api'
import { FormatDate } from '@/utils/formatDate'

interface ApplicationHistoryCardProps {
  application: TutorApplication
}

const ApplicationHistoryCard = ({
  application,
}: ApplicationHistoryCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'default'
      case 'rejected':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">{application.subject}</CardTitle>
        <CardDescription>
          Postulación enviada el {FormatDate(application.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Estado</span>
          <Badge variant={getStatusVariant(application.status)}>
            {application.status}
          </Badge>
        </div>
        {application.status === 'rejected' && application.rejection_reason && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-500">
              Razón del rechazo
            </span>
            <p className="text-sm text-gray-700">
              {application.rejection_reason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ApplicationHistoryCard
