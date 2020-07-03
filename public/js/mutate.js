export const simpleMutate = (turns) => {
  const mutatedTurns = turns.slice()
  const tl = turns.length
  const ta = Math.floor(tl * Math.random())
  //avoid picking ta again
  let tb = Math.floor((tl - 1) * Math.random())
  //account for skipped ta
  if (tb >= ta) tb += 1
  mutatedTurns[ta] += 1
  mutatedTurns[tb] -= 1
  return mutatedTurns
}

export const stitchMirror = ({ turns, firstTurn }) => {
  const mirror = turns.slice().reverse()
  mirror.unshift(firstTurn)
  mirror.pop()
  const stitchedTurns = mirror.concat(turns)
  return stitchedTurns
}

const sum = (arr) => arr.reduce((acc, cur) => acc + cur, 0)

export const mirrorMutate = ({turns, firstTurn}) => {
  const mutated = { turns: turns.slice(), firstTurn  }
  const tl = turns.length
  const t = Math.floor(tl * Math.random())
  if (Math.random() < 0.5) {
    mutated.turns[t] -= 1
  } else {
    mutated.turns[t] += 1
  }

  //calculate firstTurn that preserves the turn sum
  const originalSum = sum(stitchMirror({turns, firstTurn}))
  const mutatedSum = sum(stitchMirror(mutated))
  mutated.firstTurn -= (mutatedSum - originalSum)
  return mutated
}
