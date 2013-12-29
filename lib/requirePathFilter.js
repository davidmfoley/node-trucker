function isLocal(requirePath) {
  return (/^[\.\/]/).exec(requirePath);
}

module.exports = isLocal;
