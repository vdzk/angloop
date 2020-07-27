import { findCenter } from './utils.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const getPoints = ({ sides, newSides, turns, prog, dark }) => {
  //apply animation easing
  prog = Math.pow(--prog, 5) + 1;
  const progSides = (newSides) ? sides * (1 - prog) + newSides * prog : sides
  const turnRad = (1 * Math.PI * 2) / progSides  //In radians
  let angle = turnRad
  let lastPoint = {x: 0, y: 0}
  const points = [{x: 0, y: 0}]
  const maxSides = Math.max(sides, newSides || null)
  const vertices = []
  for (let s = 0; s < maxSides; s++) {
    vertices.push({...lastPoint})
    for (const turn of turns) {
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
      angle += direction * turnRad
    }
  }

  const lineWidth = document.getElementById('canvas').height / 250
  return { points, vertices, numTurns: turns.length, lineWidth, dark, sides, prog }
}

const fitPoints = ( { points, vertices, numTurns, lineWidth, dark, sides, prog } ) => {
  const center = findCenter(vertices)
  let maxR = 0
  for (const {x, y} of points.slice(0, numTurns)) {
    const dx = x - center.x
    const dy = y - center.y
    const dxy = Math.sqrt( dx*dx + dy*dy )
    maxR = Math.max(maxR, dxy)
  }
  const pad = lineWidth + Math.floor(canvas.width * 0.1)
  const scale = ( canvas.width - 2 * pad ) / ( 2 * maxR )
  const fittedPoints = points.map(({x, y}) => ({
    x: (x - center.x) * scale + canvas.width / 2,
    y: (y - center.y) * scale + canvas.width / 2
  }))
  return { points: fittedPoints, lineWidth, dark, sides, prog }
}

let hue = 40

const updateCanvas = ( { points, lineWidth, dark, sides, prog } ) => {
  const [head, ...tail] = points
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  ctx.moveTo(head.x, head.y)
  for (const {x, y} of tail) ctx.lineTo(x, y)
  ctx.lineWidth = lineWidth
  if (dark) {
    ctx.strokeStyle = 'white'
    hue += 0.1
    ctx.shadowColor = `hsl(${hue}, 100%, 50%)`
    ctx.shadowBlur = 15
  } else {
    ctx.strokeStyle = 'black'
    ctx.shadowBlur = 0
  }
  // ctx.lineJoin = 'bevel'
  ctx.stroke()
}

export const draw = (data) => updateCanvas( fitPoints( getPoints(data) ) )
