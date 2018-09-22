//represents horizontal node in canvas, corresponding to a note in the image
function Node(xpos=0) {
	this.xpos = xpos;
	//highlighted area this node is a part of (includes color data)
	this.area = null;
}

//created for each line of music; makes body containing canvas and the text boxes above it
function LineOfMusic(_image,_nodes) {
	let self = this;

	let nodes = [];

	for (ele of _nodes)
		nodes.push(new Node(ele));

	//containing div
	let div = document.createElement('div');
	document.body.appendChild(div);

	//div that text boxes will appear in
	let textArea = document.createElement('div');
	textArea.style.height = "80px";
	textArea.style.position = "relative";
	this.textArea = textArea;

	div.appendChild(textArea);

	// canvas that image/hightlighted areas will be drawn to
	let canvas = document.createElement("canvas");
	div.appendChild(canvas);

	let context = canvas.getContext("2d");

	let image = new Image();
	image.onload = function() {
		//expand canvas and draw image
		canvas.width = image.width;
		canvas.height = image.height;
		context.drawImage(image,0,0);
		//fix textarea position to align with canvas
		textArea.style.width = image.width + "px";
	}
	image.src = _image;

	//updated with the mouse's relative position in the canvas
	let mouse = {x:0,y:0, down:false};

	//Current highlighted area the user is painting with (when mouse is down)
	let currentArea = null;
	//last node painted
	let lastNode = null;

	//Whether user is editing the left or right side of a region,
	//or if we are unsure (and will determine by the mouse's next direction)
	let EditEnum = Object.freeze({"EDIT_LEFT":1,"EDIT_RIGHT":2, "UNSURE":3, "NONE":4});
	let editMode = EditEnum.NONE;

	const NODE_WIDTH = 30;
	const X_OFFSET = 10;

	//Draws highlighted nodes on canvas
	function redraw() {
		context.clearRect(0,0,context.canvas.width, context. canvas.height);

		context.drawImage(image,0,0);

		updateTextBoxes();

		//draw highlighted areas
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			if (node.area != null) {
				let width = NODE_WIDTH;
				if (i != nodes.length - 1)
					width = nodes[i+1].xpos - node.xpos;

				context.fillStyle = node.area.colorString();
				context.fillRect(node.xpos - X_OFFSET,0,width,canvas.height);
			}
		}
	}
	this.redraw = redraw;

	//Finds if user has clicked on a node in the image
	function findNodeClickedOn() {
		let i = closestNode(mouse.x);

		//otherwise determine edit mode
		let isLeft = nodeIsLeftBorder(i);
		let isRight = nodeIsRightBorder(i);

		//if the area is empty, start highlighting
		if (nodes[i].area == null) {
			editMode = EditEnum.UNSURE;
			//generate random color
			let h = Math.floor(Math.random() * 255), s = Math.floor(Math.random() * 100), l = Math.floor(Math.random() * 100);
			// create new highlighted area and assign it to the node we're at
			currentArea = new HighlightedArea([h,s,l],self);
			currentArea.addNode(nodes[i]);
			lastNode = i;
			redraw();
		}
		//the node is not on the border, so no editing is needed
		else if (!isLeft && !isRight) {
			editMode = EditEnum.NONE;
		}
		else { //edit based on currently existent area
			currentArea = nodes[i].area;
			lastNode = i;
			// allow editing in both directions, based on where the mouse goes next
			if (isLeft && isRight) {
				editMode = EditEnum.UNSURE;
			}
			else if (isLeft)
				editMode = EditEnum.EDIT_LEFT;
			else //isRight is true
				editMode = EditEnum.EDIT_RIGHT;
		}
	}

	function closestNode(x) {
		//Find closest node left of mouse pos
		let i = 0;
		while (i < nodes.length - 1 && nodes[i+1].xpos < mouse.x) {
			i++;
		}
		//return next highest node if mouse is super close to it (within visual color)
		if( i != nodes.length - 1 && nodes[i+1].xpos - mouse.x < X_OFFSET)
			return (i+1);
		return i;
	}

	//determine if the node is on the border of a highlighted area,
	//by checking if its area differs from its neighbor's
	function nodeIsLeftBorder(i) {return nodes[i].area != null && (i == 0 || nodes[i].area != nodes[i-1].area);}
	function nodeIsRightBorder(i) {return nodes[i].area != null && (i == nodes.length - 1 || nodes[i].area != nodes[i+1].area);}
	function nodeIsBorder(i) {return nodeIsLeftBorder(i) || nodeIsRightBorder(i);}

	canvas.addEventListener('mousedown', function(event) {
		findNodeClickedOn();
		mouse.down = true;
	});

	canvas.addEventListener('mouseup', function(event) {
		mouse.down = false;
		if (currentArea)
			$(currentArea.textbox).focus();
		lastNode = null;
	});

	canvas.addEventListener('mousemove', function(event) {
		//update mouse's relative position in canvas
		mouse.x = event.pageX - canvas.getBoundingClientRect().x;
		mouse.y = event.pageY - canvas.getBoundingClientRect().y;

		if (mouse.down)
			updateNodes();
	});

	//update the highlighted areas based on edit mode and mouse location
	function updateNodes() {
		if (editMode == EditEnum.NONE)
			return;
		let index = closestNode(mouse.x);

		if (index != null && index != lastNode) {
			// lastNode should usually be set; if it's not, just color the found nodes
			if (lastNode == null)
				lastNode = index;

			//determine the direction the user intends to edit in
			if (editMode == EditEnum.UNSURE) {
				if (lastNode < index)
					editMode = EditEnum.EDIT_RIGHT;
				else
					editMode = EditEnum.EDIT_LEFT;
			}
			//the mouse may move so fast that it has skipped over nodes since
			//the last function call, so iterate over all nodes we crossed over
			let sign = Math.sign(index - lastNode);
			for (let i = lastNode; i != index; i += sign) {
				//if below is true, we are making a highlighted area smaller,
				//so remove highlighting
				if (editMode == EditEnum.EDIT_LEFT && sign == 1 ||
					editMode == EditEnum.EDIT_RIGHT && sign == -1) {
						if(nodes[i].area != null) {
							//remove node from area;
							//if area completely deleted, stop editting
							 if(nodes[i].area.removeNode(nodes[i])) {
							 	editMode = EditEnum.NONE;
								redraw();
								return;
							}
						}
				}
				//otherwise, color the node by adding it to the current area
				else
					currentArea.addNode(nodes[i]);
			}
			//always add current index
			currentArea.addNode(nodes[index]);

			lastNode = index;
			//update canvas
			redraw();
		}
	}

	//update the text boxes of each area so that they are
	//above the leftmost node in the area (i.e. the left border)
	function updateTextBoxes() {
		for(let i = 0; i < nodes.length; i++) {
			// if the node is an area's left border, move textbox to that location
			if (nodeIsLeftBorder(i))
				nodes[i].area.moveTextTo(nodes[i]);
		}
	}

	this.destroy = function() {
		$(div).remove();
	}

	//initial canvas draw
	redraw();
}
