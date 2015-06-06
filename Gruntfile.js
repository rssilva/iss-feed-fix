'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    watch: {
      node: {
        files: ['./index.js', '!./app/public/**/*.js'],
        tasks: ['babel:build'],
        options: {
          nospawn: true
        }
      }
    },
    'babel': {
      options: {
        sourceMap: false
      },
      build: {
        files: [{
          expand: true,
          cwd   : './',
          dest  : 'build/',
          src: ['./index.js']
        }]
      },
      process: function (src, path_to_file) {
        grunt.log.write(path_to_file);
        done();

        return src;
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('default', ['watch']);
};
