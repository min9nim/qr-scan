import React from 'react'
import './Layout.scoped.scss'
import { QrcodeOutlined } from '@ant-design/icons'

export default function Layout({ children }) {
  return (
    <main>
      <div className="title"><QrcodeOutlined /> QR code scan</div>
      {children}
    </main>
  )
}
