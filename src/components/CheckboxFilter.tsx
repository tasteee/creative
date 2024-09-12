import { $store } from '../state/$store'

type CheckboxFilterPropsT = FilterT

export const CheckboxFilter = (props: CheckboxFilterPropsT) => {
	// just subscribing to the filter. but we already have the data via props.
	$store.useFilter(props.category, props.id)

	const toggleFilter = () => {
		$store.toggleFilter(props.category)(props.id)
	}

	return (
		<div className="CheckboxFilter" data-testid="CheckboxFilter">
			<input
				type="checkbox"
				role="checkbox"
				id={props.id}
				data-testid={props.id}
				checked={props.value}
				onChange={toggleFilter}
			/>
			<label htmlFor={props.id} style={{ color: props.value ? '#3fa9f5' : 'inherit' }}>
				{props.label}
			</label>
		</div>
	)
}
