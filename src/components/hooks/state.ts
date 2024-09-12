import { datass } from 'datass'
import { INITIAL_FILTERS } from '../../consts'
import { useEffect } from 'react'

type CategoryKeyT = 'disciplines' | 'institutions'
type FilterKeyT = keyof DisciplinesT | keyof InstitutionsT | keyof CityT | keyof CountyT

const filters = datass.object<FiltersT>({
	disciplines: INITIAL_FILTERS.disciplines,
	institutions: INITIAL_FILTERS.institutions,
	city: INITIAL_FILTERS.city,
	county: INITIAL_FILTERS.county
})

const toggleFilter = (category: CategoryKeyT, key: FilterKeyT) => {
	const categoryFilters = filters.state[category] as AnyObjectT
	const isActive = categoryFilters[key]
	categoryFilters[key] = !isActive
	filters.set({ ...filters.state, [category]: categoryFilters })
}

const useFilter = (category: CategoryKeyT, key: FilterKeyT) => {
	const categoryFilters = filters.state[category] as AnyObjectT
	const isActive = categoryFilters[key] as boolean
	const toggle = useEffect(() => toggleFilter(category, key), [])
	return [isActive, toggle]
}

export const $filters = {
	toggleFilter,
	useFilter,
	...filters
}
