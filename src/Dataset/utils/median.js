// sort array ascending
const asc = (arr) => arr.sort((a, b) => a - b)

const quantile = (sorted, q) => {
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  } else {
    return sorted[base]
  }
}

const median = (arr) => {
  const sorted = asc(arr)

  return {
    min: sorted[0],
    q10: quantile(sorted, 0.1),
    q25: quantile(sorted, 0.25),
    median: quantile(sorted, 0.5),
    q75: quantile(sorted, 0.75),
    q90: quantile(sorted, 0.9),
    max: sorted[sorted.length - 1],
  }
}

export default median
