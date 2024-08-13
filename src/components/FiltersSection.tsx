import { useState } from 'react'
import { CheckboxFilter } from './CheckboxFilter'
import { ChevronUpIcon } from '@radix-ui/react-icons'
import isEmpty from 'just-is-empty'

type FilterSectionPropsT = {
	id: string
	title: string
	filters: AnyObjectT
	handleChange: (key: string) => void
}

export const FilterSection = (props: FilterSectionPropsT) => {
	const areFiltersEmpty = isEmpty(props.filters)
	const [isExpanded, setIsExpanded] = useState(!areFiltersEmpty)
	const filtersEntries = Object.entries(props.filters)

	return (
		<div className="FilterSection" data-testid="FiltersSection">
			<h3 className="FilterSectionHeader" onClick={() => setIsExpanded(!isExpanded)}>
				{props.title}
				<ChevronUpIcon
					className="filterSectionChevron"
					style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
				/>
			</h3>

			{!areFiltersEmpty && isExpanded && (
				<div className="FilterSectionBody">
					{filtersEntries.map((entry: [string, boolean]) => (
						<CheckboxFilter key={entry[0]} value={entry[1]} filterKey={entry[0]} toggle={props.handleChange} />
					))}
				</div>
			)}
		</div>
	)
}
