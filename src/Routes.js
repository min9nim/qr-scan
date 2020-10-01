import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.scss'
import Loading from './components/Loading'
import 'antd/dist/antd.css'
import DynamicRoute from 'react-dynamic-route'
import Index from './pages/index'

export default function Routes({ list, setList }) {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/:church"
          render={props => <Index {...props} list={list} setList={setList} />}
        />
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
      </Switch>
    </BrowserRouter>
  )
}
