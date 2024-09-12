import { useState } from 'react'
import { CheckboxFilter } from './CheckboxFilter'
import { ChevronUpIcon } from '@radix-ui/react-icons'
import isEmpty from 'just-is-empty'
import { $store } from '../state/$store'

type FilterSectionPropsT = FilterCategoryT

type FilterSectionHeaderPropsT = {
	title: string
	isExpanded: boolean
	handleClick: () => void
}

const FilterSectionHeader = (props: FilterSectionHeaderPropsT) => {
	const iconStyle = { transform: props.isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }

	return (
		<h3 className="FilterSectionHeader" onClick={props.handleClick}>
			{props.title}
			<ChevronUpIcon className="filterSectionChevron" style={iconStyle} />
		</h3>
	)
}

export const FilterSection = (props: FilterSectionPropsT) => {
	const areFiltersEmpty = isEmpty(props.filters)
	const filtersEntries = Object.entries(props.filters)
	const [isExpanded, setIsExpanded] = useState(!areFiltersEmpty)
	const shouldRenderCheckboxes = !areFiltersEmpty && isExpanded

	const handleClick = () => {
		setIsExpanded(!isExpanded)
	}

	return (
		<div className="FilterSection" data-testid="FiltersSection">
			<FilterSectionHeader title={props.label} isExpanded={isExpanded} handleClick={handleClick} />

			{shouldRenderCheckboxes && (
				<div className="FilterSectionBody">
					{filtersEntries.map((entry) => (
						<CheckboxFilter key={entry[0]} {...entry[1]} />
					))}
				</div>
			)}
		</div>
	)
}
