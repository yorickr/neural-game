const Circle = require("./circle.js");
const ShooterNetwork = require("./network.js");


class Player {
    constructor(brain) {
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
        this.parent = null;
        this.hitCount = 0; // times hit by enemy
        this.points = 0; // times the enemy was hit.

        this.timeSinceShot = 0;

        if (brain) {
            this.brain = brain;
        } else {
            this.brain = new ShooterNetwork(5, 10, 3);
        }
    }

    copy(brain) {
        var p = new Player(brain);
        return p;
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
        // this.angle += 10;
        if (this.timeSinceShot >= 0) {
            this.timeSinceShot++;
        }
    }

    think(enemy, bullet) {
        // give nn inputs
        
        var inputs = [
            // my speed
            this.accel,
            // my angle
            this.angle,
            // dis to nearest bullet. what if no bullet.
            // enemy x
            enemy.x,
            // enemy y
            enemy.y,
            // time to next shot
            this.timeSinceShot
        ];

        // read outputs.
        var outputs = this.brain.activate(inputs);
        // console.log("Outputs", outputs);
        var angle = outputs[0];
        var speed = outputs[1];
        var shoot = outputs[2];

        this.angle += 360/4 * angle;
        this.accel = (speed > 0.5 ? 1 : -1) * 10;
        if (shoot > 0.5) {
            this.fire();
        }
    }

    fire() {
        var bullet = undefined;
        if (this.timeSinceShot >= 100) {
            bullet = new Circle();
            bullet.x = this.x;
            bullet.y = this.y;
            bullet.angle = this.angle;
            bullet.radius = 1;
            bullet.accel = 10;
            bullet.parent = this;
            this.timeSinceShot = 0;
        }
        return bullet;
    }
    
    evolve() {
        
    }
};

module.exports = Player;