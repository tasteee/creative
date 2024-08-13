import React from 'react'
import { getMockSearchResults } from '../../mocks.ts'

export const useSearchState = (mockResults?: any) => {
	const [results, setResults] = React.useState<SearchResultT[]>([])
	const [totalPages, setTotalPages] = React.useState(0)
	const [currentPage, setCurrentPage] = React.useState(0)
	const [totalItems, setTotalItems] = React.useState(0)

	const search = async (options: SearchOptionsT) => {
		const response = mockResults || getMockSearchResults(options)
		const data = await response

		console.log({ data })
		setResults(data.results)
		setTotalItems(data.totalItems)
		setTotalPages(data.totalPages)
		setCurrentPage(data.currentPage)
	}

	return {
		search,
		results,
		totalItems,
		totalPages,
		currentPage
	}
}
