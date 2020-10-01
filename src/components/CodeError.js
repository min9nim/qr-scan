import React from 'react'
import { validCode } from '../utils'
import './CodeError.scoped.scss'
import { errorDesc, parseCode } from '../biz'

export default ({ code }) => {
  const { title, begin, end } = parseCode(code)
  const { message } = validCode(code)

  return (
    <div className="codeError">
      <div className="header">
        <span className="title">{title}</span>
        {begin && <sup>{begin.format('M월 D일 dd')}</sup>}
      </div>
      <div className="desc">{errorDesc[message]}</div>
      {begin && end && (
        <div className="time">
          👉 출석체크 가능시간: {begin.format('HH:mm ')} ~ {end.format('HH:mm')}
        </div>
      )}
    </div>
  )
}
