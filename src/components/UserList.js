import React, { useEffect } from 'react'
import './UserList.scoped.scss'
import { complement, filter, pipe, propEq, assocPath } from 'ramda'
import { Card, Checkbox } from 'antd'
import { setLocalList } from '../biz'

export default React.memo(function UserList({ list, setList, title }) {
  // const deleteUser = (no) => setList(filter(complement(propEq('no', no))))
  const deleteUser = pipe(propEq('no'), complement, filter, setList)
  useEffect(() => {
    setLocalList(list)
  }, [list])
  const handleCheck = (idx) => (e) => {
    setList(pipe(assocPath([idx, 'checked'], e.target.checked)))
  }
  return (
    <div className="userList">
      <Card title={title} bordered={true}>
        <ul>
          {list.length ? (
            list.map(({ name, no, checked }, idx) => (
              <li key={idx}>
                <div className="checkbox">
                  <Checkbox checked={checked} onChange={handleCheck(idx)}/>
                </div>
                <div className="name">{name}</div>
                <div className="delete-btn" onClick={() => deleteUser(no)}>
                  <span className='icon'>🗑</span>️ 삭제
                </div>
              </li>
            ))
          ) : (
            <li>
              👉 먼저 아래 "참석자 명단 추가하기"에서 참석자 이름을 입력하여
              추가한 후 출석체크를 눌러주세요.
            </li>
          )}
        </ul>
      </Card>
    </div>
  )
})
