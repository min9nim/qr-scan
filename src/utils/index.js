import moment from 'moment'
import { parseCode } from '../biz'

export const validCode = code => {
  if (!code) {
    return { result: false, message: 'Not found code' }
  }
  if (!/^.+-\d{6}-\d{4}-\d{4}$/.test(code)) {
    return { result: false, message: 'Not a valid format' }
  }
  return timeOutCode(code)
}

export const timeOutCode = code => {
  const { begin, end } = parseCode(code)
  const now = moment()
  if (now.diff(begin) < 0) {
    return { result: false, message: 'Not started yet' }
  }
  if (end.diff(now) < 0) {
    return { result: false, message: 'Expired code' }
  }
  return { result: true }
}
