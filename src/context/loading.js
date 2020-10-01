import React, { useReducer } from 'react'
import Loading from '../components/Loading'

export const LoadingContext = React.createContext()

function reducer(state, action) {
  switch (action.type) {
    case 'BEGIN':
      return { count: state.count + 1 }
    case 'END':
      return { count: state.count - 1 }
    default:
      throw new Error('Not supported action')
  }
}

export default function LoadingContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  const value = {
    loading: Boolean(state.count),
    setLoading: start => {
      window.$logger.debug('setLoading', start)
      dispatch({ type: start ? 'BEGIN' : 'END' })
    },
  }
  const Memo = React.memo(() => children)

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <Loading loading={value.loading} />
    </LoadingContext.Provider>
  )
}
