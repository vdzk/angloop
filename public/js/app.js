import './layout.js'
import { draw } from './draw.js'
import { simpleMutator } from './simpleMutator.js'
import { mirrorMutator } from './mirrorMutator.js'

let sides = 6
let numTurns = 11 //at least 2 for mirror ?
let turnes
let prog = 0  //Animation progress
let animationStart = null

const dom = Object.fromEntries(['mirror', 'mutateDirections', 'addTurn', 'removeTurn']
  .map(id => [id, document.getElementById(id)])
)

let mutator
const updateMutator = () => {
  mutator = (dom.mirror.checked) ? mirrorMutator : simpleMutator
  turnes = mutator.init({ sides, numTurns })
  draw({ sides, turns, prog})
}
updateMutator()
dom.mirror.onchange = updateMutator

dom.mutateDirections.onclick = () => {
  turnes = mutator.mutateDirections()
  animationStart = performance.now()
  window.requestAnimationFrame(step)
}

const step = (timestamp) => {
  prog += (timestamp - animationStart) / 20000
  if (prog < 1) {
    window.requestAnimationFrame(step)
  } else {
    prog = 0
    turnes = mutator.endMutation()
  }
  draw({ sides, turnes, prog})
}

dom.addTurn.onclick = () => {
  numTurns++
  turnes = mutator.addTurn()
  window.requestAnimationFrame(step)
}

dom.removeTurn.onclick = () => {
  numTurns--
  turnes = mutator.removeTurn()
  window.requestAnimationFrame(step)
}




document.getElementById('mirror').onchange = () => {
  mirror = document.getElementById('mirror').checked
  init()
}

let sides = 6
//at least 2 for mirror ?
let numTurns = 11
let turnes


let prog = 0  //Animation progress
let animationStart = null

const step = (timestamp) => {
  prog += (timestamp - animationStart) / 20000
  if (prog < 1) {
    window.requestAnimationFrame(step)
  } else {
    prog = 0
    prevMutation = nextMutation
  }
  let turnesStart
  let turnesEnd
  //TODO: cash stitched version?
  if (mirror) {
    turnesStart = stitchMirror(prevMutation)
    turnesEnd = stitchMirror(nextMutation)
  } else {
    turnesStart = prevMutation
    turnesEnd = nextMutation
  }
  draw({ sides, turnesStart, turnesEnd, prog})
}

let prevMutation
let nextMutation

const mutate = () => {
  if (mirror) {
    nextMutation = mirrorMutate(prevMutation)
  } else {
    nextMutation = simpleMutate(prevMutation)
  }
  animationStart = performance.now()
  window.requestAnimationFrame(step)
}

const getRandomTurns = () => Array(numTurns).fill(0).map(
  () => Math.floor(sides * Math.random())
)

const init = () => {
  let turns
  if (mirror) {
    prevMutation = {
      turns: getRandomTurns(),
      firstTurn: Math.floor(sides * Math.random()),
    }
    turns = stitchMirror(prevMutation)
  } else {
    turns = getRandomTurns()
    prevMutation = turns
  }
  draw({ sides, turnesStart: turns, turnesEnd: turns, prog})
}

init()

document.getElementById('mutate').onclick = mutate


let addTurn
let removeTurn

document.getElementById('addTurn').onclick = () => {

}
document.getElementById('removeTurn').onclick = () => {

}
