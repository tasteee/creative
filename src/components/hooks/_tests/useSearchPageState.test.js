import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import { useSearchPageState, useFiltersSectionState, useFilters } from '../useSearchPageState'
import { INITIAL_FILTERS } from '../../../consts'

describe('useSearchPageState', () => {
	const mockSearchState = {
		search: vi.fn()
	}

	it('should initialize with default values', () => {
		const { result } = renderHook(() => useSearchPageState(mockSearchState))
		expect(result.current.sortMethod).toBe('relevance')
		expect(result.current.searchQuery).toBe('')
	})

	it('should update sort method', () => {
		const { result } = renderHook(() => useSearchPageState(mockSearchState))
		act(() => {
			result.current.setSortMethod('alphabetical')
		})
		expect(result.current.sortMethod).toBe('alphabetical')
	})

	it('should update search query', () => {
		const { result } = renderHook(() => useSearchPageState(mockSearchState))
		act(() => {
			result.current.setSearchQuery('test query')
		})
		expect(result.current.searchQuery).toBe('test query')
	})

	it('should call search function with correct parameters', async () => {
		const mock = {
			search: vi.fn()
		}

		const { result } = renderHook(() => useSearchPageState(mock))
		act(() => {
			result.current.setSearchQuery('test query')
			result.current.setSortMethod('newest')
		})

		await act(async () => {
			await result.current.search(1)
		})

		expect(mock.search).toHaveBeenCalledWith({
			page: 1,
			query: 'test query',
			sortMethod: 'newest',
			filters: expect.any(Object)
		})
	})
})

describe('Filter Hooks', () => {
	describe('useFiltersSectionState', () => {
		it('should initialize with correct initial state', () => {
			const { result } = renderHook(() => useFiltersSectionState('disciplines'))
			expect(result.current.filters).toEqual(INITIAL_FILTERS.disciplines)
		})

		it('should toggle filter correctly', () => {
			const { result } = renderHook(() => useFiltersSectionState('disciplines'))
			act(() => {
				result.current.toggleFilter('musicAndPerforming')
			})
			expect(result.current.filters.musicAndPerforming).toBe(true)
		})

		it('should clear filters correctly', () => {
			const { result } = renderHook(() => useFiltersSectionState('disciplines'))
			act(() => {
				result.current.toggleFilter('musicAndPerforming')
				result.current.clearFilters()
			})
			expect(result.current.filters).toEqual(INITIAL_FILTERS.disciplines)
		})
	})

	describe('useFilters', () => {
		it('should initialize all filter sections', () => {
			const { result } = renderHook(() => useFilters())
			expect(result.current.disciplines.filters).toEqual(INITIAL_FILTERS.disciplines)
			expect(result.current.institutions.filters).toEqual(INITIAL_FILTERS.institutions)
			expect(result.current.city.filters).toEqual(INITIAL_FILTERS.city)
			expect(result.current.county.filters).toEqual(INITIAL_FILTERS.county)
		})

		it('should clear all filters', () => {
			const { result } = renderHook(() => useFilters())
			act(() => {
				result.current.disciplines.toggleFilter('musicAndPerforming')
				result.current.institutions.toggleFilter('creationProduction')
				result.current.clearFilters()
			})
			expect(result.current.disciplines.filters).toEqual(INITIAL_FILTERS.disciplines)
			expect(result.current.institutions.filters).toEqual(INITIAL_FILTERS.institutions)
		})
	})
})
