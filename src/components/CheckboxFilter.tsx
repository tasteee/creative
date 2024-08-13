import { FILTER_LABELS } from '../consts'

type CheckboxFilterPropsT = {
	value: boolean
	filterKey: string
	toggle: (key: string) => void
}

export const CheckboxFilter = (props: CheckboxFilterPropsT) => {
	const filterKey = props.filterKey as keyof typeof FILTER_LABELS
	const label = FILTER_LABELS[filterKey]

	const toggleFilter = () => {
		props.toggle(filterKey)
	}

	return (
		<div className="CheckboxFilter" data-testid="CheckboxFilter">
			<input
				type="checkbox"
				role="checkbox"
				id={filterKey}
				data-testid={filterKey}
				checked={props.value}
				onChange={toggleFilter}
			/>
			<label htmlFor={filterKey} style={{ color: props.value ? '#3fa9f5' : 'inherit' }}>
				{label}
			</label>
		</div>
	)
}
