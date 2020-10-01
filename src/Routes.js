import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.scss'
import Loading from './components/Loading'
import 'antd/dist/antd.css'
import DynamicRoute from 'react-dynamic-route'

export default function Routes({ list, setList }) {
  return (
    <BrowserRouter>
      <DynamicRoute
        page={path => {
          window.$logger.info('DynamicRoute', path)
          return import('./pages' + path).then(module => module.default)
        }}
        loading={<Loading />}
        props={{
          list,
          setList,
        }}
      />
    </BrowserRouter>
  )
}
