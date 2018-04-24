class Circle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.angle = 0;
        this.accel = 1;
        this.innerColor = "green";
        this.parent = null;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.innerColor;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        ctx.restore();
    }

    move(deltatime) {
        this.x += deltatime * this.accel * Math.cos(this.angle * Math.PI/180);
        this.y += deltatime * this.accel * Math.sin(this.angle * Math.PI/180);
    }
};

module.exports = Circle;