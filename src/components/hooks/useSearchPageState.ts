import { useState } from 'react'
import { INITIAL_FILTERS } from '../../consts'

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
