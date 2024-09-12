import { SORT_METHODS } from '../consts'
import { FilterSection } from './FiltersSection'
import FilterIcon from '../assets/filter.svg'

import { $store } from '../state/$store'
import { $pagination } from '../state/$pagination'
import { Pagination } from './Pagination'

export const SearchPage = () => {
	return (
		<div className="SearchPage">
			<LeftSection />
			<RightSection />
		</div>
	)
}

const ClearFiltersButton = () => {
	return (
		<button className="clearFiltersButton" onClick={$store.clearFilters}>
			Clear Filters
		</button>
	)
}

const FiltersSectionHeader = () => {
	return (
		<h3 className="filtersTitle">
			<img src={FilterIcon} alt="Filter Icon" style={{ width: 20 }} />
			Filters
		</h3>
	)
}

const LeftSection = () => {
	const institutions = $store.useFilterCategory('institutions')
	const disciplines = $store.useFilterCategory('disciplines')
	const physicalLocality = $store.useFilterCategory('physicalLocality')
	const fieldProfileCounty = $store.useFilterCategory('fieldProfileCounty')

	return (
		<div className="LeftSection">
			<div className="topRow">
				<FiltersSectionHeader />
				<ClearFiltersButton />
			</div>

			<FilterSection {...disciplines} />
			<FilterSection {...institutions} />
			<FilterSection {...physicalLocality} />
			<FilterSection {...fieldProfileCounty} />
		</div>
	)
}

const QueryInput = () => {
	const query = $store.use((state) => state.query)

	return (
		<input
			type="text"
			value={query}
			placeholder="Search"
			className="searchInput"
			onChange={(event) => $store.setQuery(event.target.value)}
		/>
	)
}

const SubmitButton = () => {
	return (
		<button className="submitButton" onClick={$store.search}>
			Go
		</button>
	)
}

const RightSection = () => {
	return (
		<div className="rightSection">
			<div className="searchBar">
				<QueryInput />
				<SubmitButton />
			</div>
			<PaginationRow />
			<SearchResults />
		</div>
	)
}

const PaginationRow = () => {
	const paginationState = $pagination.use()
	const storeState = $store.use()
	const counterHalf0 = `${paginationState.startIndex}-${paginationState.endIndex}`
	const counterHalf1 = `of ${paginationState.totalItems} results`

	if (!storeState.results.length) return null

	return (
		<div className="PaginationRow">
			<span className="resultsCounter">
				{counterHalf0} {counterHalf1}
			</span>
			<Pagination />
			<SortMethodSelect />
		</div>
	)
}

const SortMethodSelect = () => {
	const storeState = $store.use()

	return (
		<select
			className="sortSelect"
			value={storeState.sortMethod}
			onChange={(e) => $store.setSortMethod(e.target.value)}
		>
			{SORT_METHODS.map((method) => (
				<option key={method.value} value={method.value}>
					{method.label}
				</option>
			))}
		</select>
	)
}

const SearchResults = () => {
	const results = $store.use((state) => state.results)

	return (
		<div className="search-results">
			{results.map((result) => (
				<SearchResult key={result.id} {...result} />
			))}
		</div>
	)
}

const SearchResult = (props: SearchResultT) => {
	const placeholderImageUrl = 'https://via.placeholder.com/150'

	return (
		<div className="search-result">
			<div className="image-container">
				<img src={placeholderImageUrl} alt="title" />
			</div>
			<h4>placeholder</h4>
			<p>description</p>
		</div>
	)
}
