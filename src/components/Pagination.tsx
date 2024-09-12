import range from 'array-range'
import { $store } from '../state/$store'
import { $pagination } from '../state/$pagination'

const PageNumbers = () => {
	const paginationState = $pagination.use()
	const storeState = $store.use()

	return (
		<>
			{paginationState.pagesRange.map((page) => {
				const isActivePage = page === storeState.pageNumber
				const activePageClassName = isActivePage ? 'activePageButton' : ''
				const className = `paginationButton ${activePageClassName}`
				const handleClick = () => $store.goToPage(page)

				return (
					<button key={page} className={className} onClick={handleClick}>
						{page + 1}
					</button>
				)
			})}
		</>
	)
}

export const Pagination = () => {
	const paginationState = $pagination.use()

	return (
		<div className="Pagination">
			{paginationState.isPreviousEnabled && <PaginationArrowButton direction="backward" />}
			<PageNumbers />
			{paginationState.isNextEnabled && <PaginationArrowButton direction="forward" />}
		</div>
	)
}

type PaginationArrowButtonPropsT = {
	direction: string
}

const PaginationArrowButton = (props: PaginationArrowButtonPropsT) => {
	const label = props.direction === 'forward' ? '→' : '←'
	const goToNextPage = $pagination.goToNextPage
	const goToPreviousPage = $pagination.goToPreviousPage
	const handleClick = props.direction === 'forward' ? goToNextPage : goToPreviousPage

	return (
		<button className="paginationButton" onClick={handleClick}>
			{label}
		</button>
	)
}
