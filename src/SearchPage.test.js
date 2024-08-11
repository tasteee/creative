import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createMockResults } from './mocks'
import SearchPage from './SearchPage'

const results0 = createMockResults(123)

test('<SearchPage />', async ({ page }) => {
	render(<SearchPage results={results0} />)
})
