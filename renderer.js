// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

console.log("Running renderer");

// Include synaptic for NN

var synaptic = require('synaptic');
var {Neuron,Layer, Network, Trainer, Architect} = synaptic;

const Player = require("./player.js");
const Circle = require("./circle.js");
const ShooterNetwork = require("./network.js");

var canvas = document.getElementById("my_canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

const objects = [];

const pastPlayers = [];
var playerPos = 0;


var seconds = 0;
var count = 0;
const updateInterval = 30;

document.addEventListener('keypress', (event) => {
    console.log(event);
    switch(event.key) {
        case 'n':
            console.log("Starting new generation");
            break;
    }
});



// NN inputs
// own speed & angle
// dis to nearest enemy bullet
// enemy player's x and y
// time to next shot

// NN outputs
// angle of the next move.
// speed of the next move.
// to shoot or not.

// var myPerceptron = new ShooterNetwork(2,3,1);
// var myTrainer = new Trainer(myPerceptron);

// console.log(myTrainer.XOR()); 

// for (let i = 0; i < 2; i++) {
//     for (let j = 0; j < 2; j++) {
//         console.log(myPerceptron.activate([i,j]));
//     }
// }

const intersectCircle = (obj1, obj2) => {
    let dist = Math.sqrt(
        Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)
    );
    if (dist < obj1.radius + obj2.radius) {
        return true;
    } 
    return false;
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

    pastPlayers.push([c1, c2]);
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
    for (let i = 0; i < objects.length; i++) {
        let movable = objects[i];

        // check against all other objects if collides.

        for (let j = 0; j < objects.length; j++) {
            let movable2 = objects[j];
            let bothPlayer = (movable instanceof Player && movable2 instanceof Player);
            let bothCircle = (movable instanceof Circle && movable2 instanceof Circle);
            // if not same object, if not both player, if not both circle, if not the shooter
            if (movable !== movable2 && !bothPlayer && !bothCircle && movable.parent !== movable2 && movable2.parent !== movable) {
                if (intersectCircle(movable, movable2)) {
                    console.log("These circles intersect!");
                    if (!(movable instanceof Player)) { // if movable the circle
                        objects.splice(i, 1);
                        movable2.hitCount++;
                    } else { // movable2 is the circle
                        objects.splice(j, 1);
                        movable.hitCount++;
                    }
                }
            }

        }
        // fire
        if (movable instanceof Player) {
            if (Math.random() < 0.01) {
                var bullet = movable.fire();
                if (bullet) {
                    objects.push(bullet);
                }
            }
            // pass on the nearest enemy
            var enemy = players[playerPos].filter((val) => {
                return val !== movable;
            })[0];
            var bullets = objects.filter((val) => {
                return val instanceof Circle;
            });
            bullets.sort((a, b) => {
                let disA = Math.sqrt(
                    Math.pow(a.x - movable.x, 2) +
                    Math.pow(a.y - movable.y, 2)
                );
                let disB = Math.sqrt(
                    Math.pow(b.x - movable.x, 2) +
                    Math.pow(b.y - movable.y, 2)
                );
                if (disA < disB) {
                    return -1;
                } else if (disA > disB) {
                    return 1;
                } else {
                    return 0;
                }
            });
            // console.log(bullets);
            if (bullets[0]) {
                movable.think(enemy, bullets[0]);
            } else {
                movable.think(enemy, null);
            }
        }
        // move
        movable.move(1);
        // delete if too far
        if (movable.x < 0 || movable.x > width || movable.y < 0 || movable.y > height) {
            // delete
            objects.splice(i, 1);
        }
    }

    // GA fit condition
    // hitcount
    count++;
    if (count % updateInterval == 0) {
        seconds++;
        console.log(seconds);
    }
    if (seconds / 10 == 1) {
        console.log("Evolving");

        seconds = 0;
    }
};

setInterval(render, 1000/60);
setInterval(update, 1000/updateInterval);