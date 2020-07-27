const canvasEl = document.getElementById('canvas')
const appEl = document.getElementById('app')

const updateCallbacks = []

const update = () => {
  const vh = window.innerHeight
  const vw = window.innerWidth

  if (vw > vh) {
    canvasEl.height = vh
    canvasEl.width = vh
    appEl.style.flexDirection = 'row'
  } else {
    canvasEl.width = vw
    canvasEl.height = vw
    appEl.style.flexDirection = 'column'
  }
  appEl.style.opacity = 1
  updateCallbacks.forEach(cb => cb())
}

window.addEventListener('resize', update)

update()

export const onLayoutUpdate = (callback) => {
  updateCallbacks.push(callback)
}
