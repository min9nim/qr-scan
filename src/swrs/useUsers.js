import useSWR from 'swr'
import req from '../utils/req'
import { churchId } from '../biz'

export default () => {
  const { data, error, isValidating, mutate } = useSWR(
    '/api/users?church=' + churchId(),
    req.get,
    { revalidateOnFocus: false },
  )
  return [
    data?.result || [],
    Boolean(data || error),
    isValidating,
    mutate,
    error,
  ]
}
