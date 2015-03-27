/*
 添加单页的 JS 逻辑
 */

define('slide<%= slideIndex %>', [], function (require) {
    'use strict';
    var slides = require('slides');

    var conf = {
        index: <%= slideIndex-1 %>,
        selector: '.slide<%= slideIndex %>',

        init: function ($slide) {

        },

        /*
            @desc: 滑动完成 后 回调函数
            @param: 当前可见 slide
        */
        before: function ($slide) {

        },

        /*
            @desc: 滑动完成 后 回调函数
            @param: 当前可见 slide
         */
        after: function ($slide) {

        }

    };

    slides.setConf(conf);
});
