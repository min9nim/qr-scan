import { notification } from 'antd'
import intervalCall from 'interval-call'

export const notify = intervalCall(2000)(message =>
  notification.warning({
    message,
    // description: message,
    // icon: '😨',
  }),
)
