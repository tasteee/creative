import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, renderHook } from '@testing-library/react'
import { ContextStateProvider, useContextState } from '../useContextState'

describe('ContextStateProvider', () => {
	const mockSearchState = {
		totalItems: 100,
		search: vi.fn()
	}

	it('should provide context values to children', () => {
		const TestComponent = () => {
			const context = useContextState()
			return <div>{JSON.stringify(context)}</div>
		}

		const { getByText } = render(
			<ContextStateProvider searchState={mockSearchState}>
				<TestComponent />
			</ContextStateProvider>
		)

		expect(getByText(/"paginationState":/)).toBeTruthy()
		expect(getByText(/"searchState":/)).toBeTruthy()
		expect(getByText(/"pageState":/)).toBeTruthy()
	})

	it('should initialize pagination state correctly', () => {
		const { result } = renderHook(() => useContextState(), {
			wrapper: ({ children }) => <ContextStateProvider searchState={mockSearchState}>{children}</ContextStateProvider>
		})

		expect(result.current.paginationState.totalItems).toBe(100)
		expect(result.current.paginationState.pageSize).toBe(12)
	})

	it('should provide search state', () => {
		const { result } = renderHook(() => useContextState(), {
			wrapper: ({ children }) => <ContextStateProvider searchState={mockSearchState}>{children}</ContextStateProvider>
		})

		expect(result.current.searchState).toBe(mockSearchState)
	})

	it('should provide page state with search function', () => {
		const { result } = renderHook(() => useContextState(), {
			wrapper: ({ children }) => <ContextStateProvider searchState={mockSearchState}>{children}</ContextStateProvider>
		})

		expect(result.current.pageState.search).toBeInstanceOf(Function)
		expect(result.current.pageState.clearFilters).toBeInstanceOf(Function)
	})
})
