import { INITIAL_FILTERS_STATE } from '../constants/filters'
import { create } from 'zustand'
import { submitSearch } from './submitSearch'
import { $pagination } from './$pagination'

type StateT = {
	pageNumber: number
	query: string
	sortMethod: string
	sortDirection: string
	results: SearchResultT[]
	filterCategories: FilterCategoriesT
}

const INITIAL_STATE: StateT = {
	pageNumber: 0,
	query: '',
	results: [],
	sortMethod: 'relevance',
	sortDirection: 'desc',
	filterCategories: INITIAL_FILTERS_STATE
}

const useStore = create<StateT>(() => ({ ...INITIAL_STATE }))
const reset = () => $store.setState(INITIAL_STATE)

const setKeyValue = (key: keyof StateT) => {
	return (value: any) => useStore.setState({ [key]: value })
}

const setQuery = setKeyValue('query')
const setResults = setKeyValue('results')
const setSortMethod = setKeyValue('sortMethod')
const setPageNumber = setKeyValue('pageNumber')
const setSortDirection = setKeyValue('sortDirection')
const setFilterCategories = setKeyValue('filterCategories')

const templateUpdateCategory = {
	isTouched: true,
	isDirty: true
}

const toggleFilter = (categoryKey: string) => {
	type FilterCaregoryT = (typeof $store.state.filterCategories)[typeof categoryKey]

	return (filterKey: keyof FilterCaregoryT['filters']) => {
		const categories = { ...$store.state.filterCategories }
		const category = { ...categories[categoryKey] }
		const filters = { ...category.filters }
		const filter = { ...filters[filterKey] }
		filter.value = !filter.value
		category.filters = { ...filters, [filterKey]: filter }
		const updatedCategory = { ...templateUpdateCategory, ...category }
		setFilterCategories({ ...categories, [categoryKey]: updatedCategory })
	}
}

const useFilters = () => {
	return useStore((state) => state.filterCategories)
}

const useFilter = (categoryId: string, filterId: string) => {
	return useStore((state) => state.filterCategories[categoryId].filters[filterId])
}

const clearFilters = () => {
	setFilterCategories(INITIAL_FILTERS_STATE)
}

const getFilterCategory = (categoryKey: string) => {
	return $store.state.filterCategories[categoryKey]
}

const useFilterCategory = (categoryKey: string) => {
	return useStore((state) => state.filterCategories[categoryKey])
}

const search = async () => {
	const result = await submitSearch($store)
	setResults(result.data)
	$pagination.syncWithResponse(result)
}

const goToPage = (pageNumber: number) => {
	setPageNumber(pageNumber)
	search()
}

type StoreT = {
	use: typeof useStore
	goToPage: typeof goToPage
	reset: typeof reset
	useFilter: typeof useFilter
	search: typeof search
	toggleFilter: typeof toggleFilter
	setState: typeof useStore.setState
	clearFilters: typeof clearFilters
	useFilters: typeof useFilters
	setQuery: typeof setQuery
	setFilterCategories: typeof setFilterCategories
	getFilterCategory: typeof getFilterCategory
	useFilterCategory: typeof useFilterCategory
	setSortMethod: typeof setSortMethod
	setSortDirection: typeof setSortDirection
	setResults: typeof setResults
	get state(): StateT
}

export const $store: StoreT = {
	setState: useStore.setState,
	use: useStore,
	reset,
	useFilter,
	clearFilters,
	search,
	goToPage,
	useFilters,
	toggleFilter,
	setQuery,
	setResults,
	setFilterCategories,
	useFilterCategory,
	getFilterCategory,
	setSortMethod,
	setSortDirection,

	get state() {
		return useStore.getState()
	}
}
