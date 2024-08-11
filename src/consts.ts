export const FILTER_LABELS = {
	appliedVisualArts: 'Applied & Visual Arts',
	musicAndPerforming: 'Music & Performing Arts',
	filmAndMultimedia: 'Film & Multimedia Arts',
	historyAndPreservation: 'History & Preservation',
	foodAndCulinary: 'Food & Culinary Arts',
	writtenAndPublished: 'Written & Published Works',
	creationProduction: 'Creation / Production',
	distributionCreative: 'Distribution (Creative Entity)',
	distributionRelated: 'Distribution (Related Entity)',
	institutionsTraining: 'Institutions / Training',
	supportCreative: 'Support (Creative Entity)',
	supportRelated: 'Support (Related Entity)'
}

export const INITIAL_FILTERS = {
	disciplines: {
		musicAndPerforming: false,
		appliedVisualArts: false,
		filmAndMultimedia: false,
		historyAndPreservation: false,
		foodAndCulinary: false,
		writtenAndPublished: false
	},

	institutions: {
		creationProduction: false,
		distributionCreative: false,
		distributionRelated: false,
		institutionsTraining: false,
		supportCreative: false,
		supportRelated: false
	},

	// TODO: Determine what filters will be under city.
	// TODO: Determine what filters will be under county.
	city: {},
	county: {}
}

export const SORT_METHODS = [
	{ value: 'relevance', label: 'Relevance' },
	{ value: 'alphabetical', label: 'Alphabetical' },
	{ value: 'newest', label: 'Newest' }
]
