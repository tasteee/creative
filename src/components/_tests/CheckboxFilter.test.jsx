import { vi } from 'vitest'
import '@testing-library/jest-dom'
import { renderWithContext, screen, fireEvent } from './render'
import { CheckboxFilter } from '../CheckboxFilter'
import { FILTER_LABELS } from '../../consts'

const FILTER_LABEL_KEYS = Object.keys(FILTER_LABELS)

test('has correct label', () => {
	const filterKey = FILTER_LABEL_KEYS[0]
	renderWithContext(<CheckboxFilter value={true} filterKey={filterKey} toggle={() => {}} />)
	expect(screen.getByLabelText(FILTER_LABELS[filterKey])).toBeInTheDocument()
})

test('is checked when value is true', () => {
	renderWithContext(<CheckboxFilter value={true} filterKey="filter1" toggle={() => {}} />)
	expect(screen.getByRole('checkbox')).toBeChecked()
})

test('is not checked when value is false', () => {
	renderWithContext(<CheckboxFilter value={false} filterKey="filter1" toggle={() => {}} />)
	expect(screen.getByRole('checkbox')).not.toBeChecked()
})

test('calls toggle prop when click', () => {
	const mockToggle = vi.fn()
	const filterKey = FILTER_LABEL_KEYS[2]
	renderWithContext(<CheckboxFilter value={true} filterKey={filterKey} toggle={mockToggle} />)

	const checkbox = screen.getByRole('checkbox')
	fireEvent.click(checkbox)
	expect(mockToggle).toHaveBeenCalledWith(filterKey)
})
