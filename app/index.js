/**
 * Created by berry on 15/2/5.
 */
'use strict';

var util = require('util');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        //在这拿到传参和选项
    },

    initializing: function () {
        this.log('哈哈哈哈');
    },

    prompting: function () {
        //默认配置
        this.defaultOption = {
            user: process.env.USER
        };

        this.userOption = {};

        //异步调用
        var done = this.async();

        var prompts = [
            {
                name: 'name',
                message: 'Name:',
                default: '一款H5小应用'
            },
            {
                name: 'author',
                message: 'Author:',
                default: this.defaultOption.user
            },
            {
                name: 'description',
                message: 'Description:',
                default: 'H5小应用——贴吧FE出品'
            },
            {
                type: 'checkbox',
                name: 'libs',
                message: 'Select required libs: (click "space" for choosing)',
                choices: ['zepto', 'swiper', 'seajs', 'kinetic', 'animate.css'],
                default: ['zepto', 'swiper', 'seajs']
            },
            {
                name: 'slidesNumber',
                message: 'How many slides do you want ?',
                default: '3'
            }

        ];

        this.prompt(prompts, function (answers) {
            this.userOption = answers;
            for (var key in this.userOption) {
                this.log(this.userOption[key]);
            }

            done();
        }.bind(this));
    },

    writing: function () {

        //生成主入口文件
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('index.html'),
            this.userOption
        );

        //生成基础文件
        var fileList = this.expand(this.templatePath('base/**/*.*'));
        fileList.forEach(function (file) {
            this.fs.copy(
                file,
                file.replace('/app/templates', '')
            );
        }.bind(this));

        //生成 滑动页面
        var slidesNumber = parseInt(this.userOption.slidesNumber),
            exts = ['.html', '.js', '.less'];

        if (!!slidesNumber) {
            for (var i = 1; i < (slidesNumber + 1); ++i) {
                exts.forEach(function (ext) {
                    this.mkdir('slide' + i);
                    this.fs.copyTpl(
                        this.templatePath('slide/slide' + ext),
                        this.destinationPath('slide' + i + '/slide' + i + ext),
                        {
                            slideIndex: i
                        }
                    )
                }.bind(this));
                this.fs.copy(
                    this.templatePath('slide/img/bg.jpg'),
                    this.destinationPath('slide' + i + '/img/bg.jpg')
                );

            }
        }

        this._copyLibs();


    },

    _copyLibs: function () {
        var libs = this.userOption.libs,
            src = [];

        libs.forEach(function (lib) {
            //['zepto', 'swiper', 'seajs', 'kinetic', 'animate.css']
            switch (lib) {
                case 'zepto':
                    src.push('node_modules/zepto/zepto.min.js');
                    break;
                case 'swiper':
                    src.push('node_modules/swiper/dist/idangerous.swiper.min.js');
                    src.push('node_modules/swiper/dist/idangerous.swiper.css');
                    break;
                case 'seajs':
                    src.push('node_modules/seajs/dist/sea.js');
                    break;
                case 'kinetic':
                    src.push('node_modules/kinetic/kinetic.min.js');
                    break;
                case 'animate.css':
                    src.push('node_modules/animate.css/animate.css');
                    break;
                default:
                    this.log('不存在的库。');
            }

        });


        //生成 grunt 配置文件
        this.fs.copyTpl(
            this.templatePath('Gruntfile.js'),
            this.destinationPath('Gruntfile.js'),
            {
                src: this._arr2String(src)
            }
        );

        //生成 node 配置文件
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json')
        );

    },

    /*
     模块替换是 toString() 的值，数组好郁闷，要转化一下
     */
    _arr2String: function (arr) {
        var str = '';

        arr.forEach(function (value) {
            str += '\'' + value + '\',';
        });

        return str.slice(0, str.length - 1);
    },

    install: function () {
        var libs = this.userOption.libs;

        //安装 并 复制 各种库文件
        if (!!libs) {
            this.npmInstall(libs, function () {
                this.log('将 npm 安装的库复制到 lib 文件夹中。');

                //install 里竟然不能 copy 文件，为啥？？？
                var gruntTask = this.spawnCommand('grunt', ['copy:lib']);

                gruntTask.on('close', function (code) {
                    if (code === null) {
                        this.log('文件复制失败');
                    } else {
                        this.log('文件复制完成！');
                    }
                }.bind(this));

            }.bind(this));
        }

    },
    end: function () {
        //存储用户默认配置
        this.config.set('author', this.defaultOption.user);
    }

});
