define('init', [], function (require) {
    function Init() {
        this.shareConf = {
            title: '百度贴吧开始招募合伙人！',
            desc: '加入贴吧合伙人，即与贴吧开始业内粉丝经济、盈利模式探索。贴吧将向合伙人开放众多行业内一系最具价值的吧，并提供官方特权、独家样式、运营工具、活动支持，无论母婴、数码，还是美容、教育，有行业的地方就有粉丝经济。贴吧期待与你合“火”！',
            link: 'http://tieba.baidu.com/tb/zt/platform/company/index.html',
            imgUrl: 'http://tieba.baidu.com/tb/zt/platform/company/img/logo.jpg'
        };
        this.images = [__images__];
        this.$loading = $('#loading');
        this.$stage = $('#stage');

        this.loadImage();
        this.initWX();
    }

    Init.prototype = {
        constructor: Init,
        /*
         加载图片
         */
        loadImage: function () {
            var curLen = 0,
                initLimit = 0.5,    //图片加载至 50% 即可开始
                len = this.images.length,
                $loadingProgress = this.$loading.find('.progress');

            var time = setInterval(function () {
                $loadingProgress.text(Math.floor((curLen / len) * 100) + '%');

                if (curLen > (len * initLimit)) {
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
         初始化微信分享
         */
        initWX: function () {
            $.ajax({
                url: "/mo/q/getweixintoken",
                type: 'post',
                data: {
                    url: location.href.split('#')[0]
                },
                dataType: 'json',
                success: function (json) {
                    if (json.no === 0) {
                        var signPackage = json.data;

                        wx.config({
                            debug: false,
                            appId: signPackage.appId,
                            timestamp: signPackage.timestamp,
                            nonceStr: signPackage.nonceStr,
                            signature: signPackage.signature,
                            jsApiList: [
                                'checkJsApi',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage'
                            ]
                        });
                        this.initShare();
                    }
                }.bind(this)
            });
        },

        /*
         分享至朋友圈
         */
        initShare: function () {
            wx.ready(function () {
                wx.onMenuShareTimeline(this.shareConf);
                wx.onMenuShareAppMessage(this.shareConf);
                wx.onMenuShareQQ(this.shareConf);
                wx.onMenuShareWeibo(this.shareConf);
            }.bind(this));

        },

        /*
         初始化舞台
         */
        initPages: function () {
            this.$loading
                .addClass('animated fadeOut')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).hide();
                });

            this.$stage.show()
                .addClass('animated fadeIn');

            require('stage');
        }

    };

    new Init();
});