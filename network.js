var synaptic = require('synaptic');
var {Neuron,Layer, Network, Trainer, Architect} = synaptic;


function ShooterNetwork(input, hidden, output)
{
	// create the layers
	var inputLayer = new Layer(input);
	var hiddenLayer = new Layer(hidden);
	var outputLayer = new Layer(output);

	// connect the layers
	inputLayer.project(hiddenLayer);
	hiddenLayer.project(outputLayer);

	// set the layers
	this.set({
		input: inputLayer,
		hidden: [hiddenLayer],
		output: outputLayer
    });
    // console.log(this);
}

// extend prototype chain
ShooterNetwork.prototype = new Network();
ShooterNetwork.prototype.constructor = ShooterNetwork;

module.exports = ShooterNetwork;