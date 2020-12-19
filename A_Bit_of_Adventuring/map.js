// 1 = single tube
// 2 = double tube
// 3 = X crossing
// 4 = deprecated lol
// 5 = double split
// 6 = neq sign
// 7 = the H->D thing
let map = [
    ["a",  1,  1,  1,"I",  2,  2,  2,"E",  2," ",  5,  1,"A",  1,  1,  1,"w"],
      [  1," ",  1,  5," "," "," "," ",  1,  6,  3,  3,  5,  1," ",  1,  5],
    ["b",  3,  3,  5,"J",  1," "," ","F"," ",  6," ",  1,"B",  1,  3,  1,"x"],
      [" ",  3," ",  1,  2,  6,  2,  2," ",  1,"Q"," "," ",  1,  1," "," "],
    ["c",  3,  3,  5,"K",  2,  6,  2,"G",  3," ",  1,  2,"C",  6,  7,  7,"y"],
      [  1," ",  1,  1,  1," ",  1," ",  1,  1,  3,  3,  1,  1," ",  1,  1],
    ["d"," "," ",  1,"L",  1,  1,  2,"H",  2,  7,  7,  2,"D"," "," ",  1,"z"]
]

function load() {
    const urlParams = new URLSearchParams(window.location.search);

    const row = parseInt(urlParams.get("r"));
    const col = parseInt(urlParams.get("c"));

    const maxCol = (row+1) % 2 + 16;

    if (row >6 || row<0 || col<0 || col > maxCol) {
        return;
    }

    makeMinimap(row,col);
    getPedestalText(row,col);
    getPedestalTubes(row,col);
    getRoomText(row,col);
    getRoomNumber(row,col);



    getFloorText(row,col);

    addMovementControls(row,col,maxCol);


}



function getFloorText(row,col) {
    let text="";
    switch (map[row][col]) {
        case " ":
            text = "There's nothing in here.";
            break;
        case 1:
            text = "A single tube spans the floor of the room.";
            break;
        case 2:
            text = "Two tubes in parallel span the floor of the room.";
            break;
        case 3:
            text = "Two tubes cross over each other on the floor of the room.";
            break;
        case 5:
            text = "A single tube splits into two on the floor of the room.";
            break;
        case 6:
            text = "Two tubes in parallel span the floor of the room, and another tube crosses over the pair.";
            break;
        case 7:
            text = "Two tubes in parallel span the floor of the room; one of those tubes splits into two.";
            break;
        default:
            text = "";
            break;
    }
    if(text != "") {
        let p=document.createElement('p');
        let textNode=document.createTextNode(text);
        p.appendChild(textNode);
        document.getElementById("description").append(p);
    }
}

