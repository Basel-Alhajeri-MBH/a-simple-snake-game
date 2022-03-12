// (C) (MBH)
(function(g) {
    'use strict';
    var x = 0;
    var y = 0;
    var dx = 0;
    var dy = 0;
    var dir = 'R';
    var doc = g.document;
    var listener = g.addEventListener;
    var Math = g.Math;
    var JSON = g.JSON;
    var Array = g.Array;
    var CanvasRenderingContext2D = g.CanvasRenderingContext2D;
    var sleep = g.setTimeout.bind(g);
    var min = Math.min.bind(Math);
    var abs = Math.abs.bind(Math);
    var floor = Math.floor.bind(Math);
    var round = Math.round.bind(Math);
    var random = Math.random.bind(Math);
    var DOM_LOADED = "DOMContentLoaded";
    var TOUCH_START = "touchstart";
    var TOUCH_END = "touchend";
    var WEIGHT = 20;
    var HEIGHT = floor(g.innerHeight / WEIGHT) * WEIGHT;
    var WIDTH = floor(g.innerWidth / WEIGHT) * WEIGHT;
    var MIN = min(WIDTH, HEIGHT);
    var SIZE = floor(MIN / WEIGHT);
    var SPEED = SIZE;
    var MIN_LENGTH_SQUARES = floor(MIN / SIZE);
    var Snake = function Snake(context, x, y, length, color) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.length = length;
        this.body = new Array(length);
        this.color = color;
    };
    var Dot = function Dot(context) {
        this.context = context;
        this.update();
    };
    var drawFPS = function(context, fps) {
        context.font = "courier 12px";
        context.fillStyle = "red";
        context.fillText("FPS: "+fps, 15, 10);
    };
    var frame = 4;
    var t = 0;
    var dot;
    var body;
    var node;
    var append;
    //SIZE -= SIZE % WEIGHT;
    HEIGHT -= HEIGHT % SIZE;
    WIDTH -= WIDTH % SIZE;
    Snake.prototype.draw = function () {
        var dot;
        this.context.beginPath();
        for(dot of this.body) {
            CanvasRenderingContext2D.prototype.rect.apply(
                    this.context,
                    Array.prototype.concat.apply(
                        dot, [SIZE, SIZE]
                    )
                );
        }
        this.context.fillStyle = this.color;
        this.context.strokeStyle = "white";
        this.context.fill();
        this.context.stroke();
    };
    Snake.prototype.update = function() {
        var clone;
        var i;
        if(this.body[0] === undefined)
            this.body[0] = [this.x, this.y];
        for(i = 1; i < this.length; i++) {
            if(this.body[i] === undefined) {
                this.body[i] = this.body[0];
            }
        }
        clone = JSON.parse(JSON.stringify(this.body.slice(0, -1)));
        if(dir === 'R')
            this.body[0][0] += SPEED;
        else if(dir === 'L')
            this.body[0][0] -= SPEED;
        else if(dir === 'U')
            this.body[0][1] -= SPEED;
        else if(dir === 'D')
            this.body[0][1] += SPEED;
        //if(this.body[0][0]%SIZE==0)
        if(this.body[0][0] === dot.x && this.body[0][1] === dot.y) {
            this.length++;
            dot.update();
        }
        if(this.body[0][0] < 0) this.body[0][0] = WIDTH - SIZE;
        if(this.body[0][0] + SIZE > WIDTH) this.body[0][0] = 0;
        if(this.body[0][1] + SIZE > HEIGHT) this.body[0][1] = 0;
        if(this.body[0][1] < 0) this.body[0][1] = HEIGHT - SIZE;
        this.body = Array.prototype.concat.apply(
            [this.body[0]], [clone]);
    };
    Dot.prototype.draw = function() {
        this.context.beginPath();
        this.context.rect(this.x, this.y, SIZE, SIZE);
        this.context.fillStyle = 'red';
        this.context.fill();
    };
    Dot.prototype.update = function() {
         do {
            this.x = floor(random() * (WIDTH / SIZE)) * SIZE;
            this.y = floor(random() * (HEIGHT / SIZE)) * SIZE;
        } while(this.x > WIDTH || this.y > HEIGHT);
    };
    listener.call(
        g,
        TOUCH_START,
        function(event) {
            var touches = event.changedTouches[0];
            x = touches.clientX;
            y = touches.clientY;
        }
    );
    listener.call(
        g,
        TOUCH_END,
        function(event) {
            var touches = event.changedTouches[0];
            dx = touches.clientX - x;
            dy = touches.clientY - y;
            if(abs(dx) > abs(dy)) { // && dir !== 'R' || dir !== 'L' -> 4 no ops dir
                dir = dx > 0 ? 'R' : 'L';
            } else {
                dir = dy > 0 ? 'D' : 'U';
            }
        }
    );
    listener.call(
        g,
        DOM_LOADED,
        init
    );
    function init() {
        body = doc.body;
        node = doc.createElement.bind(doc);
        append = body.append || body.appendChild;
        var canvas = node("canvas");
        var ctx = canvas.getContext("2d");
        var snake = new Snake(ctx, SIZE, SIZE, 3, "darkblue");
        dot = new Dot(ctx);
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        //canvas.style.margin = (g.innerHeight - HEIGHT) / 2 + "px " + (g.innerWidth - WIDTH) / 2 + "px"
        body.style.margin = 0;
        append.call(body, canvas);
        void function animate() {
            var tp = (Date.now() - t) / 1000;
            t = Date.now();
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            dot.draw();
            snake.update();
            snake.draw();
            drawFPS(ctx, (1 / tp).toFixed(2));
            sleep(animate, 1000 / frame);
            //requestAnimationFrame(animate)
        }();
    }
})(this.window||this);
