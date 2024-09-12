import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react-hooks'
import { $pagination } from './pagination'

describe('Pagination Store', () => {
	beforeEach(() => {
		act(() => {
			$pagination.setState({
				totalItems: 0,
				pageSize: 10,
				currentPage: 0,
				totalPages: 0,
				startIndex: 0,
				endIndex: 0,
				isPreviousEnabled: false,
				isNextEnabled: false,
				startPage: 0,
				endPage: 0,
				pagesRange: []
			})
		})
	})

	describe('Initial State', () => {
		it('should have the correct initial state', () => {
			const { result } = renderHook(() => $pagination.use())

			expect(result.current).toEqual({
				totalItems: 0,
				pageSize: 10,
				currentPage: 0,
				totalPages: 0,
				startIndex: 0,
				endIndex: 0,
				isPreviousEnabled: false,
				isNextEnabled: false,
				startPage: 0,
				endPage: 0,
				pagesRange: []
			})
		})
	})

	describe('State Updates', () => {
		it('should update totalItems and recalculate state', () => {
			act(() => {
				$pagination.setTotalItems(100)
			})

			expect($pagination.state).toEqual({
				totalItems: 100,
				pageSize: 10,
				currentPage: 0,
				totalPages: 10,
				startIndex: 0,
				endIndex: 9,
				isPreviousEnabled: false,
				isNextEnabled: true,
				startPage: 0,
				endPage: 2,
				pagesRange: [0, 1, 2]
			})
		})

		it('should update pageSize and recalculate state', () => {
			act(() => {
				$pagination.setTotalItems(100)
				$pagination.setPageSize(20)
			})

			expect($pagination.state).toEqual({
				totalItems: 100,
				pageSize: 20,
				currentPage: 0,
				totalPages: 5,
				startIndex: 0,
				endIndex: 19,
				isPreviousEnabled: false,
				isNextEnabled: true,
				startPage: 0,
				endPage: 2,
				pagesRange: [0, 1, 2]
			})
		})

		it('should update currentPage and recalculate state', () => {
			act(() => {
				$pagination.setTotalItems(100)
				$pagination.setCurrentPage({ currentPage: 2 })
			})

			expect($pagination.state).toEqual({
				totalItems: 100,
				pageSize: 10,
				currentPage: 2,
				totalPages: 10,
				startIndex: 20,
				endIndex: 29,
				isPreviousEnabled: true,
				isNextEnabled: true,
				startPage: 0,
				endPage: 4,
				pagesRange: [0, 1, 2, 3, 4]
			})
		})
	})

	describe('Navigation', () => {
		beforeEach(() => {
			act(() => {
				$pagination.setTotalItems(100)
			})
		})

		it('should go to the next page', () => {
			act(() => {
				$pagination.goToNextPage()
			})

			expect($pagination.state.currentPage).toBe(1)
		})

		it('should go to the previous page', () => {
			act(() => {
				$pagination.setCurrentPage({ currentPage: 5 })
				$pagination.goToPreviousPage()
			})

			expect($pagination.state.currentPage).toBe(4)
		})

		it('should go to a specific page number', () => {
			act(() => {
				$pagination.goToPageNumber(3)
			})

			expect($pagination.state.currentPage).toBe(3)
		})

		it('should not go beyond the last page', () => {
			act(() => {
				$pagination.goToPageNumber(15)
			})

			expect($pagination.state.currentPage).toBe(9)
		})

		it('should not go before the first page', () => {
			act(() => {
				$pagination.goToPageNumber(-5)
			})

			expect($pagination.state.currentPage).toBe(0)
		})
	})

	describe('Calculations', () => {
		it('should calculate total pages correctly', () => {
			expect($pagination.getTotalPages({ totalItems: 100, pageSize: 10 })).toBe(10)
			expect($pagination.getTotalPages({ totalItems: 101, pageSize: 10 })).toBe(11)
			expect($pagination.getTotalPages({ totalItems: 50, pageSize: 20 })).toBe(3)
		})

		it('should calculate start index correctly', () => {
			act(() => {
				$pagination.setTotalItems(100)
				$pagination.setCurrentPage({ currentPage: 2 })
			})

			expect($pagination.getStartIndex()).toBe(20)
		})

		it('should calculate end index correctly', () => {
			act(() => {
				$pagination.setTotalItems(100)
				$pagination.setCurrentPage({ currentPage: 2 })
			})

			expect($pagination.getEndIndex()).toBe(29)
		})

		it('should calculate end index correctly for the last page', () => {
			act(() => {
				$pagination.setTotalItems(95)
				$pagination.setCurrentPage({ currentPage: 9 })
			})

			expect($pagination.getEndIndex()).toBe(94)
		})
	})

	describe('Edge Cases', () => {
		it('should handle zero total items', () => {
			act(() => {
				$pagination.setTotalItems(0)
			})

			expect($pagination.state).toEqual({
				totalItems: 0,
				pageSize: 10,
				currentPage: 0,
				totalPages: 0,
				startIndex: 0,
				endIndex: 0,
				isPreviousEnabled: false,
				isNextEnabled: false,
				startPage: 0,
				endPage: 0,
				pagesRange: []
			})
		})

		it('should handle page size larger than total items', () => {
			act(() => {
				$pagination.setTotalItems(5)
				$pagination.setPageSize(10)
			})

			expect($pagination.state).toEqual({
				totalItems: 5,
				pageSize: 10,
				currentPage: 0,
				totalPages: 1,
				startIndex: 0,
				endIndex: 4,
				isPreviousEnabled: false,
				isNextEnabled: false,
				startPage: 0,
				endPage: 0,
				pagesRange: [0]
			})
		})
	})
})
