import useSWR from 'swr'
import req from '../utils/req'
import { churchId } from '../biz'

export default () => {
  const { data, error, isValidating } = useSWR(
    '/api/setting?church=' + churchId(),
    req.get,
    { revalidateOnFocus: false },
  )
  return [data?.result?.church, Boolean(data || error), isValidating]
}
