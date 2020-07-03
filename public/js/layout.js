const canvasEl = document.getElementById('canvas')
const appEl = document.getElementById('app')

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
}

window.addEventListener('resize', update)

update()
