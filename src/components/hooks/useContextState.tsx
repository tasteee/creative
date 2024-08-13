import { usePagination } from 'react-use-pagination'
import { createContext, useContext } from 'react'
import { useSearchPageState } from './useSearchPageState'

const DEFAULT_CONTEXT = {
	paginationState: {},
	searchState: {},
	pageState: {
		clearFilters: () => {},
		search: () => {}
	}
}

const Context = createContext(DEFAULT_CONTEXT)
export const useContextState = () => useContext(Context) as ContextStateT

type ProviderPropsT = {
	searchState: SearchStateT
	children: React.ReactNode
}

type ContextStateT = {
	paginationState: AnyObjectT
	searchState: SearchStateT
	pageState: SearchPageStateT
}

export const ContextStateProvider = (props: ProviderPropsT) => {
	const searchState = props.searchState
	const paginationState = usePagination({ totalItems: searchState.totalItems, initialPageSize: 12 })
	const pageState = useSearchPageState(searchState)
	// currentPage, totalPages, setNextPage, setPreviousPage, nextEnabled, previousEnabled, startIndex, endIndex,

	const contextValue = {
		paginationState,
		searchState,
		pageState
	} as ContextStateT

	return <Context.Provider value={contextValue}>{props.children}</Context.Provider>
}
