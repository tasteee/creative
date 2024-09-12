import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import { $store } from './store'
import { INITIAL_FILTERS_STATE } from '../constants/filters'
import { submitSearch } from './submitSearch'

vi.mock('./submitSearch', () => ({
	submitSearch: vi.fn()
}))

describe('Store', () => {
	beforeEach(() => {
		act(() => {
			$store.reset()
		})
	})

	describe('Initial State', () => {
		it('should have the correct initial state', () => {
			const expectedInitialState = {
				query: '',
				results: [],
				sortMethod: 'relevance',
				sortDirection: 'desc',
				filterCategories: INITIAL_FILTERS_STATE
			}

			const { result } = renderHook(() => $store.use())

			expect(result.current).toEqual(expectedInitialState)
		})
	})

	describe('State Updates', () => {
		it('should update query', () => {
			const newQuery = 'test query'

			act(() => {
				$store.setQuery(newQuery)
			})

			expect($store.state.query).toBe(newQuery)
		})

		it('should update results', () => {
			const newResults = [{ id: 1, title: 'Test Result' }]

			act(() => {
				$store.setResults(newResults)
			})

			expect($store.state.results).toEqual(newResults)
		})

		it('should update sortMethod', () => {
			const newSortMethod = 'date'

			act(() => {
				$store.setSortMethod(newSortMethod)
			})

			expect($store.state.sortMethod).toBe(newSortMethod)
		})

		it('should update sortDirection', () => {
			const newSortDirection = 'asc'

			act(() => {
				$store.setSortDirection(newSortDirection)
			})

			expect($store.state.sortDirection).toBe(newSortDirection)
		})

		it('should update filterCategories', () => {
			const newFilterCategories = {
				...INITIAL_FILTERS_STATE,
				category1: { filters: { filter1: { value: true } } }
			}

			act(() => {
				$store.setFilterCategories(newFilterCategories)
			})

			expect($store.state.filterCategories).toEqual(newFilterCategories)
		})
	})

	describe('Filter Operations', () => {
		it('should toggle a filter', () => {
			const categoryKey = 'category1'
			const filterKey = 'filter1'

			// Assume initial state has the filter set to false
			expect($store.state.filterCategories[categoryKey].filters[filterKey].value).toBe(false)

			act(() => {
				$store.toggleFilter(categoryKey)(filterKey)
			})

			expect($store.state.filterCategories[categoryKey].filters[filterKey].value).toBe(true)
		})

		it('should clear all filters', () => {
			// Set a filter to true
			act(() => {
				$store.toggleFilter('category1')('filter1')
			})

			// Clear filters
			act(() => {
				$store.clearFilters()
			})

			expect($store.state.filterCategories).toEqual(INITIAL_FILTERS_STATE)
		})

		it('should get a filter category', () => {
			const categoryKey = 'category1'
			const category = $store.getFilterCategory(categoryKey)

			expect(category).toEqual(INITIAL_FILTERS_STATE[categoryKey])
		})
	})

	describe('Hooks', () => {
		it('should return all filters with useFilters', () => {
			const { result } = renderHook(() => $store.useFilters())

			expect(result.current).toEqual(INITIAL_FILTERS_STATE)
		})

		it('should return a specific filter category with useFilterCategory', () => {
			const categoryKey = 'category1'
			const { result } = renderHook(() => $store.useFilterCategory(categoryKey))

			expect(result.current).toEqual(INITIAL_FILTERS_STATE[categoryKey])
		})
	})

	describe('Search', () => {
		it('should call submitSearch when search is triggered', () => {
			act(() => {
				$store.search()
			})

			expect(submitSearch).toHaveBeenCalledWith($store)
		})
	})

	describe('Reset', () => {
		it('should reset the store to initial state', () => {
			// Change some state
			act(() => {
				$store.setQuery('test query')
				$store.setSortMethod('date')
				$store.toggleFilter('category1')('filter1')
			})

			// Reset the store
			act(() => {
				$store.reset()
			})

			// Check if the state is back to initial
			const expectedInitialState = {
				query: '',
				results: [],
				sortMethod: 'relevance',
				sortDirection: 'desc',
				filterCategories: INITIAL_FILTERS_STATE
			}

			expect($store.state).toEqual(expectedInitialState)
		})
	})
})
