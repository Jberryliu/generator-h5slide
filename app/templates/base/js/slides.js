define('slides', [], function () {
    'use strict';

    function Slides() {
        this.$slides = null;
        this.slidesConf = [];

        this.deviceConf = {
            width: $(window).width(),
            height: $(window).height()
        };

        this.backgroundConf = {
            width: 640,
            height: 1008
        };

        this.config = {
            direction: 'vertical',
            //没有 API 的接口，也不能链式调用 --!
            onSlideChangeStart: $.proxy(this.beforeProcess, this),
            onSlideChangeEnd: $.proxy(this.afterProcess, this)
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
            this.$slides = $('.swiper-container')
                .css({
                    width: this.deviceConf.width,
                    height: this.deviceConf.height
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
            this.initProcess(conf);
            this.slidesConf.push(conf);
        },

        /*
         滑动的处理
         */
        process: function (slide, type) {
            var activeIndex = slide.activeIndex,
                activeSlide = slide.slides[activeIndex],
                callback = this.selActiveSlide(activeIndex);

            if (callback) {
                callback[type].call(this, $(activeSlide));
            }
        },

        /*
         初始化的处理
         */
        initProcess: function (conf) {
            var type = 'init',
                slide = $('#stage').find(conf.selector);

            this.adjustBackground(slide);
            conf[type].call(this, slide);
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
        selActiveSlide: function (activeIndex) {
            var conf = null;

            this.slidesConf.forEach(function (value) {
                if (value.index === activeIndex) {
                    conf = value;
                }
            });

            return conf;
        },

        adjustBackground: function ($slide) {
            var offsetX = 0,
                offsetY = 0,
                sizeConf = '',
                imageWidth = this.backgroundConf.width,
                imageHeight = this.backgroundConf.height,
                imageRadio = imageWidth / imageHeight,
                deviceRadio = this.deviceConf.width / this.deviceConf.height;

            if (imageRadio <= deviceRadio) {
                //设备宽太大，横向剪裁
                var needHeight = Math.floor(imageRadio * this.deviceConf.width);
                offsetY = (needHeight - this.deviceConf.width) / 2;
                sizeConf = '100% auto';
            }
            else if (imageRadio > deviceRadio) {
                //设备高太大，纵向剪裁
                var needWidth = Math.floor(imageRadio * this.deviceConf.height);
                offsetX = (this.deviceConf.width - needWidth) / 2;
                sizeConf = 'auto 100%';
            }
            $slide.css({
                'backgroundSize': sizeConf,
                'backgroundPosition': offsetX + 'px ' + offsetY + 'px'
            });
        }
    };

    return new Slides();
});