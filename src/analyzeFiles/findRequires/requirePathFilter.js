function isLocal(requirePath) {
  return requirePath[0] === '.';
}

module.exports = isLocal;
