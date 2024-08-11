import { createContextHook } from './createContextHook'
import { usePagination } from 'react-use-pagination'
import { useState } from 'react'
import { INITIAL_FILTERS } from './consts'

// Builds the state / setters for each individual filter section.
export const useFiltersSectionState = (key: keyof typeof INITIAL_FILTERS) => {
	const initialState = INITIAL_FILTERS[key]
	const [filters, setFilters] = useState<AnyObjectT>(initialState)

	const toggleFilter = (key: string) => {
		const isActive = filters[key]
		setFilters({ ...filters, [key]: !isActive })
	}

	const clearFilters = () => {
		setFilters(initialState)
	}

	return {
		filters,
		toggleFilter,
		clearFilters
	}
}

// Combines the individual filter sections into a single state hook.
export const useFilters = () => {
	const disciplines = useFiltersSectionState('disciplines')
	const institutions = useFiltersSectionState('institutions')
	const city = useFiltersSectionState('city')
	const county = useFiltersSectionState('county')

	const clearFilters = () => {
		disciplines.clearFilters()
		institutions.clearFilters()
		city.clearFilters()
		county.clearFilters()
	}

	return {
		clearFilters,
		disciplines,
		institutions,
		city,
		county
	}
}

// Merges the filters with searchQuery state
// and sortMethod state to create a single state hook.
export const useSearchPageState = (searchState: SearchStateT) => {
	const { clearFilters, ...filters } = useFilters()
	const [query, setQuery] = useState('')
	const [sortMethod, setSortMethod] = useState('relevance')

	const search = (page: number = 0) => {
		searchState.search({
			page,
			query,
			sortMethod,
			filters
		})
	}

	return {
		sortMethod,
		setSortMethod,
		searchQuery: query,
		setSearchQuery: setQuery,
		filters,
		clearFilters,
		search
	}
}

type ProviderPropsT = {
	value: SearchStateT
}

export const [ContextStateProvider, useContextState] = createContextHook((providerProps: ProviderPropsT) => {
	const searchState = providerProps.value
	const paginationState = usePagination({ totalItems: searchState.totalItems, initialPageSize: 12 })
	const pageState = useSearchPageState(searchState)
	// currentPage, totalPages, setNextPage, setPreviousPage, nextEnabled, previousEnabled, startIndex, endIndex,

	return {
		paginationState,
		searchState,
		pageState
	}
})
