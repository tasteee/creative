import React, { createContext, useContext, ReactNode, Context as ReactContext } from 'react'

type UseCreator<T> = (props: any) => T

interface ProviderProps {
	children: ReactNode
	[key: string]: any
}

export const createContextHook = <T,>(
	useCreator: UseCreator<T>
): [React.FC<ProviderProps>, () => T, ReactContext<T | null>] => {
	const Context = createContext<T | null>(null)

	const Provider: React.FC<ProviderProps> = ({ children, ...props }) => {
		const store = useCreator(props)
		return <Context.Provider value={store}>{children}</Context.Provider>
	}

	const useStore = (): T => {
		return useContext(Context) as T
	}

	return [Provider, useStore, Context]
}
