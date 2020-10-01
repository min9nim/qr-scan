import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import './Loading.scss'

export default function Loading() {
  return (
    <>
      <div className="modal_div" />
      <div className="Loading">
        <LoadingOutlined style={{ fontSize: '100px', color: '#fff' }} />
      </div>
    </>
  )
}
