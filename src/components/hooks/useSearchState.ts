import React from 'react'

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

const BASE_URL = 'https://nbcreative.kinsta.cloud/wp-content/plugins/new-bedford-art/public/'
const API_URL = BASE_URL + 'api-handler.php?api=rest&action=search_options&'

export const getResults = async (options: SearchOptionsT) => {
	// NOTE: This is not sufficient. It is temporary. Need to
	// handle nested filters to convert them to API compliant
	// url params.
	const parameters = new URLSearchParams(options)

	const headers = {
		'Content-Type': 'application/json',
		Authorization: import.meta.env.VITE_API_KEY
	}

	console.log({ headers })

	const response = await fetch(API_URL + parameters.toString(), {
		headers,
		method: 'GET',
		mode: 'cors'
	})

	const data = await response.json()
	return data
}
