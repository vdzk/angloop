import { getRandomDirections, getRandomDirection, sum, clone, willCollapse } from './utils.js'

let turns
let curParts
let newParts

const stitchDirections = ({ directions, firstDirection }) => {
  const mirror = directions.slice().reverse()
  mirror.unshift(firstDirection)
  mirror.pop()
  const stitchedDirections = mirror.concat(directions)
  return stitchedDirections
}

const init = ({ sides, numTurns }) => {
  const directions = getRandomDirections({ sides, numTurns })
  const firstDirection = getRandomDirection(sides)
  curParts = { directions, firstDirection }
  let stitched = stitchDirections(curParts)
  while (willCollapse(sum(stitched), sides)) {
    //nudge off balance
    curParts.firstDirection++
    stitched = stitchDirections(curParts)
  }
  turns = stitched.map(d => ({ direction: d }))
}

const getTurns = () => turns

const mutateDirections = (sides) => {
  newParts = clone( curParts )
  const dl = curParts.directions.length
  const i = Math.floor( dl * Math.random())
  const mutationSize = 1 + Math.floor(Math.random() * sides / 3)
  if (Math.random() < 0.5) {
    newParts.directions[i] -= mutationSize
  } else {
    newParts.directions[i] += mutationSize
  }

  //calculate firstDirection that preserves the direction sum
  const curStiched = stitchDirections(curParts)
  const curSum = sum(curStiched)
  const newSum = sum(stitchDirections(newParts))
  newParts.firstDirection -= newSum - curSum
  const newStiched = stitchDirections(newParts)

  //Generate turns
  turns = curStiched.map((d, j) => {
    const turn = { direction: d }
    if (newStiched[j] !== d) {
      turn.newDirection = newStiched[j]
    }
    return turn
  })
}

//minimise direction modulus
const minimizeDirMod = (d, sides) => {
  d = d % sides
  if (d > sides / 2) {
    d -= sides
  }
  return d
}

const preventCollapse = (sides, parts, deviation=0) => {

  // return false
}

const fullTurns = (directions, sides) => Math.floor(sum(directions) / sides)

const addSide = (sides) => updateSides(sides, sides + 1)
const removeSide = (sides) => updateSides(sides, sides - 1)

const updateSides = (sides, newSides) => {
  curParts.directions = curParts.directions.map((d) => minimizeDirMod(d, sides))
  curParts.firstDirection = minimizeDirMod(curParts.firstDirection, sides)

  newParts = clone( curParts )

  //keep cummulative direction change to a minimum
  let totalDeviation = 0
  for (let i = 0; i < curParts.directions.length; i++) {
    const d = curParts.directions[i]
    const deviation = d / newSides - d / sides
    totalDeviation += deviation

    //Offset direction by one to bring total deviation closer to zero
    if (totalDeviation > 1 / newSides) {
      newParts.directions[i]--
      totalDeviation -= 1 / newSides
    } else if (totalDeviation < -1 / newSides) {
      newParts.directions[i]++
      totalDeviation += 1 / newSides
    }
  }
  const wholeDeviation = Math.round(totalDeviation * 2 * newSides)
  newParts.firstDirection += wholeDeviation
  totalDeviation -= wholeDeviation

  const curStiched = stitchDirections(curParts)
  let newStiched = stitchDirections(newParts)


  //try to make the total number of turns remains the same
  const newFullTurns = fullTurns(newStiched, newSides)
  const curFullTurns = fullTurns(curStiched, sides)
  if (newFullTurns !== curFullTurns) {

    if (Math.sign(curFullTurns + 0.1) === Math.sign(newSides - sides)) {
      newParts.firstDirection += 2
    } else {
      newParts.firstDirection -= 2
    }

    newStiched = stitchDirections(newParts)
  }

  while (willCollapse(sum(newStiched), newSides)) {
    //nudge off balance
    if (totalDeviation < 0) {
      newParts.firstDirection++
    } else {
      newParts.firstDirection--
    }
    newStiched = stitchDirections(newParts)
  }

  const spinSize = Math.abs(sum(curStiched)/sides - sum(newStiched)/newSides)

  //Generate turns
  turns = curStiched.map((d, j) => {
    const turn = { direction: d }
    if (newStiched[j] !== d) {
      turn.newDirection = newStiched[j]
    }
    return turn
  })

  return spinSize
}

const addTurn = () => {
  newParts = clone( curParts )
  const dl = curParts.directions.length
  //avoid i = 0 because editing head edge is complicated
  const i = Math.floor( (dl - 1) * Math.random()) + 1 //new turn
  let b = Math.floor( (dl - 2) * Math.random()) + 1 //direction balancing turn
  const curBalanceDirection = curParts.directions[b]
  newParts.directions.splice(i, 0, 1)
  if (b >= i) b++ //b was moved by the splice
  newParts.directions[b] = curBalanceDirection - 1

  //Generate turns for growing and changing directions of the new turns
  const newStiched = stitchDirections(newParts)
  const ndl = newParts.directions.length
  const newTurns = [ndl + i, ndl - i]
  const balanceTurns = [ndl + b, ndl - b]
  turns = newStiched.map((d, j) => {
    const turn = { direction: d }
    if (balanceTurns.includes(j)) {
      turn.direction = curBalanceDirection
      turn.newDirection = curBalanceDirection - 1
    }
    if (newTurns.includes(j)) {
      turn.grow = true
      turn.direction = 0
      turn.newDirection = 1
    }
    return turn
  })
}

const removeTurn = () => {
  newParts = clone( curParts )
  const dl = curParts.directions.length
  //avoid i = 0 because editing head edge is complicated
  const i = Math.floor( (dl - 1) * Math.random()) + 1
  //preserve direction change before removing the turn
  const inheritor = (i === 0) ? newParts.directions.length - 1 : i - 1
  if (inheritor === 0) {
    //have to balance one for each mirrored side
    newParts.directions[inheritor] += 2 * newParts.directions[i]
  } else {
    newParts.directions[inheritor] += newParts.directions[i]
  }

  newParts.directions.splice(i, 1)

  //Generate turns
  const curStiched = stitchDirections(curParts)
  const shrinkTurns = [dl - i + 1, dl + i]  //careful with off by one errors!
  turns = curStiched.map((d, j) => {
    const turn = { direction: d }
    if (shrinkTurns.includes(j)) {
      turn.shrink = true
    }
    return turn
  })
}

const endMutation = () => {
  curParts = newParts
  turns = stitchDirections(curParts).map(d => ({ direction: d }))
}

export const mirrorMutator = {
  init,
  getTurns,
  mutateDirections,
  addSide,
  removeSide,
  addTurn,
  removeTurn,
  endMutation
}
