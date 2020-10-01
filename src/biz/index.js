import { notification } from 'antd'
import intervalCall from 'interval-call'
import { getQueryParams, go } from 'mingutils'
import {
  identity,
  pipe,
  prop,
  when,
  split,
  head,
  ifElse,
  startsWith,
  always,
  replace,
} from 'ramda'
import moment from 'moment'

export const setLocalList = list =>
  localStorage.setItem('list', JSON.stringify(list))

export const userWithMeta = user => ({
  key: user.no,
  value: user.name + userMeta(user.group),
})

export const userMeta = group => {
  if (!group) {
    return ''
  }
  const { group1, group2, group3, leader } = group
  return (
    dashPrefix(group1) +
    dashPrefix(group2) +
    dashPrefix(group3) +
    dashPrefix(leader)
  )
}

export const dashPrefix = str => (str ? ' - ' + str : '')

export const notify = intervalCall(2000)(message =>
  notification.warning({
    message,
    // description: message,
    // icon: '😨',
  }),
)

export const playAudio = () => new Audio('/ring.mp3').play()

export const getCode = url =>
  go(url, getQueryParams, prop('code'), when(identity, decodeURI))

export const errorDesc = {
  'Not found code': '전달된 QR코드 값이 없습니다.',
  'Not started yet': '아직 예배 시작 전입니다!',
  'Expired code': '예배 시간이 종료되었습니다!',
  'Not a valid format': '정상적인 QR코드가 아닙니다!',
}

export const parseCode = code => {
  if (!code) {
    return {
      titie: 'Not found code',
    }
  }
  const [title, YYMMDD, time1, time2] = code.split('-')
  const begin = moment(YYMMDD + time1, 'YYMMDDHHmm')
  const end = moment(YYMMDD + time2, 'YYMMDDHHmm')
  return {
    title,
    begin,
    end,
  }
}

export const churchName = ifElse(
  startsWith('localhost'),
  always(null),
  pipe(split('.'), head, replace('-admin', ''), replace('-dev', '')),
)

export const churchId = () => {
  const queryChurch = getQueryParams(window.location.href).church
  const pathChurch = window.location.pathname.slice(1)
  const envChurch = process.env.REACT_APP_CHURCH
  return queryChurch || pathChurch || envChurch
}
