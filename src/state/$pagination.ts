import { create } from 'zustand'
import range from 'array-range'

type PaginationStateT = {
	totalPages: number
	totalItems: number
	currentPage: number
	pageSize: number
	startIndex: number
	endIndex: number
	isPreviousEnabled: boolean
	isNextEnabled: boolean
	startPage: number
	endPage: number
	pagesRange: number[]
}

type PartialStateT = Partial<PaginationStateT>

const usePaginationStore = create<PaginationStateT>(() => ({
	totalItems: 0,
	pageSize: 10,
	currentPage: 0,
	totalPages: 0,
	startIndex: 0,
	endIndex: 0,
	isPreviousEnabled: false,
	isNextEnabled: false,
	startPage: 0,
	endPage: 0,
	pagesRange: []
}))

const getOverrideState = (options: PartialStateT): PaginationStateT => {
	const currentState = $pagination.state
	const overriddenState = { ...currentState, ...options }
	return overriddenState
}

const getTotalPages = (options: PartialStateT): number => {
	const state = getOverrideState(options)
	const calculatedTotalPages = Math.ceil(state.totalItems / state.pageSize)
	return calculatedTotalPages
}

const getStartIndex = (): number => {
	const state = $pagination.state
	const calculatedStartIndex = state.pageSize * state.currentPage
	return calculatedStartIndex
}

const getEndIndex = (): number => {
	const state = $pagination.state
	const lastPageEndIndex = state.pageSize * (state.currentPage + 1)
	const calculatedEndIndex = Math.min(lastPageEndIndex, state.totalItems) - 1
	return calculatedEndIndex
}

const limitPageBounds = (options: PartialStateT): number => {
	const state = getOverrideState(options)
	const minimizedPageNumber = Math.min(state.currentPage, state.totalPages - 1)
	const boundedPageNumber = Math.max(0, minimizedPageNumber)
	return boundedPageNumber
}

const calculatePageRange = (currentPage: number, totalPages: number): [number, number, number[]] => {
	const startPage = Math.max(0, currentPage - 2)
	const endPage = Math.min(totalPages - 1, currentPage + 2)
	const pagesRange = range(startPage, endPage)
	return [startPage, endPage, pagesRange]
}

const setCurrentPage = (options: PartialStateT): void => {
	const state = getOverrideState(options)
	const currentPage = limitPageBounds(state)
	queueStateUpdate({ ...state, currentPage })
}

const setPageSize = (pageSize: number, nextPage: number | undefined): void => {
	const state = $pagination.state
	const newTotalPages = getTotalPages({ pageSize })
	const currentPage = nextPage ?? state.currentPage
	const options = { pageSize, currentPage, totalPages: newTotalPages }
	const newCurrentPage = limitPageBounds(options)
	queueStateUpdate({ ...state, ...options, currentPage: newCurrentPage })
}

const stepPage = (increment: number): void => {
	const state = $pagination.state
	const newCurrentPage = state.currentPage + increment
	const currentPage = limitPageBounds({ currentPage: newCurrentPage })
	queueStateUpdate({ ...state, currentPage })
}

const queueStateUpdate = (state: PaginationStateT): void => {
	const isPreviousEnabled = state.currentPage > 0
	const isNextEnabled = state.currentPage < state.totalPages - 1
	const [startPage, endPage, pagesRange] = calculatePageRange(state.currentPage, state.totalPages)
	$pagination.setState({ ...state, isPreviousEnabled, isNextEnabled, startPage, endPage, pagesRange })
}

const setTotalItems = (totalItems: number): void => {
	const state = getOverrideState({ totalItems })
	const totalPages = getTotalPages(state)
	const currentPage = limitPageBounds({ totalPages })
	queueStateUpdate({ ...state, totalItems, totalPages, currentPage })
}

const goToPageNumber = (pageNumber: number): void => {
	const state = getOverrideState({ currentPage: pageNumber })
	queueStateUpdate({ ...state, currentPage: pageNumber })
}

const goToPreviousPage = (): void => {
	stepPage(-1)
}

const goToNextPage = (): void => {
	stepPage(1)
}

const syncWithResponse = (data: AnyObjectT): void => {
	queueStateUpdate({
		...$pagination.state,
		totalItems: data.totalItems,
		totalPages: data.totalPages,
		currentPage: data.pageNumber
	})
}

type PaginationStoreT = {
	use: typeof usePaginationStore
	setState: typeof usePaginationStore.setState
	state: PaginationStateT
	syncWithResponse: typeof syncWithResponse
	setTotalItems: typeof setTotalItems
	setPageSize: typeof setPageSize
	setCurrentPage: typeof setCurrentPage
	goToPreviousPage: typeof goToPreviousPage
	goToNextPage: typeof goToNextPage
	goToPageNumber: typeof goToPageNumber
	queueStateUpdate: typeof queueStateUpdate
	getTotalPages: typeof getTotalPages
	getStartIndex: typeof getStartIndex
	getEndIndex: typeof getEndIndex
	getOverrideState: typeof getOverrideState
	limitPageBounds: typeof limitPageBounds
}

export const $pagination: PaginationStoreT = {
	use: usePaginationStore,
	setState: usePaginationStore.setState,
	syncWithResponse,
	setTotalItems,
	setPageSize,
	setCurrentPage,
	goToPreviousPage,
	goToNextPage,
	goToPageNumber,
	queueStateUpdate,
	getTotalPages,
	getStartIndex,
	getEndIndex,
	getOverrideState,
	limitPageBounds,
	get state() {
		return usePaginationStore.getState()
	}
}
