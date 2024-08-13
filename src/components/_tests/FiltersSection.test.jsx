import { vi } from 'vitest'
import '@testing-library/jest-dom'
import { renderWithContext, screen, fireEvent } from './render'
import { FilterSection } from '../FiltersSection'
import { INITIAL_FILTERS } from '../../consts'

const defaultProps = {
	title: 'STUB',
	filters: INITIAL_FILTERS.disciplines,
	handleChange: () => {}
}

test('has the correct title', () => {
	renderWithContext(<FilterSection {...defaultProps} />)
	expect(screen.getByText('STUB')).toBeInTheDocument()
})

test('expanded state works', () => {
	renderWithContext(<FilterSection {...defaultProps} />)
	const header = screen.getByText('STUB')
	expect(screen.getByTestId('musicAndPerforming')).toBeInTheDocument()
	expect(screen.getByTestId('appliedVisualArts')).toBeInTheDocument()
	expect(screen.getByTestId('filmAndMultimedia')).toBeInTheDocument()
	expect(screen.getByTestId('historyAndPreservation')).toBeInTheDocument()
	expect(screen.getByTestId('foodAndCulinary')).toBeInTheDocument()
	expect(screen.getByTestId('writtenAndPublished')).toBeInTheDocument()

	fireEvent.click(header)
	expect(screen.queryByTestId('musicAndPerforming')).not.toBeInTheDocument()
	expect(screen.queryByTestId('appliedVisualArts')).not.toBeInTheDocument()
	expect(screen.queryByTestId('filmAndMultimedia')).not.toBeInTheDocument()
	expect(screen.queryByTestId('historyAndPreservation')).not.toBeInTheDocument()
	expect(screen.queryByTestId('foodAndCulinary')).not.toBeInTheDocument()
	expect(screen.queryByTestId('writtenAndPublished')).not.toBeInTheDocument()

	fireEvent.click(header)
	expect(screen.getByTestId('musicAndPerforming')).toBeInTheDocument()
	expect(screen.getByTestId('appliedVisualArts')).toBeInTheDocument()
	expect(screen.getByTestId('filmAndMultimedia')).toBeInTheDocument()
	expect(screen.getByTestId('historyAndPreservation')).toBeInTheDocument()
	expect(screen.getByTestId('foodAndCulinary')).toBeInTheDocument()
	expect(screen.getByTestId('writtenAndPublished')).toBeInTheDocument()
})

test('renders checkboxes based on filters prop', () => {
	const filters = { ...INITIAL_FILTERS.disciplines, appliedVisualArts: true }

	const updatedProps = {
		...defaultProps,
		filters
	}

	renderWithContext(<FilterSection {...updatedProps} />)
	const checkboxes = screen.getAllByRole('checkbox')
	expect(checkboxes).toHaveLength(6)

	expect(screen.queryByTestId('musicAndPerforming')).not.toBeChecked()
	expect(screen.getByTestId('appliedVisualArts')).toBeChecked()
})

test('calls handleChange when a checkbox is toggled', () => {
	const handleChange = vi.fn()

	const updatedProps = {
		...defaultProps,
		handleChange
	}

	renderWithContext(<FilterSection {...updatedProps} />)
	const checkbox = screen.getByTestId('musicAndPerforming')

	fireEvent.click(checkbox)
	expect(handleChange).toHaveBeenCalledWith('musicAndPerforming')
})
