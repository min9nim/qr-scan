import createLogger, { simpleFormat } from 'if-logger'
import moment from 'moment'
import 'moment/locale/ko'  // without this line it didn't work

moment.locale('ko')

export default createLogger({
  format: simpleFormat,
  tags: [() => moment().utc().add(9, 'hours').format('MM/DD HH:mm:ss')],
})
