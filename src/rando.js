var set = 'abcdefghijklmnopqrstuvwxyz'
module.exports = function () {
  var text = ''
  for (var i = 0; i < 15; ++i) text += set.charAt(Math.floor(Math.random() * set.length))
  return text
}
