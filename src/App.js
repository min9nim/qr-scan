import React from 'react'
import { LoadingProvider } from 'react-hook-loading'
import Loading from './components/Loading'
import Routes from './Routes'
import 'antd/dist/antd.css'
import './App.scss'
import { Alert } from 'antd'

export default function App() {
  return (
    <LoadingProvider loading={<Loading />}>
      <pwa-install showopen>
        <Alert
          message="이 사이트를 앱으로 설치해 보세요. 👉 여기 클릭!"
          type="warning"
          showIcon
        />
      </pwa-install>
      <Routes />
    </LoadingProvider>
  )
}
