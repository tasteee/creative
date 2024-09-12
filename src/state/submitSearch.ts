const IS_DEV = import.meta.env.DEV
const PROD_API_URL = import.meta.env.VITE_API_BASE_URL
const DEV_API_URL = import.meta.env.VITE_DEV_API_BASE_URL
const API_URL = IS_DEV ? DEV_API_URL : PROD_API_URL
const API_TOKEN = import.meta.env.VITE_API_KEY

console.log({
	API_URL,
	API_TOKEN,
	IS_DEV,
	PROD_API_URL,
	DEV_API_URL
})

const headers = {
	Authorization: API_TOKEN,
	Accept: 'application/json'
	// ContentType: 'application/vnd.api+json',
	// UserAgent: 'CG_API_[PartnerName]/[version]',
}

const applyPageNumber = (state: AnyObjectT, parameters: URLSearchParams): void => {
	if (state.pageNumber) {
		parameters.append('page[offset]', ((state.pageNumber - 1) * 50).toString())
		parameters.append('page[limit]', '50')
	}
}

const buildParameters = (state: AnyObjectT): string => {
	const parameters = new URLSearchParams()
	const filterCategories = state.filterCategories
	state.query && parameters.append('filter[fulltext]', state.query)
	state.sortMethod && parameters.append('sort', state.sortMethod)
	applyPageNumber(state, parameters)

	for (const categoryKey in filterCategories) {
		const _categoryKey = categoryKey as keyof FilterCategoriesT
		const category = filterCategories[_categoryKey] as AnyObjectT

		console.log({ category })
	}

	// Object.entries(state.filterCategories).forEach(([key, value]) => {
	//   parameters.append(`filter[${key}][condition][path]`, value.path)
	//   parameters.append(`filter[${key}][condition][operator]`, value.operator)
	//   if (Array.isArray(value.value)) {
	//     value.value.forEach((v: string) => {
	//       parameters.append(`filter[${key}][condition][value][]`, v)
	//     })
	//   } else {
	//     parameters.append(`filter[${key}][condition][value]`, value.value)
	//   }
	// })

	parameters.append(
		'fields[node--profile]',
		'title,body,path,field_physical_address,field_geolocation_data,field_profile_image,field_institution_business_type,field_primary_discipline'
	)

	parameters.append(
		'include',
		'field_profile_image.field_profile_media.field_media_image,field_profile_image.field_profile_media.field_thumbnail_image,field_institution_business_type,field_primary_discipline'
	)

	return parameters.toString()
}

// const url = `${API_URL}/jsonapi/index/profile-search?${parameters}`
export const submitSearch = async (state: AnyObjectT): Promise<any> => {
	const parameters = buildParameters(state)
	const url = `${API_URL}${parameters}`

	console.log({ url })
	console.log({ parameters })

	const response = await fetch(url, {
		headers,
		method: 'GET',
		mode: 'cors'
	})

	const result = await response.json()
	const data = result.data
	const meta = result.meta
	const totalPages = Math.ceil(meta.count / 50)

	return {
		data,
		meta,
		totalPages,
		totalItems: meta.count,
		pageNumber: state.pageNumber
	}
}
