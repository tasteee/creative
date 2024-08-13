import './dev.css'
import './index.css'

import ReactDOM from 'react-dom/client'
import { SearchPage } from './components/SearchPage.tsx'
import { useSearchState } from './components/hooks/useSearchState'

const Demo = () => {
	const searchState = useSearchState()
	return <SearchPage {...searchState} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Demo />)