function getPedestalText(row,col) {
    if(!isAlpha(map[row][col]))
        return;
    
    let text="There is a runic pedestal in the center of the room."
    let p=document.createElement('p');
    let textNode=document.createTextNode(text);
    p.appendChild(textNode);
    document.getElementById("description").append(p);
}
function getRoomText(row,col) {
    let text = "";
    let enumr = "";
    switch (map[row][col]) {
        case "I":
            type="CW";
            text = "Classic board game or classic cereal brand";
            enumr="[4/5]";
            break;
        case "J":
            type="CW";
            text = "A place to get water, or what happens when you have too much water?";
            enumr="[4/4]";
            break;
        case "K":
            type="CC";
            text = "Fang puncturing into others";
            enumr="[5/4]";
            break;
        case "L":
            type="CW";
            text = "We're not gonna ___ / No, we ain't gonna ___ / We're not gonna ____ anymore ";
            enumr="[6/7]";
            break;
        
        case "E":
            type="SYM";
            text = "It's a thick outline of circle with a smaller circle within; evenly-spaced straight lines connect the inner circle to the outer one.";
            enumr="[5/4]";
            break;
        case "F":
            type="CW";
            text = "What you might take at your grandma's party?";
            enumr="[5/5]";
            break;
        case "G":
            type="NOI";
            text = "It sounds like that Netflix comedian who plays music?";
            enumr="[3/5]";
            break;
        case "H":
            type="CC";
            text = "Quickly gobble finally edible large meal";
            enumr="[5/6]";
            break;

        case "Q":
            type="CC";
            text = "Noisy, contrary duo behind Death Note character";
            enumr="[4/5]";
            break;

        case "A":
            type="SYM";
            text = "It's just a dot.";
            enumr="[5/5]"
            break;
        case "B":
            type="NOI";
            text = "It sounds like some kind of fee?";
            enumr="[2/3]";
            break;
        case "C":
            type="SYM"
            text = "It's a horizontal line with a dot directly above and below its center.";
            enumr="[6/7]";
            break;
        case "D":
            type="NOI";
            text = "It sounds like that guy who smoked pot with Conan in his car?";
            enumr="[5/4]";
            break;

        
        case "w":
            type = "CW";
            text="Word before set, on, or ahead"
            enumr="[4/5]";
            break;
        case "x":
            type="SYM";
            text = "It looks like a sideways V.";
            enumr="[8/7]";
            break;
        case "y":
            type="NOI";
            text = "It sounds like some kind of tale for an old mariner?";
            enumr="[5/6]";
            break;
        case "z":
            type = "CC";
            text = "Passing time inside a restless head"
            enumr="[5/5]";
            break;

        case "a":
            text = "";
            break;
        case "b":
            text = "";
            break;
        case "c":
            text = "";
            break;
        case "d":
            text = "";
            break;
    }
    if(text != "") {
        let typeText= "";
        switch(type) {
            case "CW":
                typeText="Words in a simple language are inscribed on the pedestal:";
                break;
            case "CC":
                typeText="Words in a cryptic language are inscribed on the pedestal:";
                break;
            case "NOI":
                typeText="A strange sound echoes throughout the room, but I can't quite make it out..."
                break;
            case "SYM":
                typeText="Some kind of symbol is etched into the pedestal;"
                break;
        }
        let clue=document.createElement('div');
        let pType=document.createElement('p');
        let typeTextNode=document.createTextNode(typeText);
        pType.appendChild(typeTextNode);
        clue.append(pType);

        let pClue=document.createElement('p');
        let clueTextNode=document.createTextNode(text);
        pClue.appendChild(clueTextNode);
        clue.append(pClue);

        let pEnum=document.createElement('p');
        let enumNode=document.createTextNode(enumr);
        pEnum.appendChild(enumNode);
        clue.append(pEnum);
        document.getElementById("description").appendChild(clue);
    }
}

function getPedestalTubes(row,col) {
    let text = "";
    switch (map[row][col]) {
        case "a":
            text = "Two tubes exit out from the pedestal.";
            break;
        case "b":
            text = "One tube exits out from the pedestal.";
            break;
        case "c":
            text = "One tube exits out from the pedestal.";
            break;
        case "d":
            text = "One tube exits out from the pedestal.";
            break;
        
        case "I":
            text = "Two tubes enter the pedestal, and two tubes leave from it.";
            break;
        case "J":
            text = "Two tubes enter the pedestal, and one tube leaves from it.";
            break;
        case "K":
            text = "Two tubes enter the pedestal, and five tubes leave from it.";
            break;
        case "L":
            text = "Two tubes enter the pedestal.";
            break;

        case "E":
            text = "Two tubes enter the pedestal, and two tubes leave from it.";
            break;
        case "F":
            text = "Two tubes enter the pedestal, and one tube leaves from it.";
            break;
        case "G":
            text = "Two tubes enter the pedestal, and one tube leaves from it.";
            break;
        case "H":
            text = "Two tubes enter the pedestal, and three tubes leaves from it.";
            break;

        case "Q":
            text = "Two tubes enter the pedestal.";
            break;
        
        case "A":
            text = "Two tubes enter the pedestal.";
            break;
        case "B":
            text = "Two tubes enter the pedestal, and one tube leaves from it.";
            break;
        case "C":
            text = "Two tubes enter the pedestal, and three tubes leave from it.";
            break;
        case "D":
            text = "Two tubes enter the pedestal, and one tube leaves from it.";
            break;

        case "w":
            text = "Two tubes enter the pedestal.";
            break;
        case "x":
            text = "Two tubes enter the pedestal.";
            break;
        case "y":
            text = "Two tubes enter the pedestal.";
            break;
        case "z":
            text = "Two tubes enter the pedestal.";
            break;
    }
    if(text != "") {
        let p=document.createElement('p');
        let textNode=document.createTextNode(text);
        p.appendChild(textNode);
        document.getElementById("description").append(p);
    }
}

