import React from 'react'
import './Layout.scoped.scss'
import { QrcodeOutlined } from '@ant-design/icons'
import { Alert } from 'antd'

export default function Layout({ children }) {
  return (
    <main>
      <pwa-install showopen>
        <Alert
          message="이 사이트를 앱으로 설치해 보세요. 👉 여기 클릭!"
          type="warning"
          showIcon
        />
      </pwa-install>
      <div className="title">
        <QrcodeOutlined /> QR code scan
      </div>
      {children}
    </main>
  )
}
