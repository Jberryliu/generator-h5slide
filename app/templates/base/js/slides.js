define('slides', [], function () {
    'use strict';

    function Slides() {
        this.$slides = null;
        this.slidesConf = [];

        this.config = {
            mode: 'vertical'
        };

        this.init();
        this.bindEvents();

    }

    Slides.prototype = {
        construct: Slides,
        /*
         初始化滑动组件
         */
        init: function () {
            var windowWidth = $(window).width(),
                windowHeight = $(window).height();

            this.$slides = $('.swiper-container')
                .css({
                    width: windowWidth,
                    height: windowHeight
                })
                .swiper(this.config);

        },

        /*
         绑定事件
         */
        bindEvents: function () {
            $('body').on('touchmove', function (e) {
                e.preventDefault();
            });

            //竟然不能链式调用
            this.$slides.addCallback('SlideChangeStart', $.proxy(this.beforeProcess, this));
            this.$slides.addCallback('SlideChangeEnd', $.proxy(this.afterProcess, this));
        },

        /*
         获得滑动组件实例
         */
        getSlides: function () {
            return this.$slides;
        },

        /*
         添加滑动配置
         */
        setConf: function (conf) {
            this.slidesConf.push(conf);
        },

        /*
         滑动的处理
         */
        process: function (slide, type) {
            var activeSlide = slide.activeSlide(),
                callback = this.selActiveSlide(slide);

            if (callback) {
                callback[type].call(this, $(activeSlide));
            }
        },

        /*
         滑动前的处理
         */
        beforeProcess: function (slide) {
            var type = 'before';

            this.process(slide, type);
        },

        /*
         滑动后的处理
         */
        afterProcess: function (slide) {
            var type = 'after';

            this.process(slide, type);
        },

        /*
         选中激活的页面属性
         */
        selActiveSlide: function (slide) {
            var conf = null,
                activeIndex = slide.activeIndex;
            this.slidesConf.forEach(function (value) {
                if (value.index === activeIndex) {
                    conf = value;
                }
            });

            return conf;
        }
    };

    return new Slides();
});