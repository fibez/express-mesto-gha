function isFieldEmpty(fields) {
  return Object.values(fields).some((value) => !value);
}

module.exports = {
  isFieldEmpty,
};
