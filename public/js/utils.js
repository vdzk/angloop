export const getRandomDirection = (sides) => Math.floor(sides * Math.random())

export const getRandomDirections = ({ sides, numTurns }) => Array(numTurns).fill(0)
  .map(() => getRandomDirection(sides))

export const sum = (arr) => arr.reduce((acc, cur) => acc + cur, 0)

export const clone = (obj) => JSON.parse(JSON.stringify(obj))

export const findCenter = (points) => {

  // https://www.geeksforgeeks.org/equation-of-circle-when-three-points-on-the-circle-are-given/
  const [{x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}] = points

	const x12 = x1 - x2
	const x13 = x1 - x3
  const y12 = y1 - y2
	const y13 = y1 - y3
  const y31 = y3 - y1
	const y21 = y2 - y1
  const x31 = x3 - x1
	const x21 = x2 - x1

	const sx13 = x1 * x1 - x3 * x3
	const sy13 = y1 * y1 - y3 * y3
  const sx21 = x2 * x2 - x1 * x1
	const sy21 = y2 * y2 - y1 * y1

  const cx = -((sx13) * (y12) + (sy13) * (y12) + (sx21) * (y13) + (sy21) * (y13))
    / (2 * ((x31) * (y12) - (x21) * (y13)))
	const cy = -((sx13) * (x12) + (sy13) * (x12) + (sx21) * (x13) + (sy21) * (x13))
		/ (2 * ((y31) * (x12) - (y21) * (x13)))

  return { x: cx, y: cy }
}

const gcdRec = (a, b) => (b) ? gcdRec(b, a % b) : Math.abs(a)

//Test if the shape will not come out with the full number of sides
export const willCollapse = (totalDirection, sides ) => {
  const direction = totalDirection % sides
  if (direction === 0) {
    return true
  }

  //test if sides and direction are coprime
  if (gcdRec(sides, direction) !== 1) {
    return true
  }

  return false
}
