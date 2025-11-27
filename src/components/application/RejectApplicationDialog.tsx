import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface RejectApplicationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (rejectionReason: string) => void
}

export function RejectApplicationDialog({
  isOpen,
  onClose,
  onConfirm,
}: RejectApplicationDialogProps) {
  const [rejectionReason, setRejectionReason] = useState('')

  const handleConfirm = () => {
    onConfirm(rejectionReason)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rechazar postulación</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Escribe el motivo del rechazo..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!rejectionReason}>
            Confirmar rechazo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
