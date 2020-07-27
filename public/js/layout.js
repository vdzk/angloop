const canvasEl = document.getElementById('canvas')
const appEl = document.getElementById('app')

const updateCallbacks = []

const update = () => {
  const parentStyles = getComputedStyle(canvasEl.parentNode)
  const size = Math.min(...['height', 'width'].map(dim => 
    parseInt(parentStyles.getPropertyValue(dim))
  ))


  canvasEl.height = size
  canvasEl.width = size
  appEl.style.opacity = 1
  updateCallbacks.forEach(cb => cb())
}

window.addEventListener('resize', update)

update()

export const onLayoutUpdate = (callback) => {
  updateCallbacks.push(callback)
}
