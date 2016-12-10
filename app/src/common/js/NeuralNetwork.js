/**
 * Created by cooperanderson on 12/9/16 AD.
 */

const Color = require("./Color");
const seedrandom = require("seedrandom");
const clone = require("clone");

let seed = 1;
let seedRandom = seedrandom(seed);

function random(min=0, max=1, func=function(value) {return value;}, inclusive=true) {
	if (min == 0 && max == 1) {
		return seedRandom();
	} else {
		return func((seedRandom() * (max - min + inclusive)) + min);
	}
}

function maxArray(array=[0]) {
	let max = array[0];
	for (let i = 0; i < array.length; i++) {
		if (max < array[i]) {
			max = array[i];
		}
	}
	return max;
}
function minArray(array=[0]) {
	let min = array[0];
	for (let i = 0; i < array.length; i++) {
		if (min > array[i]) {
			min = array[i];
		}
	}
	return min;
}

/**
 * The Neuron class
 */
class Neuron {
	constructor(isInput=false) {
		this.isInput = isInput;
		this.size = 10;
		this.color = Color.colors.material.lightBlue[0];
		this.value = 0;
	}
	Sigmoid(value) {
		return 1/(1+Math.pow(Math.E, -value));
	}
	GetValue() {
		return this.value;
	}
	SetValue(value) {
		this.value = value;
	}
	Update(synapses=[]) {
		if (!this.isInput) {
			let total = 0;
			for (let s in synapses) {
				total += synapses[s].weight * synapses[s].neuron.Update();
			}
			this.SetValue(this.Sigmoid(total));

		}
		return this.GetValue();
	}
}

/**
 * The Synapse
 */
class Synapse {
	constructor(neuron) {
		this.neuron = neuron;
		this.weight = 1;
	}
}

/**
 * The Neural Network class
 */
