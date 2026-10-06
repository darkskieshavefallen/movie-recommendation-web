import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/shared/api/errors'
import { MovieForm } from './MovieForm'

describe('MovieForm', () => {
  it('submits normalized values for the create flow', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<MovieForm submitLabel="Create movie" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Title'), '  Arrival  ')
    await user.type(screen.getByLabelText('Release year'), '2016')
    await user.type(screen.getByLabelText(/Description/), ' First contact. ')
    await user.type(screen.getByLabelText(/Genres/), 'Drama, Science Fiction')
    await user.click(screen.getByRole('button', { name: 'Create movie' }))

    expect(onSubmit).toHaveBeenCalledWith(
      {
        title: 'Arrival',
        release_year: 2016,
        description: 'First contact.',
        genres: ['Drama', 'Science Fiction'],
      },
      expect.anything(),
    )
  })

  it('renders edit defaults in the same form', () => {
    render(
      <MovieForm
        submitLabel="Save changes"
        onSubmit={vi.fn()}
        defaultValues={{
          title: 'Alien',
          release_year: 1979,
          description: 'In space no one can hear you scream.',
          genres: ['Horror', 'Science Fiction'],
        }}
      />,
    )

    expect(screen.getByLabelText('Title')).toHaveValue('Alien')
    expect(screen.getByLabelText('Release year')).toHaveValue(1979)
    expect(screen.getByLabelText(/Genres/)).toHaveValue(
      'Horror, Science Fiction',
    )
  })

  it('associates client errors with invalid inputs', async () => {
    const user = userEvent.setup()

    render(<MovieForm submitLabel="Create movie" onSubmit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Create movie' }))

    const title = screen.getByLabelText('Title')
    const year = screen.getByLabelText('Release year')

    expect(title).toHaveAccessibleErrorMessage('Enter a title.')
    expect(year).toHaveAccessibleErrorMessage('Enter a release year.')
  })

  it('shows a FastAPI 422 message on the matching field', () => {
    const submissionError = new ApiError({
      kind: 'validation',
      message: 'Validation failed',
      status: 422,
      body: {
        detail: [
          {
            loc: ['body', 'release_year'],
            msg: 'Release year is not available',
            type: 'value_error',
          },
        ],
      },
    })

    render(
      <MovieForm
        submitLabel="Save changes"
        onSubmit={vi.fn()}
        submissionError={submissionError}
      />,
    )

    expect(screen.getByLabelText('Release year')).toHaveAccessibleErrorMessage(
      'Release year is not available',
    )
  })
})
