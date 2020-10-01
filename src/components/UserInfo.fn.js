import { go, peek } from 'mingutils'
import {
  append,
  find,
  head,
  isEmpty,
  omit,
  pipe,
  prop,
  propEq,
  split,
  assoc,
} from 'ramda'
import { debounce } from 'interval-call'
import { userWithMeta } from '../biz'
import { validCode } from '../utils'

export const createHandleAdd = ({
  form,
  users,
  list,
  setList,
  notify,
  setOptions,
}) => () => {
  const { name } = form.getFieldsValue()
  const user = go(
    users,
    find(propEq('name', name)),
    peek('여기'),
    // omit(['createdAt', 'updatedAt', '__v', '_id']),
  )
  if (!user) {
    notify('교회에 등록된 이름이 아닙니다.')
    return
  }

  if (list.some(propEq('name', name))) {
    notify('이미 사용자로 등록된 이름입니다.')
    return
  }

  go(
    list,
    pipe(append(assoc('checked', true, user)), list => {
      // setLocalList(list)
      setList(list)
      form.setFieldsValue({ name: '' })
    }),
  )

  // 사용자 추가하고 나면 전체목록을 세팅
  setOptions(users.map(userWithMeta))
}

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $&는 일치한 전체 문자열을 의미합니다.
}

export const createOnSearch = ({ setOptions, users }) =>
  debounce(text => {
    setOptions(
      users
        .filter(user => {
          const reg = new RegExp(escapeRegExp(text) || '.+')
          return reg.test(user.name)
        })
        .map(userWithMeta),
    )
  }, 200)

export const createHandleCheck = ({
  code,
  Swal,
  checkMany,
  notify,
  playAudio,
  list,
  setLoading,
}) => async () => {
  // if (list.length === 0) {
  //   notify('출석체크 사용자를 등록해 주세요')
  //   return
  // }
  const { result, message } = validCode(code)
  if (!result) {
    Swal.fire({
      title: 'Error',
      text: '유효한 코드가 아닙니다(' + message + ')',
      icon: 'error',
      confirmButtonText: 'OK!',
    })
    return
  }

  const checkedList = list.filter(propEq('checked', true))
  if (isEmpty(checkedList)) {
    notify('출석체크 대상자를 선택해 주세요.')
    return
  }

  try {
    setLoading(true)
    await checkMany(code, checkedList)
    Swal.fire({
      title: go(code, split('-'), head),
      text: checkedList.map(prop('name')).join(', ') + '님 환영합니다.',
      icon: 'success',
      confirmButtonText: 'OK!',
    })
    playAudio()
  } catch (e) {
    notify(e.message)
  } finally {
    setLoading(false)
  }
}
