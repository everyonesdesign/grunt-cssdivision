grunt-cssdivision
=================

Grunt plugin to divide CSS file into basic and decorative styles

Installation:

    npm install grunt-cssdivision --save-dev

Usage example (Gruntfile.js):

    module.exports = function(grunt) {

      grunt.initConfig({
        cssdivision: {
          files: {
            src: ['*.css'] //files to be divided
          },
          options: {
            destDir: 'destinationDirectory' //default: "dest/"
          }
        }
      });

      grunt.loadNpmTasks('grunt-cssdivision');

      grunt.registerTask('default', ['cssdivision']);

    };