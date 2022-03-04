window.onload = function () {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var WIDTH = canvas.width = document.documentElement.clientWidth;
    var HEIGHT = canvas.height = document.documentElement.clientHeight;
    var color = ['#f00', '#ff0', '#0f0', '#0ff'];
    const direct = [1, 2, 3, 4, 5, 6, 7, 8];

    function CircleItem(x, y) {
        this.x = x;
        this.y = y;
        this.r = Math.floor(Math.random() * 20 + 12);
        this.color = color[Math.floor(Math.random() * 4)];
        this.speed = Math.random() * 10;
        this.symbol = direct[Math.floor(Math.random() * 8)];
        this.angle = Math.random();
    }

    CircleItem.prototype.drawSolid = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    CircleItem.prototype.move = function () {
        switch (this.symbol) {
            case 1:
                this.x += this.speed;
                this.y += this.speed * this.angle;
                break;
            case 2:
                this.y += this.speed;
                this.x += this.speed * this.angle;
                break;
            case 3:
                this.x -= this.speed;
                this.y += this.speed * this.angle;
                break;
            case 4:
                this.y -= this.speed;
                this.x += this.speed * this.angle;
                break;
            case 5:
                this.x -= this.speed;
                this.y -= this.speed * this.angle;
                break;
            case 6:
                this.y -= this.speed;
                this.x -= this.speed * this.angle;
                break;
            case 7:
                this.x += this.speed;
                this.y -= this.speed * this.angle;
                break;
            case 8:
                this.y -= this.speed;
                this.x += this.speed * this.angle;
                break;
            default:
                break;
        }
        if(this.r > 0.1){
            this.r -= 1;
        }
    }

    canvas.onclick = function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var circles = [];
        for (var i = 0; i < 30; i++) {
            circles[i] = new CircleItem(x, y);
            circles[i].drawSolid();
        }

        function animate() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            for (circle of circles) {
                circle.move();
                circle.drawSolid();
            }
            requestAnimationFrame(animate);
        }

        animate();
    }
}
