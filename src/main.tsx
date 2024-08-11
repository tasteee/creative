import React from 'react'
import ReactDOM from 'react-dom/client'
import { SearchPage } from './App.tsx'
import './index.css'

import { getMockSearchResults } from './mocks.ts'

// Temporary function to handle the search logic.
// TODO: Figure out how this stuff is supposed to work.
export const useSearchState = () => {
	const [results, setResults] = React.useState<SearchResultT[]>([])
	const [totalPages, setTotalPages] = React.useState(0)
	const [currentPage, setCurrentPage] = React.useState(0)
	const [totalItems, setTotalItems] = React.useState(0)

	const search = async (options: SearchOptionsT) => {
		const response = await getMockSearchResults(options)
		setResults(response.results)
		setTotalItems(response.totalItems)
		setTotalPages(response.totalPages)
		setCurrentPage(response.currentPage)
	}

	return {
		search,
		results,
		totalItems,
		totalPages,
		currentPage
	}
}

const Demo = () => {
	const searchState = useSearchState()
	return <SearchPage {...searchState} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Demo />)
