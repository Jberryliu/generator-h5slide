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
                        src: ['src/slide?/*.js', 'src/base/js/*.js']
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
                        src: ['src/lib/css/*.css', 'src/base/css/*.css', 'src/slide?/*.less'],
                        dest: 'output/base.min.css'
                    }
                ]
            }
        },
        concat: {
            game: {
                files: [
                    {
                        src: ['src/slide?/*.html'],
                        dest: 'src/tmp/template.html'
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
                        src: ['src/lib/**/*.js', 'src/base/js/*.js', 'src/slide?/*.js'],
                        dest: 'output/base.min.js'
                    }
                ]
            }
        },
        copy: {
            game: {
                files: [
                    {
                        src: ['src/slide?/img/*.{png,jpg,jpeg,gif}', 'src/base/img/*.{png,jpg,jpeg,gif}'],
                        dest: 'output/img',
                        expand: true,
                        flatten: true
                    }

                ]
            },
            lib: {
                files: [
                    {
                        src: [<%= src %>],
                        dest: 'src/lib',
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
                        src: 'src/index.html',
                        dest: 'output/index.html'
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
                        src: ['src']
                    }
                ]
            }

        }


    });


    //default task
    grunt.registerTask('default', ['jshint', 'less', 'concat', 'uglify', 'includereplace', 'copy:game', 'clean:game']);

};
