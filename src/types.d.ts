/// <reference types="vite/client" />
declare module 'array-range'
declare module '@kensie/create-context-hook'

type FilterT = {
	id: string
	label: string
	value: boolean
	category: string
	isDirty: boolean
	isTouched: boolean
}

type CategoryFiltersT = {
	[key: string]: FilterT[]
}

type FilterCategoryT = {
	id: string
	label: string
	isDirty: boolean
	isTouched: boolean
	filters: CategoryFilters
}

type FilterCategoriesT = {
	[key: string]: Category
}

type AnyObjectT = {
	[key: string]: any
}

type SearchOptionsT = {
	query: string
	sortMethod: string
	filters: AnyObjectT
	page: number
}

type SearchResultAttributesT = {
	title: string
	body: string
	path: string
	field_physical_address: string
	field_geolocation_data: string
	field_profile_image: string
	field_institution_business_type: string
	field_primary_discipline: string
}

type SearchResultT = {
	id: string
	type: string
	relationships: any
	attributes: SearchResultAttributesT
}

type SearchStateT = {
	search: (options: SearchOptionsT) => void
	results: SearchResultT[]
	totalItems: number
	totalPages: number
	currentPage: number
}

type SearchPagePropsT = {
	search: (options: SearchOptionsT) => void
	results: SearchResultT[]
}

type SearchPageStateT = {
	sortMethod: string
	searchQuery: string
	filters: AnyObjectT
	setSortMethod: (method: string) => void
	setSearchQuery: (query: string) => void
	clearFilters: () => void
	search: (page?: number) => void
}
