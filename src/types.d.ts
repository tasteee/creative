/// <reference types="vite/client" />
declare module 'array-range'
declare module '@kensie/create-context-hook'

type AnyObjectT = {
	[key: string]: any
}

type SearchOptionsT = {
	query: string
	sortMethod: string
	filters: AnyObjectT
	page: number
}

type SearchResultT = {
	image: string
	title: string
	description: string
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
