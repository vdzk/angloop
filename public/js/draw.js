const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const lineWidth = 4

const getPoints = ({ sides, turnes, prog }) => {
  const turnRad = (1 * Math.PI * 2) / sides  //In radians
  let angle = turnRad
  let lastPoint = {x: 0, y: 0}
  const points = [{x: 0, y: 0}]
  for (let s = 0; s < sides; s++) {
    for (turn of turns) {
      //move forward
      const {x, y} = lastPoint
      let dx = Math.cos(angle)
      let dy = Math.sin(angle)
      if (turn.grow) {
        dx *= prog
        dy *= prog
      } else if (turn.shrink) {
        dx *= (1 - prog)
        dy *= (1 - prog)
      }
      const nextPoint = {
        x: x + dx,
        y: y + dy,
      }
      points.push(nextPoint)
      lastPoint = nextPoint

      //update direction
      let direction
      if (turn.hasOwnProperty('newDirection')) {
        direction = turn.direction * (1 - prog) + turn.newDirection * prog
      } else {
        direction = turn.direction
      }
      angle += turn * turnRad
    }
  }
  return points
}

const fitPoints = ( points ) => {
  let minX = 0
  let minY = 0
  let maxX = 0
  let maxY = 0
  for (const {x, y} of points) {
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  }
  const length = maxX - minX
  const height = maxY - minY
  const pad = lineWidth + 20
  const scale = (canvas.width - 2 * pad) / Math.max(length, height)
  const fittedPoints = points.map(({x, y}) => ({
    x: (x - minX) * scale + pad,
    y: (y - minY) * scale + pad,
  }))
  return fittedPoints
}

const updateCanvas = ( points ) => {
  const [head, ...tail] = points
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  ctx.moveTo(head.x, head.y)
  for (const {x, y} of tail) ctx.lineTo(x, y)
  ctx.lineWidth = lineWidth
  ctx.stroke()
  // ctx.shadowBlur = 50;
  // ctx.shadowColor = "blue";
}

export const draw = (data) => updateCanvas( fitPoints( getPoints(data) ) )
