/*
 添加单页的 JS 逻辑
 */

define('slide<%= slideIndex %>', [], function (require) {
    'use strict';
    var slides = require('slides');

    var conf = {
        index: <%= slideIndex-1 %>,
        selector: '.slide<%= slideIndex %>',

        init: function () {

        },

        before: function ($slide) {

        },

        after: function () {

        },

        progress: function () {

        }

    };

    slides.setConf(conf);
});
