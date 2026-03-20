function isLocal(requirePath) {
  return requirePath[0] === '.'
}

export default isLocal