class NeuralNetwork {
	constructor(inputLayer=['A', 'B', 'C'], outputLayer=['O'], hiddenLayers=[]) {
		this.inputs = clone(inputLayer);
		this.outputs = clone(outputLayer);
		for (let i = 0; i < this.inputs.length; i++) {
			if (typeof this.inputs[i] == 'string') {
				this.inputs[i] = {name: this.inputs[i]};
			}
			if (this.inputs[i].color == undefined) {
				this.inputs[i].color = Color.colors.material.blue[0];
			}
		}
		for (let i = 0; i < this.outputs.length; i++) {
			if (typeof this.outputs[i] == 'string') {
				this.outputs[i] = {name: this.outputs[i]};
			}
			if (this.outputs[i].color == undefined) {
				this.outputs[i].color = Color.colors.material.blue[0];
			}
		}
		this.synapses = [];
		this.layers = [this.inputs.length];
		for (let layer = 0; layer < hiddenLayers.length; layer++) {
			this.layers.push(hiddenLayers[layer]);
		}
		this.layers.push(this.outputs.length);
		this.maxLayerCount = maxArray(this.layers);
		for (let synapseLayer = 0; synapseLayer < this.layers.length - 1; synapseLayer++) {
			this.synapses.push([]);
			for (let neuronA = 0; neuronA < this.layers[synapseLayer]; neuronA++) {
				this.synapses[synapseLayer].push([]);
				for (let neuronB = 0; neuronB < this.layers[synapseLayer + 1]; neuronB++) {
					this.synapses[synapseLayer][neuronA].push(random(-1, 1, undefined, false));
				}
			}
		}
	}
	static Sigmoid(value) {
		return 1/(1+Math.pow(Math.E, -value));
	}
	Think(inputs=[], sigma=undefined, drawSynapses=1, drawLabels=true, graphColor=Color.colors.material.lightBlue[0]) {
		let values = [inputs];

		for (let layer = 1; layer < this.layers.length; layer++) {
			values.push([]);
			for (let nodeB = 0; nodeB < this.layers[layer]; nodeB++) {
				let total = 0;
				for (let nodeA = 0; nodeA < this.synapses[layer-1].length; nodeA++) {
					total += values[layer-1][nodeA] * this.synapses[layer-1][nodeA][nodeB];
				}
				values[layer].push(NeuralNetwork.Sigmoid(total));
			}
		}

		if (sigma) {
			sigma.graph.clear();
			for (let x = 0; x < this.layers.length; x++) {
				for (let y = 0; y < this.layers[x]; y++) {
					sigma.graph.addNode({
						id: `${x}-${y}`,
						label: (drawLabels) ? Number(values[x][y].toFixed(2)).toLocaleString() : undefined,
						x: x * 8/3,/// ((this.maxLayerCount + 1) / this.maxLayerCount),
						y: ((this.maxLayerCount - this.layers[x])/2) + y,
						size: 10,
						color: function(self) {
							if (x == 0) {
								return Color.parse(self.inputs[y].color.cssHEX()).setLightness(values[x][y]).cssHEX();
							} else if (x == self.layers.length - 1) {
								return Color.parse(self.outputs[y].color.cssHEX()).setLightness(values[x][y]).cssHEX();
							}
							return Color.parse(graphColor.cssRGB()).setLightness(values[x][y]).cssHEX()
						}(this)
					});
				}
			}
			if (drawSynapses) {
				for (let layer = 0; layer < this.synapses.length; layer++) {
					for (let a = 0; a < this.synapses[layer].length; a++) {
						for (let b = 0; b < this.synapses[layer][a].length; b++) {
							if (values[layer][a] != 0) {
								sigma.graph.addEdge({
									id: `${layer}-${a}-${b}`,
									source: `${layer}-${a}`,
									target: `${layer + 1}-${b}`,
									//color: "#2a2a2b"
									color: function (self) {
										if (drawSynapses == 1) {
											return Color.lerp([Color.colors.material.red[0], Color.colors.material.grey[0], Color.colors.material.grey[0], Color.colors.material.lightGreen[0]], (self.synapses[layer][a][b] + 1) / 2).cssHEX();
										} else if (drawSynapses == 2) {
											return Color.lerp([new Color("#2a2a2b"), Color.lerp([Color.colors.material.red[0], Color.colors.material.grey[0], Color.colors.material.grey[0], Color.colors.material.lightGreen[0]], (self.synapses[layer][a][b] + 1) / 2)], values[layer][a]).cssHEX();
										}
									}(this)
									//color:
								});
							}
						}
					}
				}
			}
			sigma.refresh();
		}
		let output = {};
		let count = 0;
		this.outputs.forEach(function(item, index) {
			output[item.name] = values[values.length - 1][index];
		})
		return output;
		/*sigma.graph.clear();
		for (let x = 0; x < this.layers.length; x++) {
			for (let y = 0; y < this.layers[x]; y++) {
				sigma.graph.addNode({
					id: `${x}-${y}`,
					label: ((x == 0 || x == this.layers.length - 1) && drawLabels) ? ((x == 0) ? inputs[y].toString() : this.outputs[y]) : undefined,
					x: x / ((this.maxLayerCount + 1) / this.maxLayerCount),
					y: ((this.maxLayerCount - this.layers[x])/2) + y,
					size: 10,
					color: Color.colors.material.lightBlue[0].cssHEX()
				});
			}
		}
		for (let layer = 0; layer < this.synapses.length; layer++) {
			for (let a = 0; a < this.synapses[layer].length; a++) {
				for (let b = 0; b < this.synapses[layer][a].length; b++) {
					sigma.graph.addEdge({
						id: `${layer}-${a}-${b}`,
						source: `${layer}-${a}`,
						target: `${layer+1}-${b}`,
						color: Color.lerp([Color.colors.material.red[0], Color.colors.material.grey[0], Color.colors.material.grey[0], Color.colors.material.lightGreen[0]], (this.synapses[layer][a][b]+1)/2).cssHEX()
					});
				}
			}
		}
		sigma.refresh();*/
	}
}

module.exports = {Neuron, Synapse, NeuralNetwork, random};