module.exports = {
  getMajorVersion: (version) =>
    typeof version === 'string' && version.includes('.') ? version.split('.')[0] : false
};
