/**
 * Created by berry on 15/2/5.
 */
'use strict';

var util = require('util');
var fs = require('fs');
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        //在这拿到传参和选项
    },

    initializing: function () {
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
                message: 'Select required extend libs: (click "space" for choosing)',
                choices: ['kinetic', 'animate.css']
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
            this.destinationPath('src/index.html'),
            this.userOption
        );

        //生成 滑动页面
        var slidesNumber = parseInt(this.userOption.slidesNumber),
            exts = ['.html', '.js', '.less'];

        if (!!slidesNumber) {
            for (var i = 1; i < (slidesNumber + 1); ++i) {
                exts.forEach(function (ext) {
                    this.fs.copyTpl(
                        this.templatePath('slide/slide' + ext),
                        this.destinationPath('src/slide' + i + '/slide' + i + ext),
                        {
                            slideIndex: i
                        }
                    )
                }.bind(this));
                this.fs.copy(
                    this.templatePath('slide/img/bg.jpg'),
                    this.destinationPath('src/slide' + i + '/img/bg.jpg')
                );
            }
        }

        //生成基础文件
        var fileList = this.expand(this.templatePath('base/**/*.*'));
        fileList.forEach(function (file) {
            if (file.indexOf('init_slides') !== -1) {

                this.fs.copyTpl(
                    file,
                    file.replace(this.templatePath(), this.destinationPath('src')),
                    {
                        requires: this._getRequires(slidesNumber)
                    }
                );
            } else {
                this.fs.copy(
                    file,
                    file.replace(this.templatePath(), this.destinationPath('src'))
                );

            }

        }.bind(this));

        this._copyLibs();


    },

    _getRequires: function (i) {
        var requires = '';

        while (i > 0) {
            requires += 'require("slide' + i + '");';
            i--;
        }

        return requires;
    },

    _copyLibs: function () {
        var libs = this.userOption.libs;

        //copy 基础组件 ['sea.js', 'swiper', 'zepot']
        this.fs.copy(
            this.templatePath('lib/lib.js'),
            this.destinationPath('src/lib/lib.js')
        );
        this.fs.copy(
            this.templatePath('lib/swiper.min.css'),
            this.destinationPath('src/lib/swiper.min.css')
        );

        //copy 附加组件 ['kinetic', 'animate.css']
        libs.forEach(function (lib) {
            switch (lib) {
                case 'kinetic':
                    this.fs.copy(
                        this.templatePath('lib/extend/kinetic.min.js'),
                        this.destinationPath('src/lib/kinetic.min.js')
                    );
                    break;
                case 'animate.css':
                    this.fs.copy(
                        this.templatePath('lib/extend/animate.css'),
                        this.destinationPath('src/lib/animate.css')
                    );
                    break;
                default:
                    this.log('不存在的库。');
            }

        }.bind(this));

        //生成 grunt 配置文件
        this.fs.copy(
            this.templatePath('Gruntfile.js'),
            this.destinationPath('Gruntfile.js')
        );

        //生成 node 配置文件
        this.fs.copy(
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
        this.log('安装 grunt 及其插件。');

        this.installDependencies({
            callback: function () {
                this.log('grunt 及其插件安装完毕。');

                //this._installLibs();
            }.bind(this)
        });


    },

    /*
     没有必要获取最新的库文件，放弃调用
     */
    _installLibs: function () {
        var libs = this.userOption.libs;

        //安装 并 复制 各种库文件
        if (!!libs) {
            this.npmInstall(libs, function () {
                this.log('将 npm 安装的库复制到 lib 文件夹中。');

                //install 里竟然不能 copy 文件，等待 yeoman 的 issue 解决
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
