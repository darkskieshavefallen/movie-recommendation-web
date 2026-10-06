import { useNavigate } from '@tanstack/react-router'
import { Trash2Icon } from 'lucide-react'
import { useRef, useState } from 'react'
import {
  getMovieCrudErrorToast,
  getMovieCrudSuccessToast,
} from '@/entities/movie/model/movieCrudFeedback'
import { toApiErrorViewModel } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { toast } from '@/shared/ui/toast'
import { useDeleteMovieMutation } from '../api/useDeleteMovieMutation'

type DeleteMovieDialogProps = {
  movieId: number
  movieTitle: string
}

export function DeleteMovieDialog({
  movieId,
  movieTitle,
}: DeleteMovieDialogProps) {
  const deleteMovie = useDeleteMovieMutation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const submissionRef = useRef<ReturnType<typeof deleteMovie.mutateAsync>>(null)
  const error = deleteMovie.isError
    ? toApiErrorViewModel(deleteMovie.error)
    : null

  async function handleDelete() {
    if (submissionRef.current) {
      return
    }

    const submission = deleteMovie.mutateAsync(movieId)
    submissionRef.current = submission

    try {
      await submission
      await navigate({
        to: '/movies',
        search: { offset: 0, limit: 20 },
        replace: true,
      })
      toast.add(getMovieCrudSuccessToast('delete', movieTitle))
    } catch (deleteError) {
      toast.add(getMovieCrudErrorToast('delete', deleteError))
    } finally {
      if (submissionRef.current === submission) {
        submissionRef.current = null
      }
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && deleteMovie.isPending) {
      return
    }

    setOpen(nextOpen)

    if (!nextOpen) {
      deleteMovie.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="destructive" />}>
        <Trash2Icon data-icon="inline-start" aria-hidden="true" />
        Delete
      </DialogTrigger>
      <DialogContent showCloseButton={!deleteMovie.isPending}>
        <DialogHeader>
          <DialogTitle>Delete {movieTitle}?</DialogTitle>
          <DialogDescription>
            This removes the movie from the local catalog. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <div className="rounded-lg bg-destructive/10 p-3" role="alert">
            <p className="font-medium text-destructive">{error.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message}
            </p>
          </div>
        ) : null}
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" disabled={deleteMovie.isPending} />
            }
          >
            Cancel
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMovie.isPending}
            onClick={handleDelete}
          >
            <Trash2Icon data-icon="inline-start" aria-hidden="true" />
            {deleteMovie.isPending ? 'Deleting…' : 'Delete movie'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
