import React from 'react'
import { render } from '@testing-library/react'
import { ContextStateProvider } from '../hooks/useContextState'
export * from '@testing-library/react'
import { useSearchState } from '../hooks/useSearchState'

const RenderMe = (props) => {
	const searchState = useSearchState()
	return <ContextStateProvider searchState={props.contextValue || searchState}>{props.children}</ContextStateProvider>
}

export const renderWithContext = (component, contextValue) => {
	return render(<RenderMe contextValue={contextValue}>{component}</RenderMe>)
}
