import React, { useEffect, useState } from 'react'
import req from '../utils/req'
import { prop } from 'ramda'
import { useLoading } from 'react-hook-loading'
import { notify } from '../biz'

export const UserContext = React.createContext([])

export default function UsersContextProvider({ children }) {
  const [, setLoading] = useLoading()
  const [users, setUsers] = useState([])
  window.$logger.info('users', users)

  useEffect(() => {
    setLoading(true)
    req('/api/users')
      .then(prop('result'))
      .then(setUsers)
      .then(() => setLoading(false))
      .catch(() => {
        notify('사용자 목록 불러오기 오류. 새로고침 해보세요 🙂')
        setLoading(false)
      })
  }, [])

  return <UserContext.Provider value={users}>{children}</UserContext.Provider>
}
