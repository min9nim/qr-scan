import req from '../utils/req'
import jsQR from 'jsqr'
import { validCode } from '../utils'
import { mediaPolyfill } from '../utils/mediaPolyfill'
import { getQueryParams } from 'mingutils'
import { churchId, notify } from '../biz'

export async function checkMany(code, list) {
  await req.post('/api/check-many', {
    church: churchId(),
    meetingId: code,
    list,
  })
}

export function createDrawLine(canvas) {
  return (begin, end, color) => {
    canvas.beginPath()
    canvas.moveTo(begin.x, begin.y)
    canvas.lineTo(end.x, end.y)
    canvas.lineWidth = 4
    canvas.strokeStyle = color
    canvas.stroke()
  }
}

export async function videoOn() {
  mediaPolyfill()
  const video = document.createElement('video')

  // Use facingMode: environment to attemt to get the front camera on phones
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment', width: 400, height: 400 },
  })
  video.srcObject = stream
  video.setAttribute('playsinline', 'true') // required to tell iOS safari we don't want fullscreen
  video.play()
  return video
}

export function videoOff(video) {
  if (!video?.srcObject) {
    return
  }
  video.pause()
  video.srcObject.getTracks()[0].stop()
  video.srcObject = null
  console.log('Video off')
}

export function createDrawRectangle(canvas) {
  const drawLine = createDrawLine(canvas)
  return code => {
    drawLine(
      code.location.topLeftCorner,
      code.location.topRightCorner,
      '#FF3B58',
    )
    drawLine(
      code.location.topRightCorner,
      code.location.bottomRightCorner,
      '#FF3B58',
    )
    drawLine(
      code.location.bottomRightCorner,
      code.location.bottomLeftCorner,
      '#FF3B58',
    )
    drawLine(
      code.location.bottomLeftCorner,
      code.location.topLeftCorner,
      '#FF3B58',
    )
  }
}

export function createTick({ setMessage, history }) {
  return function tick({ canvasElement, video }) {
    const canvas = canvasElement.getContext('2d')
    const drawRectangle = createDrawRectangle(canvas)
    console.log('tick')
    if (!video.srcObject) {
      return
    }

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(() => tick({ canvasElement, video }))
      return
    }

    // canvasElement.height = video.videoHeight
    // canvasElement.width = video.videoWidth
    const size = document.body.clientWidth
    canvasElement.height = size
    canvasElement.width = size

    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height)
    const imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height,
    )
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    })
    if (!code) {
      requestAnimationFrame(() => tick({ canvasElement, video }))
      return
    }
    drawRectangle(code)
    setMessage(code.data)
    if (!code.data.startsWith('http')) {
      // 주소값이 아니면 스캐닝 계속
      notify('유효한 코드가 아닙니다(Not a link)')
      requestAnimationFrame(() => tick({ canvasElement, video }))
      return
    }
    // console.log('getQueryParams(code.data)', getQueryParams(code.data))

    const codeValue = getQueryParams(code.data).code
    const { result, message } = validCode(codeValue)
    if (!codeValue || !result) {
      notify('유효한 코드가 아닙니다(' + message + ')')
      // 주소값은 맞는데 code 가 포함되어 있지 않으면 계속 스캐닝
      requestAnimationFrame(() => tick({ canvasElement, video }))
      return
    }
    videoOff(video)
    history.push('/?code=' + codeValue)
  }
}

export function checkPermission({ list, code }) {
  if (!list || validCode(code).result) {
    return
  }
  if (!navigator.permissions) {
    // notify('navigator.permissions is undefined')
    // throw Error('navigator.permissions is undefined')
    return
  }
  navigator.permissions
    .query({ name: 'camera' })
    .then(permissionObj => {
      if (permissionObj.state === 'denied') {
        notify('카메라 사용권한을 승인해 주세요')
        // Modal.warn({
        //   title: '사용권한 필요',
        //   content: '카메라 사용권한을 승인해 주세요',
        // })
      }
    })
    .catch(error => {
      window.$logger.debug('user22', list.join(','))
      req.post('/api/report-error', {
        message: error.message,
        user: list.join(','), // list.map(path(['name'])).join(','),
        userAgent: navigator.userAgent,
        location: '[QRScan.fn.js] permission check',
      })
      console.error(error)
      throw Error(error)
    })
}

export function enableCamera({ list, setVideo }) {
  videoOn()
    .then(video => {
      setVideo(video)
    })
    .catch(e => {
      req.post('/api/report-error', {
        message: e.message,
        user: list.join(','), // list.map(path(['name'])).join(','),
        userAgent: navigator.userAgent,
        location: '[QRScan.fn.js] useCamera',
      })
      console.error(e)
      notify(e.message)
      throw e
    })
}
