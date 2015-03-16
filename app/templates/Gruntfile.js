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
            all: {
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
            all: {
                files: [
                    {
                        src: ['src/lib/*.css', 'src/base/css/*.css', 'src/slide?/*.less'],
                        dest: 'output/base.min.css'
                    }
                ]
            }
        },
        concat: {
            html: {
                files: [
                    {
                        src: ['src/slide?/*.html'],
                        dest: 'src/tmp/template.html'
                    }
                ]
            },
            js: {
                files:[
                    {
                        src: ['src/lib/*.js'],
                        dest: 'output/lib.min.js'
                    },
                    {
                        src: ['src/base/js/*.js', 'src/slide?/*.js'],
                        dest: 'output/base.min.js'
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
            all: {
                files: [
                    {
                        src: ['src/lib/*.js'],
                        dest: 'output/lib.min.js'
                    },
                    {
                        src: ['src/base/js/*.js', 'src/slide?/*.js'],
                        dest: 'output/base.min.js'
                    }
                ]
            }
        },
        copy: {
            all: {
                files: [
                    {
                        src: ['src/slide?/img/*.{png,jpg,jpeg,gif}', 'src/base/img/*.{png,jpg,jpeg,gif}'],
                        dest: 'output/img',
                        expand: true,
                        flatten: true
                    }

                ]
            }
        },
        includereplace: {
            all: {
                files: [
                    {
                        src: 'src/index.html',
                        dest: 'output/index.html'
                    }

                ]
            }
        },
        clean: {
            all: {
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
    grunt.registerTask('default', ['jshint', 'less', 'concat:html', 'uglify', 'includereplace', 'copy', 'clean:all']);
    grunt.registerTask('dev', ['jshint', 'less', 'concat', 'includereplace', 'copy', 'clean:all']);

};
