import React from 'react'
import { getMockSearchResults } from '../../mocks.ts'

export const useSearchState = (mockResults?: any) => {
	const [results, setResults] = React.useState<SearchResultT[]>([])
	const [totalPages, setTotalPages] = React.useState(0)
	const [currentPage, setCurrentPage] = React.useState(0)
	const [totalItems, setTotalItems] = React.useState(0)

	const search = async (options: SearchOptionsT) => {
		const data = await getResults(options)

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

export const getResults = async (options: SearchOptionsT) => {
	const url =
		'https://nbcreative.kinsta.cloud/wp-content/plugins/new-bedford-art/public/api-handler.php?api=rest&action=search_options&'
	const parameters = new URLSearchParams()

	Object.entries(options).forEach(([key, value]) => {
		parameters.append(key, String(value))
	})

	const headers = {
		'Content-Type': 'application/json',
		Authorization: 'Bearer 1ac9e67a9c2a56510b9f2e9f4f2d97cc' // temp
	}

	const response = await fetch(url + parameters.toString(), { headers })
	const data = await response.json()
	return data
}
