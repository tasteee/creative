import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SearchPage, LeftSection, RightSection, PaginationRow, Pagination, SearchResults } from './SearchPage'
import { ContextStateProvider } from './hooks/useContextState'
import { describe, test, expect, beforeEach, vi } from 'vitest'

// Mock the useContextState hook
vi.mock('./hooks/useContextState', () => ({
	useContextState: vi.fn(),
	ContextStateProvider: ({ children }) => <div>{children}</div>
}))

// Mock the FilterSection component
vi.mock('./FiltersSection', () => ({
	FilterSection: () => <div data-testid="filter-section" />
}))

describe('SearchPage', () => {
	test('renders LeftSection and RightSection', () => {
		render(<SearchPage />)
		expect(screen.getByTestId('left-section')).toBeInTheDocument()
		expect(screen.getByTestId('right-section')).toBeInTheDocument()
	})
})

describe('LeftSection', () => {
	beforeEach(() => {
		vi.mocked(useContextState).mockReturnValue({
			pageState: {
				filters: {
					disciplines: { filters: [], toggleFilter: vi.fn() },
					institutions: { filters: [], toggleFilter: vi.fn() },
					city: { filters: [], toggleFilter: vi.fn() },
					county: { filters: [], toggleFilter: vi.fn() }
				},
				clearFilters: vi.fn()
			}
		})
	})

	test('renders filter sections and clear filters button', () => {
		render(<LeftSection />)
		expect(screen.getByText('Filters')).toBeInTheDocument()
		expect(screen.getByText('CLEAR')).toBeInTheDocument()
		expect(screen.getAllByTestId('filter-section')).toHaveLength(4)
	})

	test('calls clearFilters when clear button is clicked', () => {
		const clearFiltersMock = vi.fn()
		vi.mocked(useContextState).mockReturnValue({
			pageState: {
				filters: {
					disciplines: { filters: [], toggleFilter: vi.fn() },
					institutions: { filters: [], toggleFilter: vi.fn() },
					city: { filters: [], toggleFilter: vi.fn() },
					county: { filters: [], toggleFilter: vi.fn() }
				},
				clearFilters: clearFiltersMock
			}
		})

		render(<LeftSection />)
		fireEvent.click(screen.getByText('CLEAR'))
		expect(clearFiltersMock).toHaveBeenCalled()
	})
})

describe('RightSection', () => {
	beforeEach(() => {
		vi.mocked(useContextState).mockReturnValue({
			pageState: {
				searchQuery: '',
				setSearchQuery: vi.fn(),
				search: vi.fn()
			},
			searchState: {
				results: []
			}
		})
	})

	test('renders search bar and button', () => {
		render(<RightSection />)
		expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
		expect(screen.getByText('Go')).toBeInTheDocument()
	})

	test('calls setSearchQuery when input changes', () => {
		const setSearchQueryMock = vi.fn()
		vi.mocked(useContextState).mockReturnValue({
			pageState: {
				searchQuery: '',
				setSearchQuery: setSearchQueryMock,
				search: vi.fn()
			},
			searchState: {
				results: []
			}
		})

		render(<RightSection />)
		fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'test query' } })
		expect(setSearchQueryMock).toHaveBeenCalledWith('test query')
	})

	test('calls search when Go button is clicked', () => {
		const searchMock = vi.fn()
		vi.mocked(useContextState).mockReturnValue({
			pageState: {
				searchQuery: '',
				setSearchQuery: vi.fn(),
				search: searchMock
			},
			searchState: {
				results: []
			}
		})

		render(<RightSection />)
		fireEvent.click(screen.getByText('Go'))
		expect(searchMock).toHaveBeenCalled()
	})
})

