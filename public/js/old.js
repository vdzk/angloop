document.querySelectorAll('input').forEach(
  input => {
    if (input.disabled) return false
    input.addEventListener('change', draw)
    input.addEventListener('keyup', draw)
    input.addEventListener('click', draw)
  }
)

function turnReducer(total, command) {
  if (command === 'R') {
    return total + 1
  } else if (command === 'L') {
    return total - 1
  } else {
    return total
  }
}

function getVertexCommands(loops, sides, edgeCommands) {
  const edgeTurn = edgeCommands.split('').reduce(turnReducer, 0) % sides
  let vertexTurn = loops - edgeTurn % sides
  if (vertexTurn < 0) vertexTurn += sides
  let vertexCommands = Array(vertexTurn).fill('R').join('')
  return vertexCommands
}

function drawSvg(loop) {
  const loops = parseInt(document.getElementById('loops').value)
  const sides = parseInt(document.getElementById('sides').value)
  const commandParts = ['mirror', 'bottom'].map((id) => document.getElementById(id).value)
  const mirrored = commandParts[0].split('').reverse().join('')
  commandParts.push(mirrored)
  const edgeCommands = commandParts.join('')
  const vertexCommands = getVertexCommands(loops, sides, edgeCommands)
  document.getElementById('top').value = vertexCommands
  const commands = vertexCommands + edgeCommands
  console.log({edgeCommands, vertexCommands, commands})
  const turn = (1 * Math.PI * 2) / sides  //In radians
  let angle = turn
  let lastPoint = {x: 0, y: 0}
  const points = [{x: 0, y: 0}]
  for (let s = 0; s < sides; s++) {
    [...commands].forEach(c => {
      if (c === 'F') {
        const {x, y} = lastPoint
        const dx = Math.cos(angle)
        const dy = Math.sin(angle)
        const nextPoint = {
          x: x + dx,
          y: y + dy,
          hide: (s > 0) && !loop,
        }
        points.push(nextPoint)
        lastPoint = nextPoint
      } else if (c === 'R') {
        angle += turn
      } else if (c === 'L') {
        angle -= turn
      }
    })
  }
  let minX = 0
  let minY = 0
  let maxX = 0
  let maxY = 0
  points.forEach(point => {
    const {x, y} = point
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  })
  const length = maxX - minX
  const height = maxY - minY
  const scale = 600 / Math.max(length, height)
  points.forEach(point => {
    const {x, y} = point
    point.x = (x - minX) * scale
    point.y = (y - minY) * scale
  })
  const svgId = (loop) ? 'loop' : 'line'
  const svgEl = document.querySelector('svg#'+svgId)
  svgEl.innerHTML = ''
  for (let i = 0; i < points.length - 1; i++) {
    const lineEl = document.createElementNS('http://www.w3.org/2000/svg','line');
    lineEl.setAttribute('x1', points[i].x);
    lineEl.setAttribute('y1', points[i].y);
    lineEl.setAttribute('x2', points[i+1].x);
    lineEl.setAttribute('y2', points[i+1].y);
    if (!points[i].hide) {
      lineEl.setAttribute("stroke", "black")
    }
    svgEl.append(lineEl);
  }
}
function draw() {
  drawSvg(true)
  drawSvg(false)
}
draw()
