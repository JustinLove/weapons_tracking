module.exports.copyPairs = function(grunt, files, media) {
  media = media || ''
  var allSpecs = grunt.file.expand({cwd: media}, files)
  return allSpecs.map(function(relpath) {
    return {relpath: relpath.replace('_ex1', ''), abspath: media + relpath}
  })
}

module.exports.specFiles = function(grunt, filename_regexp, media) {
  media = media || ''
  var allSpecs = grunt.file.expand({cwd: media}, [
    'pa*/ammo/**/*.json',
    'pa*/tools/**/*.json',
    'pa*/units/**/*.json'
  ])
  var filter = new RegExp(filename_regexp, '')
  var specs = []
  allSpecs.forEach(function(relpath) {
    if (filter.test(relpath)) {
      specs.push({relpath: relpath.replace('_ex1', ''), abspath: media + relpath})
    }
  })
  return specs
}

module.exports.copyUnitFiles = function(grunt, specs, processSpec) {
  processSpec = processSpec || function(x) {return x}
  specs.forEach(function(file) {
    var spec = grunt.file.readJSON(file.abspath)
    processSpec(spec, file.relpath)
    grunt.file.write(file.relpath, JSON.stringify(spec, null, 2))
  })
}