describe('PaginationRow', () => {
	beforeEach(() => {
		vi.mocked(useContextState).mockReturnValue({
			paginationState: {
				startIndex: 1,
				endIndex: 10
			},
			pageState: {
				sortMethod: 'relevance',
				setSortMethod: vi.fn()
			},
			searchState: {
				results: [{}],
				totalItems: 100
			}
		})
	})

	test('renders pagination information and sort select', () => {
		render(<PaginationRow />)
		expect(screen.getByText('1-10 of 100 results')).toBeInTheDocument()
		expect(screen.getByRole('combobox')).toBeInTheDocument()
	})

	test('calls setSortMethod when sort select changes', () => {
		const setSortMethodMock = vi.fn()
		vi.mocked(useContextState).mockReturnValue({
			paginationState: {
				startIndex: 1,
				endIndex: 10
			},
			pageState: {
				sortMethod: 'relevance',
				setSortMethod: setSortMethodMock
			},
			searchState: {
				results: [{}],
				totalItems: 100
			}
		})

		render(<PaginationRow />)
		fireEvent.change(screen.getByRole('combobox'), { target: { value: 'date' } })
		expect(setSortMethodMock).toHaveBeenCalledWith('date')
	})
})

describe('Pagination', () => {
	beforeEach(() => {
		vi.mocked(useContextState).mockReturnValue({
			paginationState: {
				currentPage: 2,
				totalPages: 10,
				setNextPage: vi.fn(),
				setPreviousPage: vi.fn(),
				nextEnabled: true,
				previousEnabled: true
			},
			pageState: {
				search: vi.fn()
			}
		})
	})

	test('renders correct number of page buttons', () => {
		render(<Pagination />)
		expect(screen.getAllByRole('button')).toHaveLength(7) // 5 page buttons + 2 arrow buttons
	})

	test('calls setPreviousPage when backward arrow is clicked', () => {
		const setPreviousPageMock = vi.fn()
		vi.mocked(useContextState).mockReturnValue({
			paginationState: {
				currentPage: 2,
				totalPages: 10,
				setNextPage: vi.fn(),
				setPreviousPage: setPreviousPageMock,
				nextEnabled: true,
				previousEnabled: true
			},
			pageState: {
				search: vi.fn()
			}
		})

		render(<Pagination />)
		fireEvent.click(screen.getByText('←'))
		expect(setPreviousPageMock).toHaveBeenCalled()
	})

	test('calls setNextPage when forward arrow is clicked', () => {
		const setNextPageMock = vi.fn()
		vi.mocked(useContextState).mockReturnValue({
			paginationState: {
				currentPage: 2,
				totalPages: 10,
				setNextPage: setNextPageMock,
				setPreviousPage: vi.fn(),
				nextEnabled: true,
				previousEnabled: true
			},
			pageState: {
				search: vi.fn()
			}
		})

		render(<Pagination />)
		fireEvent.click(screen.getByText('→'))
		expect(setNextPageMock).toHaveBeenCalled()
	})

	test('calls search with correct page when a page button is clicked', () => {
		const searchMock = vi.fn()
		vi.mocked(useContextState).mockReturnValue({
			paginationState: {
				currentPage: 2,
				totalPages: 10,
				setNextPage: vi.fn(),
				setPreviousPage: vi.fn(),
				nextEnabled: true,
				previousEnabled: true
			},
			pageState: {
				search: searchMock
			}
		})

		render(<Pagination />)
		fireEvent.click(screen.getByText('4'))
		expect(searchMock).toHaveBeenCalledWith(3) // 0-based index
	})
})

describe('SearchResults', () => {
	const mockResults = [
		{ title: 'Result 1', description: 'Description 1', image: 'image1.jpg' },
		{ title: 'Result 2', description: 'Description 2', image: 'image2.jpg' }
	]

	test('renders correct number of search results', () => {
		render(<SearchResults results={mockResults} />)
		expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(2)
	})

	test('renders correct content for each search result', () => {
		render(<SearchResults results={mockResults} />)
		mockResults.forEach((result) => {
			expect(screen.getByText(result.title)).toBeInTheDocument()
			expect(screen.getByText(result.description)).toBeInTheDocument()
			expect(screen.getByAltText(result.title)).toHaveAttribute('src', result.image)
		})
	})
})
