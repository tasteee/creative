import { faker } from '@faker-js/faker'
import range from 'array-range'
import wait from 'wait'

export const createMockResult = () => {
	return {
		image: faker.image.url(),
		title: faker.lorem.words({ min: 2, max: 4 }),
		description: faker.lorem.paragraph({ min: 2, max: 5 })
	}
}

// Create X number of mock results.
export const createMockResults = (count: number) => {
	return range(count).map(() => createMockResult())
}

const splitResultsIntoPages = (results: SearchResultT[]) => {
	const totalPages = Math.ceil(results.length / 12)
	const resultsPages = range(totalPages).map(() => []) as SearchResultT[][]

	results.forEach((result, index) => {
		const page = Math.floor(index / 12)
		resultsPages[page].push(result)
	})

	return resultsPages
}

type PersistenceT = {
	page: number
	resultsPages: SearchResultT[][]
	results: SearchResultT[]
	totalItems: number
	totalPages: number
	currentPage: number
}

const persistence: PersistenceT = {
	page: -1,
	resultsPages: [],
	results: [],
	totalItems: 0,
	totalPages: 0,
	currentPage: 0
}

export const getMockSearchResults = async (options: SearchOptionsT) => {
	const optionsWithPreviousPage = { ...options, page: persistence.page }
	const stringifiedOptions = JSON.stringify(options)
	const stingifiedPreviousOptions = JSON.stringify(optionsWithPreviousPage)
	const didOnlyPageChange = stringifiedOptions === stingifiedPreviousOptions

	if (didOnlyPageChange) {
		const newPageNumber = (persistence.page = options.page)
		const results = persistence.resultsPages[newPageNumber]
		await wait(1000)

		return {
			results,
			totalItems: persistence.totalItems,
			totalPages: persistence.totalPages,
			currentPage: newPageNumber
		}
	}

	// Simulate a slow PHP ass server lmao
	const responseDelay = faker.number.int({ min: 700, max: 2300 })
	const numberOfResults = faker.number.int({ min: 88, max: 100 })
	await wait(responseDelay)

	const results = (persistence.results = createMockResults(numberOfResults))
	persistence.resultsPages = splitResultsIntoPages(results)
	const totalItems = (persistence.totalItems = results.length)
	const totalPages = (persistence.totalPages = persistence.resultsPages.length)
	const currentPage = (persistence.currentPage = 1)

	return {
		results,
		totalPages,
		totalItems,
		currentPage
	}
}

export const mockResults = [
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult(),
	createMockResult()
]
