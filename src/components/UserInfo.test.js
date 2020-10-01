import { createHandleCheck } from './UserInfo.fn'

describe('UserInfo', () => {
  // test('등록된 사용자가 없으면 진행되지 않는다.', async () => {
  //   const notify = jest.fn()
  //   const validCode = jest.fn()
  //   const handleCheck = createHandleCheck({
  //     list: [],
  //     notify,
  //     validCode,
  //   })
  //
  //   await handleCheck()
  //
  //   expect(notify.mock.calls.length).toEqual(1)
  //   expect(validCode.mock.calls.length).toEqual(0)
  // })
  test('유효한 코드가 아니면 출석체크 불가.', async () => {
    const notify = jest.fn()
    const validCode = jest.fn().mockReturnValue({ result: false })
    const setLoading = jest.fn()
    const checkMany = jest.fn()
    const Swal = { fire: jest.fn() }
    const handleCheck = createHandleCheck({
      list: [{}],
      notify,
      validCode,
      setLoading,
      checkMany,
      Swal,
    })

    await handleCheck()

    expect(checkMany.mock.calls.length).toEqual(0)
    expect(Swal.fire.mock.calls[0][0].title).toEqual('Error')
  })
})
