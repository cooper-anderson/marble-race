/**
 * Created by cooperanderson on 12/4/16 AD.
 */

const seedrandom = require("seedrandom");
const Color = require("./src/common/js/Color");
const {avatar} = require("./src/common/js/avatar");
const {Neuron, Synapse, NeuralNetwork, random} = require("./src/common/js/NeuralNetwork");
const Sigma = require("sigma");

/**
 * Marble class
 */
class Marble {
	constructor(attr={}) {
		this.name = "Cooper";
		this.avatar = avatar(this.name);
	}
	draw() {
		console.log(``)
	}
	getSvg() {
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g transform="translate(50, 50) rotate(0) scale(1)"><g transform="translate(-50, -50)"><circle cx="50%" cy="50%" r="50%"/><rect x="20%" y="20%" width="60%" height="60%" rx="5%" fill="#F0F0F0"/><g position="absolute" transform="translate(25, 25) scale(10)" width="60%" height="60%">`;
		for (let y in this.avatar.data) {
			for (let x in this.avatar.data[y]) {
				if (this.avatar.data[y][x]) {
					svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${this.avatar.color.cssHEX()}"></rect>`;
				}
			}
		}
		svg += `</g></g></svg>`;
		return svg;
	}
}

function changeColor() {
	setTimeout(function() {
		let color = Color.parse($(".traffic-light-test").css("background-color"));
		color.lightness = 0.6686274509803922;
		$(".traffic-light-test").css("background-color", color.cssRGB());
	}, 1000);
}

function colorShift() {
	setTimeout(function() {
		console.log(setInterval(function () {
			$(".traffic-light").each(function (index, item) {
				let color = Color.parse($(item).css("background-color"));
				color.hue += .01;
				color.lightness =
				$(item).css("background-color", color.cssRGB());
			})
		}, 100));
	}, 1000);
}

function shiftColors() {
	changeColor();
	setTimeout(function() {
		colorShift();
	}, 10);
}

var sigma = new Sigma({
	renderer: {
		container: document.getElementById("neural-network"),
		type: 'canvas'
	},
	settings: {
		doubleClickEnabled: false,
		nodesPowRatio: 1
	}
});

let inputs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']//, 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let ann = new NeuralNetwork(inputs, [{name: 'r', color: Color.colors.material.blue[0]}, {name: 'g', color: Color.colors.material.blue[0]}, {name: 'b', color: Color.colors.material.blue[0]}], []/*[26, 26, 26, 26, 26, 26, 26]*/);
//let values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let keyCodeBits = [0, 0, 0, 0, 0, 0, 0, 0];
let drawSynapses = 2, drawLabels = false, graphColor=Color.colors.material.blue[0], clearEntry = false;
let output = {}
function setRGB() {
	let color = ann.Think(keyCodeBits, sigma, drawSynapses, drawLabels, graphColor);
	output = color;
	//graphColor = new Color(color);
	//ann.Think(values, sigma, drawSynapses, drawLabels, graphColor)
	return new Color(color);
}
function clamp(value, min, max) {
	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	}
	return value;
}
let rgb = setRGB();

$(document).on("keydown", function(event) {
	let keyCode = event.keyCode.toString(2);
	keyCode = '0'.repeat(8 - keyCode.length) + keyCode;
	keyCodeBits = keyCode.split("");
	for (let i in keyCodeBits) {
		keyCodeBits[i] = /*parseInt(*/Number(keyCodeBits[i])/*, 16)*/;
	}
	rgb = setRGB();
	/*let key = inputs.indexOf(event.key);
	if (key != -1) {
		values[key] = clamp(values[key] + .1, 0, 1);
		rgb = setRGB();
	}*/
});

$(document).on("keyup", function(event) {
	if (clearEntry) {
		keyCodeBits = [0, 0, 0, 0, 0, 0, 0, 0];
		rgb = setRGB();
		/*let key = inputs.indexOf(event.key);
		if (key != -1) {
			values[key] = 0
			rgb = setRGB();
		}*/
	}
	/*let key = inputs.indexOf(event.key);
	 if (key != -1) {
	 values[key] = 1
	 ann.Update(values, sigma, drawSynapses, drawLabels, graphColor);
	 }*/
});
/*$(document).on("keyup", function(event) {
	let key = inputs.indexOf(event.key);
	if (key != -1) {
		values[key] = 0
		ann.Update(values, sigma, drawSynapses, drawLabels, graphColor);
	}
});*/