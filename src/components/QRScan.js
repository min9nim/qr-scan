import React, { useEffect, useState } from 'react'
import './QRScan.scss'
import { checkPermission, createTick, enableCamera } from './QRScan.fn'
import { useHistory } from 'react-router'
import { getQueryParams } from 'mingutils'
import Scanner from './Scanner'
import CameraNotUsable from './CameraNotUsable'

export default function QRScan({ list }) {
  const [message, setMessage] = useState('⌛ No QR code detected')
  const [video, setVideo] = useState(null)
  const history = useHistory()
  const { code } = getQueryParams(window.location.href)

  window.$logger.debug('xxx', list)

  useEffect(() => {
    enableCamera({list, setVideo})
    checkPermission({list, code})
  }, [])

  if(navigator.userAgent.includes('KAKAOTALK')){
    return <div>카카오톡에서는 사용할 수 없습니다. 크롬 브라우져를 이용해 접속해 주세요.😊</div>
  }

  if (!video) {
    return <CameraNotUsable/>
  }

  return (
    <>
      <Scanner
        video={video}
        tick={createTick({
          setMessage,
          history,
        })}
      />
      <div>{message}</div>
    </>
  )
}
