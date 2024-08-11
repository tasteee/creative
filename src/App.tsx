// import './App.css'
import { useState } from 'react'
import { FILTER_LABELS, SORT_METHODS } from './consts'
import { ContextStateProvider, useContextState } from './context'

export const SearchPage = (props: SearchStateT) => {
	console.log({ props })
	return (
		<ContextStateProvider value={props}>
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
			<button className="clearFiltersButton" onClick={pageState.clearFilters}>
				CLEAR
			</button>
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
			<div className="search-bar">
				<input
					type="text"
					value={pageState.searchQuery}
					onChange={(e) => pageState.setSearchQuery(e.target.value)}
					placeholder="Search Our Directory"
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

type FilterSectionPropsT = {
	id: string
	title: string
	filters: AnyObjectT
	handleChange: (key: string) => void
}

const FilterSection = (props: FilterSectionPropsT) => {
	const [isExpanded, setIsExpanded] = useState(true)
	const filtersEntries = Object.entries(props.filters)

	return (
		<div className="FilterSection">
			<h3 className="FilterSectionHeader" onClick={() => setIsExpanded(!isExpanded)}>
				{props.title}
			</h3>

			{isExpanded && (
				<div className="FilterSectionBody">
					{filtersEntries.map((entry: [string, boolean]) => (
						<CheckboxFilter key={entry[0]} value={entry[1]} filterKey={entry[0]} toggle={props.handleChange} />
					))}
				</div>
			)}
		</div>
	)
}

type CheckboxFilterPropsT = {
	value: boolean
	filterKey: string
	toggle: (key: string) => void
}

const CheckboxFilter = (props: CheckboxFilterPropsT) => {
	const filterKey = props.filterKey as keyof typeof FILTER_LABELS
	const label = FILTER_LABELS[filterKey]

	const toggleFilter = () => {
		props.toggle(filterKey)
	}

	return (
		<li className="CheckboxFilter">
			<input type="checkbox" id={filterKey} checked={props.value} onChange={toggleFilter} />
			<label htmlFor={filterKey}>{label}</label>
		</li>
	)
}

const PaginationRow = () => {
	const { paginationState, pageState, searchState } = useContextState()
	const { startIndex, endIndex } = paginationState
	console.log({ pageState, searchState, paginationState })
	if (!searchState.results.length) return null

	return (
		<div className="PaginationRow">
			<span>
				{startIndex}-{endIndex} of {searchState.totalResults} results
			</span>
			<Pagination />
			<select value={pageState.sortMethod} onChange={(e) => pageState.setSortMethod(e.target.value)}>
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

	const renderPageNumbers = () => {
		const pageNumbers = []

		if (totalPages <= 5) {
			// If total pages are 5 or less, show all page numbers
			for (let i = 0; i < totalPages; i++) {
				pageNumbers.push(
					<button key={i} className={`paginationButton ${currentPage === i ? 'active' : ''}`} onClick={goToPage(i)}>
						{i + 1}
					</button>
				)
			}
		} else {
			// More than 5 pages
			if (currentPage > 2) {
				pageNumbers.push(
					<button key="first" className="paginationButton" onClick={goToPage(0)}>
						1
					</button>
				)
				if (currentPage > 3) {
					pageNumbers.push(
						<span key="ellipsis-start" className="paginationButton fakeButton">
							...
						</span>
					)
				}
			}

			const startPage = Math.max(0, currentPage - 1)
			const endPage = Math.min(totalPages - 1, currentPage + 1)

			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(
					<button key={i} className={`paginationButton ${currentPage === i ? 'active' : ''}`} onClick={goToPage(i)}>
						{i + 1}
					</button>
				)
			}

			if (currentPage < totalPages - 3) {
				if (currentPage < totalPages - 4) {
					pageNumbers.push(
						<span key="ellipsis-end" className="paginationButton fakeButton">
							...
						</span>
					)
				}
				pageNumbers.push(
					<button key="last" className="paginationButton" onClick={goToPage(totalPages - 1)}>
						{totalPages}
					</button>
				)
			}
		}

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
