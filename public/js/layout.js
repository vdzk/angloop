const canvasEl = document.getElementById('canvas')
const appEl = document.getElementById('app')

const updateCallbacks = []

const update = () => {
  const parentStyles = getComputedStyle(canvasEl.parentNode)
  const size = Math.min(...['height', 'width'].map(dim => 
    parseInt(parentStyles.getPropertyValue(dim))
  ))
  const dpr = window.devicePixelRatio || 1

  canvasEl.height = size * dpr
  canvasEl.width = size * dpr
  canvasEl.style.height = size + 'px'
  canvasEl.style.width = size + 'px'
  appEl.style.opacity = 1
  updateCallbacks.forEach(cb => cb())
}

window.addEventListener('resize', update)

update()

export const onLayoutUpdate = (callback) => {
  updateCallbacks.push(callback)
}
