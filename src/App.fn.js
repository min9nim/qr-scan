import { go } from 'mingutils'
import { always, identity, ifElse } from 'ramda'

export const getLocalUser = () =>
  go(
    localStorage.getItem('user'),
    ifElse(identity, str => JSON.parse(str), always(null)),
  )


export const getLocalList = () =>
  go(
    localStorage.getItem('list'),
    ifElse(identity, str => JSON.parse(str), always([])),
  )
