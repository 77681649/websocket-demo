'use strict'
const EVENT_USER_ENTER = 'user enter'
const EVENT_USER_LEAVE = 'user leave'
const EVENT_CHART_MESSAGE = 'chat message'
const KEY_ENTER = 13

const $ = selector => {
  return document.querySelectorAll(selector)
}

$.ready = fn => {
  document.addEventListener('DOMContentLoaded', fn)
}

$.ready(function () {
  const $input = $('#input')[0]
  const $submit = $('#submit')[0]
  const $charts = $('#charts')[0]
  const socket = io()
  const nickname = window.prompt('请输入昵称', '请输入昵称')

  function sendMessage() {
    const message = $input.value

    socket.emit(EVENT_CHART_MESSAGE, { nickname, message })

    $input.value = ''
  }

  function appendUserEnterMessage(resp) {
    function render(li, { nickname, message }) {
      li.innerText = `Welcome to [${nickname}] !!!`

      return li
    }

    return appendChatList(resp, render)
  }

  function appendUserLeaveMessage(resp) {
    function render(li, { nickname, message }) {
      li.innerText = `Goodbye [${nickname}] !!!`

      return li
    }

    return appendChatList(resp, render)
  }

  function appendChartMessage(resp) {
    function render(li, { nickname, message }) {
      li.innerText = `[${nickname}]: ${message}`

      return li
    }

    return appendChatList(resp, render)
  }

  function appendChatList(resp, render) {
    function createChart(resp) {
      const li = document.createElement('LI')

      return render(li, resp)
    }

    if (resp.errcode === 0) {
      charts.appendChild(createChart(resp.data))
    }
  }

  $submit.addEventListener('click', sendMessage)
  $input.addEventListener('keypress', function (event) {
    if (event.charCode === KEY_ENTER) {
      sendMessage()
    }
  })

  socket.on(EVENT_USER_ENTER, appendUserEnterMessage)
  socket.on(EVENT_CHART_MESSAGE, appendChartMessage)
  socket.on(EVENT_USER_LEAVE, appendUserLeaveMessage)

  socket.on('connect', function () {
    console.log('connected')

    socket.emit(EVENT_USER_ENTER, nickname)
  })
})
