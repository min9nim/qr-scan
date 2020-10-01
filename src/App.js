import React from 'react'
import { LoadingProvider } from 'react-hook-loading'
import Loading from './components/Loading'
import Routes from './Routes'
import 'antd/dist/antd.css'
import './App.scss'

export default function App() {
  return (
    <LoadingProvider loading={<Loading />}>
      <Routes/>
    </LoadingProvider>
  )
}
