// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

console.log("Running renderer");

// Include synaptic for NN


var canvas = document.getElementById("my_canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

const drawables = [];

class Circle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.angle = 0;
        this.accel = 1;
        this.innerColor = "green";
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-this.x, -this.y);
        ctx.arc(this.x, this.y, this.radius * 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.innerColor;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.radius*2,this.y);
        ctx.stroke();
        ctx.restore();
    }
};

const init = () => {
    c1 = new Circle();
    c1.x = width/4;
    c1.y = height/2;
    c1.radius = 10;
    c1.angle = 90;

    c2 = new Circle();
    c2.x = width*3/4;
    c2.y = height/2;
    c2.radius = 10;
    c2.innerColor = "red";

    drawables.push(c1, c2);
};

init();

const render = () => {
    console.log("Rendering");

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();
    ctx.restore();

    for (dw of drawables) {
        dw.draw(ctx);
        dw.angle += 1;
    }
};

setInterval(render, 1000/10);