import { getRandomDirections, sum, willCollapse } from './utils.js'

let turns

const init = ({ sides, numTurns }) => {
  const directions = getRandomDirections({ sides, numTurns })

  //prevent collapse
  while (willCollapse(sum(directions), sides)) {
    //nudge off balance
    directions[0]++
  }

  turns = directions.map(d => ({direction: d}))
}

// const getTurns = () => turns
const getTurns = () => turns

const mutateDirections = () => {
  const tl = turns.length
  const ta = Math.floor(tl * Math.random())
  //avoid picking ta again
  let tb = Math.floor((tl - 1) * Math.random())
  //account for skipped ta
  if (tb >= ta) tb += 1
  turns[ta].newDirection = turns[ta].direction + 1
  turns[tb].newDirection = turns[tb].direction - 1
}

const addTurn = () => {
  const tl = turns.length
  const t = Math.floor(tl * Math.random())  //turn after which new one will be inserted
  const b = Math.floor(tl * Math.random())  //turn to balance direction
  turns[b].newDirection = turns[b].direction - 1
  const turn = { direction: 0, grow: true, newDirection: 1 }
  turns.splice(t, 0, turn)
}

const removeTurn = () => {
  const tl = turns.length
  const t = Math.floor(tl * Math.random())
  turns[t].shrink = true
}

const addSide = (sides) => updateSides(sides, sides + 1)
const removeSide = (sides) => updateSides(sides, sides - 1)

const updateSides = (sides, newSides) => {
  //minimise direction modulus
  for (const turn of turns) {
    turn.direction = turn.direction % sides
    if (turn.direction > sides / 2) {
      turn.direction -= sides
    }
  }

  //keep cummulative direction change to a minimum
  let totalDeviation = 0
  let totatDirection = 0
  for (const turn of turns) {
    const deviation = turn.direction / newSides - turn.direction / sides
    totalDeviation += deviation
    totatDirection += turn.direction

    //Offset direction by one to bring total deviation closer to zero
    if (totalDeviation > 1 / newSides) {
      turn.newDirection = turn.direction - 1
      totatDirection--
      totalDeviation -= 1 / newSides
    } else if (totalDeviation < -1 / newSides) {
      turn.newDirection = turn.direction + 1
      totatDirection++
      totalDeviation += 1 / newSides
    }
  }

  //prevent collapse
  if (willCollapse(totatDirection, newSides)) {
    //nudge off balance
    if (turns[0].hasOwnProperty('newDirection')) {
      delete turns[0].newDirection
    } else {
      turns[0].newDirection = turns[0].direction + 1
    }
  }
}

const endMutation = () => {
  turns.forEach((turn, i) => {
    if (turn.hasOwnProperty('newDirection')) {
      turn.direction = turn.newDirection
      delete turn.newDirection
    }
    if (turn.grow) {
      delete turn.grow
    }
    if (turn.shrink) {
      //preserve direction change before removing the turn
      const inheritor = (i === 0) ? turns.length - 1 : i - 1
      turns[inheritor].direction += turn.direction
    }
  })
  turns = turns.filter(({ shrink }) => !shrink)
}

export const simpleMutator = {
  init,
  getTurns,
  mutateDirections,
  addTurn,
  removeTurn,
  addSide,
  removeSide,
  endMutation,
}
