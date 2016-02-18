var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.weapons_tracking/'
var stream = 'stable'
var media = require('./lib/path').media(stream)

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    copy: {
      mod: {
        files: [
          {
            src: [
              'modinfo.json',
              'LICENSE.txt',
              'README.md',
              'CHANGELOG.md',
              'ui/**',
              'pa/**'],
            dest: modPath,
          },
        ],
      },
    },
    clean: ['pa', modPath],
    // copy files from PA, transform, and put into mod
    proc: {
      // form 1: just the relative path, media src is assumed
      ammo: {
        targets: [
          'pa*/ammo/**/*.json',
          'pa*/units/**/*_ammo*.json',
          'pa*/units/**/*_deploy.json',
          'pa*/units/**/torpedeo.json',
          'pa*/units/land/artillery_short/artillery_short_tool_weapon.json',
          'pa_ex1/units/land/artillery_unit_launcher/artillery_unit_launcher_tool_weapon.json',
        ],
        process: function(spec, path) {
          /*
          if (spec.physics) {
            console.log(spec.physics.add_to_spatial_db, path)
            return
          } else {
            console.log('NO PHYSICS', path)
          }
          */
          if (!spec.physics) spec.physics = {}
          spec.physics.add_to_spatial_db = true
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerMultiTask('proc', 'Process unit files into the mod', function() {
    if (this.data.targets) {
      var specs = spec.copyPairs(grunt, this.data.targets, media)
      spec.copyUnitFiles(grunt, specs, this.data.process)
    } else {
      var specs = this.filesSrc.map(function(s) {return grunt.file.readJSON(media + s)})
      var out = this.data.process.apply(this, specs)
      grunt.file.write(this.data.dest, JSON.stringify(out, null, 2))
    }
  })

  // Default task(s).
  grunt.registerTask('default', ['proc', 'copy:mod']);

};

