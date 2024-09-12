import React from 'react'
import { datass } from 'datass'

type SearchOptionsT = {
	query: string
	sortMethod: string
	filters: AnyObjectT
	page: number
}

const BASE_URL = 'https://nbcreative.kinsta.cloud/wp-content/plugins/new-bedford-art/public/'
const API_URL = BASE_URL + 'api-handler.php?api=rest&action=search_options&'

const headers = {
  'Content-Type': 'application/json',
  Authorization: import.meta.env.VITE_API_KEY
}

async function search(options: SearchOptionsT) {
	const parameters = new URLSearchParams(options)
  const url = API_URL + parameters.toString()

	const response = await fetch(url, {
		headers,
		method: 'GET',
		mode: 'cors'
	})

	const data = await response.json()
	return data
}

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