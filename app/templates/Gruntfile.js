/**
 * Created by berry on 15/2/4.
 */

'use strict';

module.exports = function (grunt) {

    //auto load tasks
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    //project configuration
    grunt.initConfig({
        jshint: {
            game: {
                files: [
                    {
                        src: ['slide?/*.js', 'base/js/*.js']
                    }
                ]
            }
        },

        less: {
            options: {
                compress: true
            },
            game: {
                files: [
                    {
                        src: ['lib/css/*.css', 'base/css/*.css', 'slide?/*.less'],
                        dest: 'dest/base.min.css'
                    }
                ]
            }
        },
        concat: {
            game: {
                files: [
                    {
                        src: ['slide?/*.html'],
                        dest: 'tmp/template.html'
                    }
                ]
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            game: {
                files: [
                    {
                        src: ['lib/**/*.js', 'base/js/*.js', 'slide?/*.js'],
                        dest: 'dest/base.min.js'
                    }
                ]
            }
        },
        copy: {
            game: {
                files: [
                    {
                        src: ['slide?/img/*.{png,jpg,jpeg,gif}', 'base/img/*.{png,jpg,jpeg,gif}'],
                        dest: 'dest/img',
                        expand: true,
                        flatten: true
                    }

                ]
            },
            lib: {
                files: [
                    {
                        src: [<%= src %>],
                        dest: 'lib',
                        expand: true,
                        flatten: true
                    }

                ]
            }
        },
        includereplace: {
            game: {
                files: [
                    {
                        src: 'index.html',
                        dest: 'dest/index.html'
                    }

                ]
            }
        },
        clean: {
            game: {
                files: [
                    {
                        src: 'tmp'
                    }
                ]
            },
            yo: {
                files: [
                    {
                        src: ['base', 'dest', 'lib', 'slide?', 'index.html']
                    }
                ]
            }

        }


    });


    //default task
    grunt.registerTask('default', ['jshint', 'less', 'concat', 'uglify', 'includereplace', 'copy:game', 'clean:game']);

};
