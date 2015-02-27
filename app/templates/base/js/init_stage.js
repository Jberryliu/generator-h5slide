define('init_stage', [], function () {
    function Init() {
        this.drawProgressBar();
    }

    Init.prototype = {
        constructor: Init,

        drawProgressBar: function () {
            var stage = new Kinetic.Stage({
                container: 'loading',
                width: 300,
                height: 300
            });

            var layer = new Kinetic.Layer();

            var wedge = new Kinetic.Wedge({
                x: stage.getWidth() / 2,
                y: stage.getHeight() / 2,
                radius: 70,
                fill: 'green',
                stroke: '#F00',
                strokeWidth: 10,
                angleDeg: 5,
                rotationDeg: -120
            });

            layer.add(wedge);
            stage.add(layer);

            var anim = new Kinetic.Animation(function (frame) {
                var angleDeg = wedge.angle();
                if (angleDeg < 360) {
                    wedge.angle(angleDeg + 5);
                }
            }, layer);
            anim.start();

        },

        loadImage: function () {
            var self = this,
                images = [
                    //todo
                ],
                len = images.length,
                curLen = 0;

            var time = setInterval(function () {
                console.log(Math.floor((curLen / len) * 100) + '%');
                if (curLen === len) {
                    clearInterval(time);
                    time = null;
                    console.log('图片加载完成');
                    //self.initGame();
                }
            }, 10);

            function loadFn() {
                curLen++;
            }

            for (var i = 0; i < len; i++) {
                var img = new Image();
                img.path = images[i];
                img.onload = loadFn;
                img.src = img.path;
            }

        }

    };

    new Init();
});