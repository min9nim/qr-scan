import React from 'react'
import './Layout.scoped.scss'
import { QrcodeOutlined } from '@ant-design/icons'
import { Alert } from 'antd'

export default function Layout({ children }) {
  return (
    <main>
      <div className="title">
        <QrcodeOutlined /> QR code scanner
      </div>
      {children}
    </main>
  )
}
