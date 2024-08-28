import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import { useSearchState } from '../useSearchState'

vi.mock('../../mocks.ts', () => ({
	getMockSearchResults: vi.fn(() =>
		Promise.resolve({
			results: [{ id: 1, title: 'Test Result' }],
			totalItems: 100,
			totalPages: 10,
			currentPage: 1
		})
	)
}))

describe('useSearchState', () => {
	it('should initialize with empty state', () => {
		const { result } = renderHook(() => useSearchState())
		expect(result.current.results).toEqual([])
		expect(result.current.totalItems).toBe(0)
		expect(result.current.totalPages).toBe(0)
		expect(result.current.currentPage).toBe(0)
	})

	it('should update state after search', async () => {
		const { result } = renderHook(() => useSearchState())

		await act(async () => {
			await result.current.search({})
		})

		expect(result.current.results).toBeInstanceOf(Array)
		expect(result.current.totalItems).toBeTypeOf('number')
		expect(result.current.totalPages).toBeTypeOf('number')
		expect(result.current.currentPage).toBe(1)

		result.current.results.forEach((item) => {
			expect(item).toBeTypeOf('object')
			expect(item).toHaveProperty('title')
			expect(item).toHaveProperty('description')
			expect(item).toHaveProperty('image')
			expect(item).toHaveProperty('title')

			expect(item.title).toBeTypeOf('string')
			expect(item.description).toBeTypeOf('string')
			expect(item.image).toBeTypeOf('string')
		})
	})

	it('should use mockResults if provided', async () => {
		const mockResults = {
			results: [{ id: 2, title: 'Custom Result' }],
			totalItems: 50,
			totalPages: 5,
			currentPage: 2
		}
		const { result, waitForNextUpdate } = renderHook(() => useSearchState(mockResults))
		act(() => {
			result.current.search({})
		})
		await waitForNextUpdate()

		expect(result.current.results).toEqual([{ id: 2, title: 'Custom Result' }])
		expect(result.current.totalItems).toBe(50)
		expect(result.current.totalPages).toBe(5)
		expect(result.current.currentPage).toBe(2)
	})
})
