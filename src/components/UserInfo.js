import React, { useEffect, useState } from 'react'
import { AutoComplete, Button, Form } from 'antd'
import { head, split, trim } from 'ramda'
import { go } from 'mingutils'
import UserList from './UserList'
import { checkMany } from './QRScan.fn'
import { notify, parseCode, playAudio, userWithMeta } from '../biz'
import { UserAddOutlined } from '@ant-design/icons'
import Swal from 'sweetalert2'
import { useLoading } from 'react-hook-loading'
import {
  createHandleAdd,
  createHandleCheck,
  createOnSearch,
} from './UserInfo.fn'
import './UserInfo.scoped.scss'
import useUsers from '../swrs/useUsers'

export default function UserInfo({ list, setList, code }) {
  const [form] = Form.useForm()
  const [, setLoading] = useLoading()
  const [options, setOptions] = useState([])
  const [users, usersLoaded] = useUsers()
  const { title, begin } = parseCode(code)
  const handleAdd = createHandleAdd({
    form,
    users,
    list,
    setList,
    notify,
    setOptions,
  })
  const onSearch = createOnSearch({ setOptions, users })
  const handleCheck = createHandleCheck({
    code,
    Swal,
    checkMany,
    notify,
    playAudio,
    list,
    setLoading,
  })
  const onSelect = data => {
    window.$logger.debug('onSelect event..', data)
    form.setFieldsValue({ name: go(data, split('-'), head, trim) })
  }

  useEffect(() => {
    if (usersLoaded) {
      setOptions(users.map(userWithMeta))
    }
  }, [usersLoaded, users])

  return (
    <section className="userInfo">
      <Form
        form={form}
        labelCol={{ span: 4 }}
        name="basic"
        onFinish={handleAdd}
        onFinishFailed={errorInfo => {
          window.$logger.error('Failed:', errorInfo)
        }}
      >
        <UserList
          list={list}
          setList={setList}
          title={
            <div className="title">
              <span>{title}</span>
              <sup>{begin.format('M월 D일 dd')}</sup>
            </div>
          }
        />
        {list.length > 0 && (
          <div className="button">
            <Form.Item className="button">
              <Button type="primary" onClick={handleCheck}>
                ✔ 출석 체크
              </Button>
            </Form.Item>
          </div>
        )}
        <hr />

        <Form.Item
          className="name"
          label="참석자 명단 추가하기"
          name="name"
          rules={[
            {
              required: true,
              message: '이름을 입력하세요',
            },
          ]}
        >
          <AutoComplete
            options={options}
            onSearch={onSearch}
            onSelect={onSelect}
            placeholder="이름입력"
          />
        </Form.Item>
        <div className="button">
          <Form.Item className="button">
            <Button type="primary" htmlType="submit">
              <UserAddOutlined /> 추가
            </Button>
          </Form.Item>
        </div>
      </Form>
    </section>
  )
}
