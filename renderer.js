// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

console.log("Running renderer");

// Include synaptic for NN


var canvas = document.getElementById("my_canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

const objects = [];
const players = [];

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

class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.angle = 0;
        this.accel = 1;
        this.innerColor = "green";
        this.boundingBox = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
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

    move(deltatime) {
        if (this.x >= this.boundingBox.x && this.x <= this.boundingBox.x + this.boundingBox.width) {
            this.x += deltatime * this.accel * Math.cos(this.angle * Math.PI/180);
        }
        if (this.y >= this.boundingBox.y && this.y <= this.boundingBox.y + this.boundingBox.height) {
            this.y += deltatime * this.accel * Math.sin(this.angle * Math.PI/180);
        }
        this.angle += 10;
    }

    fire() {
        var bullet = new Circle();
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.angle = this.angle;
        bullet.radius = 1;
        bullet.accel = 10;
        objects.push(bullet);
    }
};

const init = () => {
    c1 = new Player();
    c1.x = width/4;
    c1.y = height/2;
    c1.radius = 10;
    c1.angle = 0;
    c1.boundingBox = {
        x: 0,
        y: 0,
        width: width/2,
        height: height
    };

    c2 = new Player();
    c2.x = width*3/4;
    c2.y = height/2;
    c2.radius = 10;
    c2.innerColor = "red";
    c2.boundingBox = {
        x: width/2,
        y: 0,
        width: width/2,
        height: height
    };
    c2.angle = 180;

    players.push(c1, c2);
    objects.push(c1, c2);
};

init();

const render = () => {

    // clear screen.
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();
    ctx.rect(0, 0, width, height);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();

    for (dw of objects) {
        dw.draw(ctx);
    }
};

const update = () => {
    for (player of players) {
        if (Math.random() < 0.01) {
            player.fire();
        }
    }
    
    for (let i = 0; i < objects.length; i++) {
        let movable = objects[i];
        movable.move(1);
        if (movable.x < 0 || movable.x > width || movable.y < 0 || movable.y > height) {
            // delete
            objects.splice(i, 1);
        }
    }

};

setInterval(render, 1000/60);
setInterval(update, 1000/30);