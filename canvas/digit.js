// 数字是利用点阵来做的,为1的点有圆
digit =[
    [
        [0,0,1,1,1,0,0],
        [0,1,1,0,1,1,0],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,0,1,1,0],
        [0,0,1,1,1,0,0]
    ],//0
    [
        [0,0,0,1,1,0,0],
        [0,1,1,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [1,1,1,1,1,1,1]
    ],//1
    [
        [0,1,1,1,1,1,0],
        [1,1,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,0,0],
        [0,0,1,1,0,0,0],
        [0,1,1,0,0,0,0],
        [1,1,0,0,0,0,0],
        [1,1,0,0,0,1,1],
        [1,1,1,1,1,1,1]
    ],//2
    [
        [1,1,1,1,1,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,0,0],
        [0,0,1,1,1,0,0],
        [0,0,0,0,1,1,0],
        [0,0,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,1,1,0]
    ],//3
    [
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,1,0],
        [0,0,1,1,1,1,0],
        [0,1,1,0,1,1,0],
        [1,1,0,0,1,1,0],
        [1,1,1,1,1,1,1],
        [0,0,0,0,1,1,0],
        [0,0,0,0,1,1,0],
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,1,1]
    ],//4
    [
        [1,1,1,1,1,1,1],
        [1,1,0,0,0,0,0],
        [1,1,0,0,0,0,0],
        [1,1,1,1,1,1,0],
        [0,0,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,1,1,0]
    ],//5
    [
        [0,0,0,0,1,1,0],
        [0,0,1,1,0,0,0],
        [0,1,1,0,0,0,0],
        [1,1,0,0,0,0,0],
        [1,1,0,1,1,1,0],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,1,1,0]
    ],//6
    [
        [1,1,1,1,1,1,1],
        [1,1,0,0,0,1,1],
        [0,0,0,0,1,1,0],
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,0,0],
        [0,0,0,1,1,0,0],
        [0,0,1,1,0,0,0],
        [0,0,1,1,0,0,0],
        [0,0,1,1,0,0,0],
        [0,0,1,1,0,0,0]
    ],//7
    [
        [0,1,1,1,1,1,0],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,1,1,0],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,1,1,0]
    ],//8
    [
        [0,1,1,1,1,1,0],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [1,1,0,0,0,1,1],
        [0,1,1,1,0,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,0,1,1],
        [0,0,0,0,1,1,0],
        [0,0,0,1,1,0,0],
        [0,1,1,0,0,0,0]
    ],//9
    [
        [0,0,0,0],
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0],
        [0,0,0,0]
    ]//:
];
window.onload = function () {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'),
        x = 24,
        update,
        dValue,
        balls = [],
        colors = ['#33B5E5','#0099CC','#AA66CC','#9933CC','#99CC00','#669900','#FFBB33'],
        dateD = new Date(),
        dateEnd = new Date(dateD.getFullYear(),dateD.getMonth(),dateD.getDate());
    function getGlobalTime() {
        var date = new Date();
        dValue = Math.abs(parseInt((dateEnd.valueOf() - date.valueOf()) / 1000));
    }
    function getPartTime() {
        var date = new Date(),
            value = Math.abs(parseInt((dateEnd.valueOf() - date.valueOf()) / 1000));
        return value;
    }
    getGlobalTime();
    // setInterval(getGlobalTime,1000);
    function render () {
        var date = new Date(),
            nextDvalue = getPartTime(),
            hours = parseInt(dValue / 3600),
            minute = parseInt(dValue / 60 % 60),
            seconds = parseInt(dValue % 60),
            nextHours = parseInt(nextDvalue / 3600),
            nextMinute = parseInt(nextDvalue / 60 % 60),
            nextSeconds = parseInt(nextDvalue % 60);
        function renderDetail(x,num) {
            var arr = digit[num],
                len = arr.length;
            for (var i = 0;i < len; i++) {
                var sLen = arr[i].length;
                for (var j = 0; j < sLen; j++) {
                    if (arr[i][j] == 1) {
                        context.beginPath();
                        context.fillStyle = "rgb(0,102,153)";
                        context.arc(x + 20 * j,150 + 20* i,9,0,2 * Math.PI);
                        context.fill();
                        context.closePath(); 
                    }
                }
            }
            return x + 20 * j;
        }
        x = renderDetail(x,parseInt(hours / 10));
        x = renderDetail(x,(hours % 10));
        x = renderDetail(x,10);
        x = renderDetail(x,parseInt(minute / 10));
        x = renderDetail(x,(minute  % 10));
        x = renderDetail(x,10);
        x = renderDetail(x,parseInt(seconds / 10));
        x = renderDetail(x,(seconds % 10));
        x = 24;
        var ballLen = balls.length;
        for (var i = 0; i < ballLen; i++) {
            context.beginPath();
            context.fillStyle = balls[i].color;
            context.arc(balls[i].x,balls[i].y,balls[i].radius,0,2 * Math.PI);
            context.fill();
            context.closePath();  
        }
        function update() {
            if (parseInt(hours / 10) != parseInt(nextHours / 10)) {
                addBall(0,0,parseInt(hours / 10));
            }
            if (hours % 10 != nextHours % 10) {
                addBall(0,1,hours % 10);
            } 
            if (parseInt(minute / 10) != parseInt(nextMinute / 10)) {
                addBall(1,2,parseInt(minute / 10));
            }
            if (minute  % 10 != nextMinute % 10) {
                addBall(1,3,minute  % 10);
            }
            if (parseInt(seconds / 10) != parseInt(nextSeconds / 10)) {
                addBall(2,4,parseInt(seconds / 10));
            }
            if (seconds % 10 != nextSeconds % 10) {
                addBall(2,5,seconds % 10);
            }
            dValue = nextDvalue;
            (function () {
                var len = balls.length;
                for (var i = 0; i < len; i++) {
                    if (balls[i].y >= canvas.height - balls[i].radius) {
                        balls[i].y = canvas.height - balls[i].radius;
                        balls[i].vy = -balls[i].vy * 0.6;
                    }
                    balls[i].x += balls[i].vx;
                    balls[i].y += balls[i].vy;
                    balls[i].vy += balls[i].g;
                }
            })();
        }
        update();
    }
    setInterval(function () {
        // 清除canvas画布样式
        context.clearRect(0,0,canvas.width,canvas.height);
        render();
    },50);
    function addBall(fh,index,num) {
        var arr = digit[num],
            len = arr.length;
        for (var i = 0; i < len; i++) {
            var sLen = arr[i].length;
            for (var j = 0; j < sLen; j++) {
                if (arr[i][j] == 1) {
                    var uniqueBall = {
                        x: x + 20 * j + 140 * index + 80 * fh,
                        y: 150 + 20* i,
                        vy: -5,
                        radius: 9,
                        vx: Math.pow(-1,Math.ceil(Math.random() * 1000)) * 4,
                        g: 1.5 + Math.random(),
                        color: colors[Math.floor(Math.random() * colors.length)]
                    }
                    balls.push(uniqueBall);
                }
            }
        }
        var ballLen = balls.length,
            node = 0;
        for (var j = 0; j < ballLen; j++) {
            if (balls[j].x + balls[j].radius >= 0 && balls[j].x + balls[j].radius <= canvas.width) {
                balls[node++] = balls[j];
            }
        }
        balls = balls.slice(0,node);
    }
}
