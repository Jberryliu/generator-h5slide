/**
 * Created by berry on 15/2/4.
 */

'use strict';

module.exports = function (grunt) {

    //auto load tasks
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    //loading images
    grunt.config.images = [];
    //project configuration
    grunt.initConfig({
        jshint: {
            options:{
                debug: true
            },
            all: {
                files: [
                    {
                        src: ['src/slide?/*.js', 'src/base/js/*.js']
                    }
                ]
            }
        },

        concat: {
            all: {
                options: {
                    process: function (content, src) {
                        var filePaths = src.split('/'),
                            fileCata = filePaths[1];

                        var reg = /__uri\(([\s\S]+?)\)/g;
                        var output = content.replace(reg, function (string, match) {
                            var imagePaths = match.split('/'),
                                len = imagePaths.length,
                                imageName = imagePaths[len - 1],
                                newImageName = fileCata + '_' + imageName;

                            imagePaths.splice(len - 1, 1, newImageName);
                            return imagePaths.join('/');
                        });

                        return output;
                    }
                },
                files: [
                    {
                        src: ['src/slide*/*.html'],
                        dest: 'tmp/template.html'
                    },
                    {
                        src: ['src/lib/*.js'],
                        dest: 'tmp/lib.js'
                    },
                    {
                        src: ['src/base/js/*.js', 'src/slide?/*.js'],
                        dest: 'tmp/base.js'
                    },
                    {
                        src: ['src/lib/*.css'],
                        dest: 'tmp/lib.css'

                    },
                    {
                        src: ['src/base/css/*.less', 'src/slide?/*.less'],
                        dest: 'tmp/base.less'
                    }
                ]
            }
        },
        copy: {
            image: {
                files: [
                    {
                        src: ['src/slide?/img/*.{png,jpg,jpeg,gif}', 'src/base/img/*.{png,jpg,jpeg,gif}'],
                        dest: 'output/img/',
                        expand: true,
                        //处理各个目录下图片命名冲突问题
                        rename: function (dest, src) {
                            var paths = src.split('/'),
                                cata = paths[1],
                                name = paths[paths.length - 1];

                            grunt.config.images.push('"img/' + cata + '_' + name + '"');
                            return dest + cata + '_' + name;
                        }
                    }

                ]
            },
            file: {
                files:[
                    {
                        src: ['tmp/lib.js'],
                        dest: 'output/lib.min.js'
                    },
                    {
                        src: ['tmp/base.js'],
                        dest: 'output/base.min.js'
                    }
                ]
            }
        },

        replace: {
            image: {
                src: ['tmp/base.js'],
                overwrite: true,
                replacements: [
                    {
                        from: /__images__/g,
                        to: function () {
                            return grunt.config.images.join();
                        }
                    }
                ]
            }

        },

        less: {
            options: {
                compress: false,
                plugins: [
                    new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
                ]
            },
            all: {
                files: [
                    {
                        src: ['tmp/lib.css'],
                        dest: 'output/lib.min.css'
                    },
                    {
                        src: ['tmp/base.less'],
                        dest: 'output/base.min.css'
                    }
                ]
            }
        },

        uglify: {
            options: {
                compress: true,
                beautify: true
            },
            all: {
                files: [
                    {
                        src: ['tmp/lib.js'],
                        dest: 'output/lib.min.js'
                    },
                    {
                        src: ['tmp/base.js'],
                        dest: 'output/base.min.js'
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
            }

        },
        watch: {
            files: ['src/**/*.*'],
            tasks: ['default']
        }


    });


    //default task
    grunt.registerTask('default', ['jshint', 'concat', 'copy:image', 'replace', 'less', 'copy:file', 'includereplace', 'clean']);
    grunt.registerTask('release', ['jshint', 'concat', 'copy:image', 'replace', 'less', 'uglify', 'includereplace']);

};
