letterOfKey = document.getElementById("letterOfKey");
accidentalOfKey = document.getElementById("accidentalOfKey");
modeOfKey = document.getElementById("modeOfKey");

//represents a highlighted/coplored area of nodes, which is labelled with a text box
function HighlightedArea(color, lineOfMusic) {
	let self = this;
	self.lineOfMusic = lineOfMusic;

	let textbox = document.createElement("input");
	textbox.type = "text";
	this.textbox = textbox;

	let nodes = [];

	//adds a node to the area
	this.addNode = function(node) {
		if (node.area != this) {
			if(node.area)
				node.area.removeNode(node);

			node.area = this;
			nodes.push(node);
		}
	}
	//removes a node from the area, deleting self if the area contains no nodes
	//returns true if area is removing itself, false otherwise
	this.removeNode = function(node) {
		let index = nodes.indexOf(node);
		if (index > -1)
			nodes.splice(index, 1);
		node.area = null;
		if (nodes.length <= 0) {
			$(textbox).remove();
			return true;
		}
		return false;
	}



	function parseTextbox() {
		textbox.value = replaceMusicalChars(textbox.value);

		let noteValue = getNoteValue(textbox.value);
		if (noteValue == null) return;

		let adjValue =noteValue - letterOfKey.selectedIndex;
		let newColor = new Color(COLORS[(adjValue % 7 + 7 ) % 7]);
		newColor.varyBy(getSpecialCharOffset(textbox.value));
		if (newColor != self.color) {
			self.color = newColor;
			for (node of nodes)
				node.color = newColor;
			lineOfMusic.redraw();
		}
	};

	$(textbox).on("input",parseTextbox);
	$(letterOfKey).change(parseTextbox);

	this.moveTextTo = function(node) {
		textbox.style.left = node.xpos + "px";
	}

	this.color = new Color(color);

	this.colorString = function() {return this.color.toString();};

	self.lineOfMusic.textArea.appendChild(textbox);
}

//takes user-typed text and replaces chars with apppropriate unicode chars
function replaceMusicalChars(text) {
	text = text.replace(/dim/g,"°");
	text = text.replace(/hd/g,"ø");
	text = text.replace(/aug/g,"⁺");
	text = text.replace(/M7/g,"ᴹ⁷")
	text = text.replace(/7/g,"⁷");
	text = text.replace(/b/g,"♭");
	text = text.replace(/#/g,"♯");
	return text;
}


//scans the text for one of the letters A-G.
//If A found return 0; If B found, 1; etc.
function getNoteValue(text) {
	if (text.length < 1)
		return null;
	let val = text.toUpperCase().charCodeAt(0) - 65;
	//if val not from A-G, return -1
	if ((val < -1 || val > 6))
		return null;
	else
		return val;
}

//generate a semi-unique offset value, used to vary
//an area's color slightly based on accidentals, major/minor, etc.
function getSpecialCharOffset(text) {
	let sum = 0;
	for (let i = 1; i < text.length; i++) {
		console.log(0+text.charCodeAt(i)  * (29+i)	);
		sum = sum + text.charCodeAt(i) * (29+i);
	}
	return sum;
}

//HSL color object
function Color(vals) {
	let h = vals[0];
	let s = vals[1];
	let l = vals[2];
	let a = 0.5;
	let offset = 0;

	this.toString = function() {
		return `hsla(${(h+Math.floor(offset / 4) - 12) % 255},${s}%,${(l + offset) % 60 + 20}%,${a})`;
	}
	this.varyBy = function(amount) {
		//97 = closest prime < 100
		offset = (offset + amount) % 97;
	}
}

const COLORS = [ [145,83,42], [180, 60, 90], [60, 90, 50], [220, 85, 64], [36,100,50], [6,59,50],[28,74,73]];
