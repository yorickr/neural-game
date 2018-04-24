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

const players = [];
var playerPos = 0;
const playerSize = 6; // generation


var seconds = 0;
var count = 0;
const updateInterval = 30;

var generation = 0;
const oldGenerations = [];

document.addEventListener('keypress', (event) => {
    // console.log(event);
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
    // make playerSize amount of player pairs
    for (let i = 0; i < playerSize; i++) {
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
        c2.good = false;
        c2.boundingBox = {
            x: width/2,
            y: 0,
            width: width/2,
            height: height
        };
        c2.angle = 180;
        players.push([c1, c2]);
    }
    
    playerPos = 0;
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
    for (pl of players[playerPos]) {
        pl.draw(ctx);
    }
};

const sumForParam = (cur, next, param) => {
    return cur + next[param];
};

const evolve = () => {
    let allPlayersFlat = players.reduce((cur, next) => {
        cur.push(...next);
        return cur;
    }, []);
    // gotta go fest
    allPlayersFlat.forEach(player => {
        player.points = Math.pow(player.points, 2);
        player.hitCount = Math.pow(player.hitCount, 2);
    });
    // hit points is good
    let sumPoints = allPlayersFlat.reduce((c, n) => sumForParam(c, n, "points"), 0);

    // be hit is bad
    let sumHits = allPlayersFlat.reduce((c, n) => sumForParam(c, n, "hitCount"), 0);

    allPlayersFlat.forEach((player) => {
        // TODO: fix
        if (sumPoints !== 0) {
            player.fitness = (player.points / sumPoints);
        }
    });

    // make new generation with existing players.

};


const update = () => {    
    for (let i = 0; i < objects.length; i++) {
        let movable = objects[i];

        // collision
        for (pl of players[playerPos]) {
            if (movable.parent !== pl) {
                if (intersectCircle(pl, movable)) {
                    console.log("Circle intersects with player!");
                    objects.splice(i, 1);
                    pl.hitCount++;
                }
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

    for (pl of players[playerPos]) {
        if (Math.random() < 0.01) {
            var bullet = pl.fire();
            if (bullet) {
                objects.push(bullet);
            }
        }
        // pass on the nearest enemy
        var enemy = players[playerPos].filter((val) => {
            return val !== pl;
        })[0];
        pl.think(enemy);
        pl.move(1);
    }
    debugger;
    console.log("Evolving");
    evolve();
    // GA fit condition
    // hitcount
    count++;
    if (count % updateInterval == 0) {
        seconds++;
        console.log(seconds);
    }
    if (seconds / 10 == 1) {
        if (playerPos < playerSize - 1) {
            console.log("Letting next pair play");
            playerPos++;
            objects.length = 0;
        } else {
            // time for a new generation.
            playerPos = 0;
            console.log("Evolving");
            evolve();
        }
        
        seconds = 0;
    }
};

setInterval(render, 1000/60);
setInterval(update, 1000/updateInterval);