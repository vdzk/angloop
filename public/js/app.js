import { onLayoutUpdate } from './layout.js'
import { draw } from './draw.js'
import { simpleMutator } from './simpleMutator.js'
import { mirrorMutator } from './mirrorMutator.js'

let sides = 3
let newSides = null
let numTurns = 2
let prog = 0  //Animation progress
let animationStart = null
let nextAnimation = null
let mirror = true
let dark = true
let requestedFrame = false
let spinSize
let mutator
const dom = {}

;['numTurns', 'numSides', 'darkBtn', 'mirrorBtn'].forEach(id => dom[id] = document.getElementById(id))

//Swtich between mutators
const updateMutator = () => {
  mutator = (mirror) ? mirrorMutator : simpleMutator
  mutator.init({ sides, numTurns })
  draw({ sides, turns: mutator.getTurns(), prog, dark})
}
onLayoutUpdate(() => draw({ sides, turns: mutator.getTurns(), prog, dark }))
updateMutator()
// dom.mirrorBtn.onclick = () => {
//   mirror = !mirror
//   updateMutator()
//   dom.mirrorBtn.textContent = (mirror) ? 'on' : 'off'
// }

// //Switch dark / light modes
// dom.darkBtn.onclick = () => {
//   dark = !dark
//   const cls = document.body.classList
//   if (dark) {
//     cls.add('dark')
//   } else {
//     cls.remove('dark')
//   }
//   draw({ sides, turns: mutator.getTurns(), prog, dark })
//   dom.darkBtn.textContent = (dark) ? 'on' : 'off'
// }

//Animation step function
const step = (timestamp, changeSides) => {
  if (changeSides) {
    const duration = (spinSize) ? 1000000 * spinSize : 80000
    prog += (timestamp - animationStart) / duration
  } else {
    prog += (timestamp - animationStart) / 60000
  }

  if (prog < 1) {
    window.requestAnimationFrame(t => step(t, changeSides))
    requestedFrame = true
    draw({ sides, newSides, turns: mutator.getTurns(), prog, dark })
  } else {
    prog = 0
    if (changeSides) {
      sides = newSides
      newSides = null
    }
    mutator.endMutation()
    if (nextAnimation) {
      setTimeout(() => {
        //Start the new animation on the next call stack
        nextAnimation()
        nextAnimation = null
      })
    } else {
      draw({ sides, turns: mutator.getTurns(), prog, dark })
    }
  }
  requestedFrame = false
}

//Mutation types
const mutations = [
  {
    name: 'mutateDirections',
    update: () => {},
  },
  {
    name: 'addTurn',
    update: () => {
      numTurns++
      dom.numTurns.textContent = numTurns
    },
  },
  {
    name: 'removeTurn',
    update: () => {
      numTurns--
      dom.numTurns.textContent = numTurns
    },
    test: () => numTurns > 2,
  },
  {
    name: 'addSide',
    update: () => {
      newSides = sides + 1
      dom.numSides.textContent = newSides
    },
    changeSides: true,
  },
  {
    name: 'removeSide',
    update: () => {
      newSides = sides - 1
      dom.numSides.textContent = newSides
    },
    changeSides: true,
    test: () => sides > 3,
  }
]

//Initialise mutation types
for (const { name, update, changeSides, test } of mutations) {
  const mutate = () => {
    if (test && !test()) {
      return false
    }
    //Avoid starting the aimation twice
    if (prog > 0 || requestedFrame) {
      if (prog > 0.6 && prog < 1 && nextAnimation !== mutate) {
        nextAnimation = mutate
      }
      return false
    }
    update()
    mutator[name](sides)
    animationStart = performance.now()
    window.requestAnimationFrame(t => step(t, changeSides))
    requestedFrame = true
  }
  dom[name] = document.getElementById(name)
  dom[name].onclick = mutate
}
