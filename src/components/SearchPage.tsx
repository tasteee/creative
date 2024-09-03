import { SORT_METHODS } from '../consts'
import { ContextStateProvider, useContextState } from './hooks/useContextState'
import { FilterSection } from './FiltersSection'
import range from 'array-range'
import { Cross2Icon } from '@radix-ui/react-icons'
import FilterIcon from '../assets/filter.svg'

export const SearchPage = (props: SearchStateT) => {
	return (
		<ContextStateProvider searchState={props}>
			<div className="SearchPage">
				<LeftSection />
				<RightSection />
			</div>
		</ContextStateProvider>
	)
}

const LeftSection = () => {
	const { pageState } = useContextState()
	const { disciplines, institutions, city, county } = pageState.filters

	return (
		<div className="LeftSection">
			<div className="topRow">
				<h3 className="filtersTitle">
					<img src={FilterIcon} alt="Filter Icon" style={{ width: 20 }} />
					Filters
				</h3>
				<button className="clearFiltersButton" onClick={pageState.clearFilters}>
					<Cross2Icon style={{ color: '#D77272' }} />
					CLEAR
				</button>
			</div>
			<FilterSection
				id="disciplines"
				title="Disciplines"
				filters={disciplines.filters}
				handleChange={disciplines.toggleFilter}
			/>
			<FilterSection
				id="institution"
				title="Institutions / Types"
				filters={institutions.filters}
				handleChange={institutions.toggleFilter}
			/>
			<FilterSection id="city" title="City / Town" filters={city.filters} handleChange={city.toggleFilter} />
			<FilterSection id="county" title="County" filters={county.filters} handleChange={county.toggleFilter} />
		</div>
	)
}

const RightSection = () => {
	const { pageState, searchState } = useContextState()

	return (
		<div className="rightSection">
			<div className="searchBar">
				<input
					className="searchInput"
					type="text"
					value={pageState.searchQuery}
					onChange={(e) => pageState.setSearchQuery(e.target.value)}
					placeholder="Search"
				/>
				<button className="submitButton" onClick={() => pageState.search()}>
					Go
				</button>
			</div>
			<PaginationRow />
			<SearchResults results={searchState.results} />
		</div>
	)
}

const PaginationRow = () => {
	const { paginationState, pageState, searchState } = useContextState()
	const { startIndex, endIndex } = paginationState
	if (!searchState.results.length) return null

	return (
		<div className="PaginationRow">
			<span className="resultsCounter">
				{startIndex}-{endIndex} of {searchState.totalItems} results
			</span>
			<Pagination />
			<select
				className="sortSelect"
				value={pageState.sortMethod}
				onChange={(e) => pageState.setSortMethod(e.target.value)}
			>
				{SORT_METHODS.map((method) => (
					<option key={method.value} value={method.value}>
						{method.label}
					</option>
				))}
			</select>
		</div>
	)
}

type PaginationArrowButtonPropsT = {
	onClick: () => void
	direction: string
}

const PaginationArrowButton = (props: PaginationArrowButtonPropsT) => {
	const label = props.direction === 'forward' ? '→' : '←'

	return (
		<button className="paginationButton" onClick={props.onClick}>
			{label}
		</button>
	)
}

const Pagination = () => {
	const { paginationState, pageState } = useContextState()
	const { currentPage, totalPages, setNextPage, setPreviousPage, nextEnabled, previousEnabled } = paginationState
	const goToPage = (page: number) => () => pageState.search(page)
	const startPage = Math.max(0, currentPage - 1)
	const endPage = Math.min(totalPages - 1, currentPage + 1)
	const pagesRange = range(0, totalPages)

	const renderPageNumbers = () => {
		const pageNumbers = []

		if (totalPages <= 5) {
			// If total pages are 5 or less, show all page numbers
			for (const index of pagesRange) {
				const isIndexCurrentPage = index === currentPage
				const className = isIndexCurrentPage ? 'activePageButton' : ''

				pageNumbers.push(
					<button key={index} className={`paginationButton ${className}`} onClick={goToPage(index)}>
						{index + 1}
					</button>
				)
			}

			return pageNumbers
		}

		// Always show the first page
		pageNumbers.push(
			<button
				key="first"
				className={`paginationButton ${currentPage === 0 ? 'activePageButton' : ''}`}
				onClick={goToPage(0)}
			>
				1
			</button>
		)

		if (currentPage > 2) {
			pageNumbers.push(
				<span key="ellipsis-start" className="paginationButton fakeButton">
					...
				</span>
			)
		}

		// Determine the range of page numbers to display around the current page
		const startPage = Math.max(1, currentPage - 1)
		const endPage = Math.min(totalPages - 2, currentPage + 1)

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<button key={i} className={`paginationButton ${currentPage === i ? 'activePageButton' : ''}`} onClick={goToPage(i)}>
					{i + 1}
				</button>
			)
		}

		if (currentPage < totalPages - 3) {
			pageNumbers.push(
				<span key="ellipsis-end" className="paginationButton fakeButton">
					...
				</span>
			)
		}

		// Always show the last page
		pageNumbers.push(
			<button
				key="last"
				className={`paginationButton ${currentPage === totalPages - 1 ? 'activePageButton' : ''}`}
				onClick={goToPage(totalPages - 1)}
			>
				{totalPages}
			</button>
		)

		return pageNumbers
	}

	return (
		<div className="Pagination">
			{previousEnabled && <PaginationArrowButton onClick={setPreviousPage} direction="backward" />}
			{renderPageNumbers()}
			{nextEnabled && <PaginationArrowButton onClick={setNextPage} direction="forward" />}
		</div>
	)
}

type SearchResultsPropsT = {
	results: SearchResultT[]
}

const SearchResults = (props: SearchResultsPropsT) => {
	return (
		<div className="search-results">
			{props.results.map((result) => (
				<SearchResult key={result.title} {...result} />
			))}
		</div>
	)
}

const SearchResult = (props: SearchResultT) => {
	return (
		<div className="search-result">
			<div className="image-container">
				<img src={props.image} alt={props.title} />
			</div>
			<h4>{props.title}</h4>
			<p>{props.description}</p>
		</div>
	)
}

type AnyObjectT = {
	[key: string]: any
}

type SearchResultT = {
	image: string
	title: string
	description: string
}
