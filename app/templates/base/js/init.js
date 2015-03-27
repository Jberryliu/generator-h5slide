define('init', [], function (require) {
    function Init() {
        this.images = [__images__];
        this.$loading = $('#loading');
        this.$stage = $('#stage');

        this.loadImage();
    }

    Init.prototype = {
        constructor: Init,
        /*
            加载图片
         */
        loadImage: function () {
            var len = this.images.length,
                curLen = 0,
                $loadingProgress = this.$loading.find('.progress');

            var time = setInterval(function () {
                $loadingProgress.text(Math.floor((curLen / len) * 100) + '%');
                console.log(Math.floor((curLen / len) * 100) + '%');
                if (curLen === len) {
                    clearInterval(time);
                    time = null;
                    console.log('图片加载完成');
                    this.initPages();
                }
            }.bind(this), 100);

            function loadFn() {
                curLen++;
            }

            for (var i = 0; i < len; i++) {
                var img = new Image();
                img.path = this.images[i];
                img.onload = loadFn;
                img.src = img.path;
            }

        },
        /*
            初始化舞台
         */
        initPages: function(){
            this.$loading.hide();
            this.$stage.show();
            require('stage');
        }

    };

    new Init();
});