function getRoomNumber(row,col) {
    let text="";

    if(!isAlpha(map[row][col]))
        return;
    
    switch (map[row][col]) {
        case "a":
            text = "The number '1' is etched on the pedestal. There is no rune on this pedestal."
            break;
        case "b":
            text = "The number '2' is etched on the pedestal. There is no rune on this pedestal."
            break;
        case "c":
            text = "The number '3' is etched on the pedestal. There is no rune on this pedestal."
            break;
        case "d":
            text = "The number '4' is etched on the pedestal. There is no rune on this pedestal."
            break;
        case "I":
            text = "The number '5' is etched on the pedestal."
            break;
        case "L":
            text = "The number '4' is etched on the pedestal."
            break;
        case "E":
            text = "The number '2' is etched on the pedestal."
            break;
        case "G":
            text = "The number '5' is etched on the pedestal."
            break;
        case "Q":
            text = "The number '2' is etched on the pedestal."
            break;
        case "A":
            text = "The number '5' is etched on the pedestal."
            break;
        case "w":
            text = "The number '4' is etched on the pedestal."
            break;
        case "x":
            text = "The number '2' is etched on the pedestal."
            break;
        case "y":
            text = "The number '4' is etched on the pedestal."
            break;
        case "z":
            text = "The number '3' is etched on the pedestal."
            break;
        default:
            text = "There seems to be a number on the pedestal, but it's too faded to read."
            break;
    }
    if(text != "") {
        let p=document.createElement('p');
        let textNode=document.createTextNode(text);
        p.appendChild(textNode);
        document.getElementById("description").append(p);
    }
}

function isAlpha(ch) {
    return /^[A-Za-z]$/i.test(ch);
}

function addMovementControls(row,col,maxCol) {
    let dirs = {};
    dirs.ul=true;
    dirs.ur=true;
    dirs.l=true;
    dirs.r=true;
    dirs.dl=true;
    dirs.dr=true;

    let shortRow = (row % 2);

    if(row<=0) {
        dirs.ul=false;
        dirs.ur=false;
    }
    if (row>=6) {
        dirs.dl=false;
        dirs.dr=false;
        
    }
    if (col <= 0) {
        dirs.l=false;
        if(!shortRow) {
            dirs.ul=false;
            dirs.dl=false; 
        }   
    }
    if (col >= maxCol) {
        dirs.r=false;
        if(!shortRow)
        {
            dirs.ur=false;
            dirs.dr=false;
        }
    }

    for (dir in dirs) {
        if(dirs[dir]) {
            let link="";
            
            switch (dir) {
                case "ul":
                    if(shortRow) {
                        link=makeLink(row-1,col);
                    }
                    else {
                        link=makeLink(row-1,col-1);
                    }
                    break;
                case "ur":
                    if(shortRow) {
                        link=makeLink(row-1,col+1);
                    }
                    else {
                        link=makeLink(row-1,col);
                    }
                    break;
                case "l":
                    link=makeLink(row,col-1);
                    break;
                case "r":
                    link=makeLink(row,col+1);
                    break;
                case "dl":
                    if(shortRow) {
                        link=makeLink(row+1,col);
                    }
                    else {
                        link=makeLink(row+1,col-1);
                    }
                    break;
                case "dr":
                    if(shortRow) {
                        link=makeLink(row+1,col+1);
                    }
                    else {
                        link=makeLink(row+1,col);
                    }
                    break;
            }
            document.getElementById(dir).href = link;
        }
        else {
            document.getElementById(dir).classList.add("non-selectable");
        }
    }
}

function makeLink(row,col) {
    return "./temple.html?r="+row+"&c="+col;
}

function makeMinimap(row,col) {
    minimap = [
        "⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡",
        "⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡",
        "⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡",
        "⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡",
        "⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡",
        "⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡",
        "⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡"
    ]

    let rowP = document.getElementById(row);
    let rowStr = rowP.textContent;
    rowP.textContent = rowStr.substring(0,col) + "⬢" + rowStr.substring(col+1);
    for (row of minimap) {

    }
}