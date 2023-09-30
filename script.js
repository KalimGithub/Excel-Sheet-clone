
// dimensions
const ROWS = 100;
const COLS = 26;

let currentCell;
let previousCell;
let cutCell;
let matrix = new Array(ROWS);


let transparent = 'transparent';
let transparentGreen = '#D3E3FD'

// table components
const table = document.getElementById("table");
const tHeadRow = document.getElementById("t-head-row");
const tBody = document.getElementById("t-body");
const currentCellHeading = document.getElementById("current-cell-heading");
//button container
const boldBtn = document.getElementById("bold-btn");
const italicBtn = document.getElementById("italic-btn");
const underlineBtn = document.getElementById("underline-btn");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const centerBtn = document.getElementById("center");

const copyBtn = document.getElementById("copy-btn");
const cutBtn = document.getElementById("cut-btn");
const pasteBtn = document.getElementById("paste-btn");
const uploadInput = document.getElementById("upload-input");

const fontFamilyDropdown = document.getElementById("font-family");
const fontSizeDropdown = document.getElementById("font-size");
const textColorInput = document.getElementById("text-color-input");
const bgColorInput = document.getElementById("bg-color-input");

//creating a 2D array
function createNewMatrix() {
    for (let row = 0; row < ROWS; row++) {
        matrix[row] = new Array(COLS);
        for (let col = 0; col < COLS; col++) {
            matrix[row][col] = {};
        }
    }
}
createNewMatrix();


function colGen(typeOfCell, tableRow, isInnerText, rowNumber) {
    for (let col = 0; col < COLS; col++) {
        const cell = document.createElement(typeOfCell);
        if (isInnerText) {
            cell.innerText = String.fromCharCode(col + 65);
            cell.setAttribute("id", String.fromCharCode(col + 65));
        } else {
            cell.setAttribute("id", `${String.fromCharCode(col + 65)}${rowNumber}`);
            cell.setAttribute("contenteditable", true)
            cell.addEventListener("input", updateObjInMatrix);
            // event.target is the current cell
            cell.addEventListener("focus", (event) => focusHandler(event.target))
        }
        tableRow.append(cell);
    }
}
// this is for heading coloumns
colGen("th", tHeadRow, true);
//in table we have col -> row 
//in matrix we have row and then col
function updateObjInMatrix() {
    // console.log(matrix[0][0]);
    let id = currentCell.id;
    // id[0] gives 'A'  --> 'A.charCodeAt(0) gives 65    
    let col = id[0].charCodeAt(0) - 65;
    let row = id.substring(1) - 1;
    matrix[row][col] = {
        text: currentCell.innerText,
        style: currentCell.style.cssText,
        id: id,
    }
}

// console.log(currentCell.id);
// setting header color when focusing on a cell
function setHeaderColor(colId, rowId, color) {
    const colHead = document.getElementById(colId);
    const rowHead = document.getElementById(rowId);
    colHead.style.backgroundColor = color;
    rowHead.style.backgroundColor = color;
}

function downloadMatrix() {
    // 2d matrix into memory file
    const matrixString = JSON.stringify(matrix);
    // matrixString to Blob
    const blob = new Blob([matrixString], { type: 'application/json' });
    // console.log(blob);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);//converts blob to link
    link.download = 'table.json';
    link.click()
}

function uploadMatrix(event) {
    const file = event.target.files[0];
    // filereader helps to read blob
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        // this will trigger onload method of reader instance
        reader.onload = function (event) {
            const fileContent = JSON.parse(event.target.result);
            // console.log(fileContent);
        }
    }
}
uploadInput.addEventListener("input", uploadMatrix);


//button -> bold btn, italic btn, underline btn
//styleProperty -> fontWeight, fontStyle, textDecoration
//style -> "bold", "italics", "underline"

// if (currentCell.style.fontWeight === "bold") {
//     boldBtn.style.backgroundColor = transparentGreen;
// } else {
//     boldBtn.style.backgroundColor = transparent;
// }
function buttonHighlighter(button, styleProperty, style) {
    if (currentCell.style[styleProperty] === style) {
        button.style.backgroundColor = transparentGreen;
    } else {
        button.style.backgroundColor = transparent;
    }
}

function focusHandler(cell) {
    currentCell = cell;
    // console.log(currentCell.id);
    if (previousCell) {
        setHeaderColor(previousCell.id[0], previousCell.id.substring(1), transparent);
    }
    // for id A11  -->
    // cell.id[0] -> A
    // cell.id.substring(1) -> 11
    setHeaderColor(cell.id[0], cell.id.substring(1), transparentGreen);
    currentCellHeading.innerText = cell.id;
    previousCell = currentCell;

    buttonHighlighter(boldBtn, 'fontWeight', "bold")
    buttonHighlighter(italicBtn, 'fontStyle', "italic")
    buttonHighlighter(underlineBtn, 'textDecoration', "underline")
    // if (currentCell.style.fontWeight === "bold") {
    //     boldBtn.style.backgroundColor = transparentGreen;
    // } else {
    //     boldBtn.style.backgroundColor = transparent;
    // // }

    // if (currentCell.style.fontStyle === "italic") {
    //     italicBtn.style.backgroundColor = transparentGreen;
    // } else {
    //     italicBtn.style.backgroundColor = transparent;
    // }

    // if (currentCell.style.textDecoration === "underline") {
    //     underlineBtn.style.backgroundColor = transparentGreen;
    // } else {
    //     underlineBtn.style.backgroundColor = transparent;
    // }
    buttonHighlighter(leftBtn, 'textAlign', "left");
    buttonHighlighter(rightBtn, "textAlign", "right");
    buttonHighlighter(centerBtn, "textAlign", "center");
    // if(currentCell.style.textAlign==="left"){
    //     leftBtn.style.backgroundColor=transparentGreen;
    // }
    // else{
    //     leftBtn.style.backgroundColor=transparent;
    // }
    // if(currentCell.style.textAlign==="right"){
    //     rightBtn.style.backgroundColor=transparentGreen;
    // }else{
    //     rightBtn.style.backgroundColor=transparent;
    // }
}

// this is for rows
function tableBodyGen() {
    tBody.innerHTML = '';
    for (let row = 1; row <= ROWS; row++) {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.innerText = row;
        th.setAttribute("id", row);
        tr.append(th);
        // for(let col=0; col<COLS; col++){
        //     const td = document.createElement("td");
        //     tr.append(td);
        // }
        // this is for empty td coloumns
        colGen("td", tr, false, row);
        tBody.append(tr);
    }
}
tableBodyGen();

// boldBtn.addEventListener("click", () => {
//     if (currentCell.style.fontWeight === "bold") {
//         currentCell.style.fontWeight = "normal";
//         boldBtn.style.backgroundColor = transparent;
//     } else {
//         currentCell.style.fontWeight = "bold";
//         boldBtn.style.backgroundColor = transparentGreen;
//     }
// })

// italicBtn.addEventListener("click", () => {
//     if (currentCell.style.fontStyle === "italic") {
//         currentCell.style.fontStyle = "normal";
//         italicBtn.style.backgroundColor = transparent;
//     } else {
//         currentCell.style.fontStyle = "italic";
//         italicBtn.style.backgroundColor = transparentGreen;
//     }
// })

// underlineBtn.addEventListener("click", () => {
//     if (currentCell.style.textDecoration === "underline") {
//         currentCell.style.textDecoration = "none";
//         underlineBtn.style.backgroundColor = transparent;
//     } else {
//         currentCell.style.textDecoration = "underline";
//         underlineBtn.style.backgroundColor = transparentGreen;
//     }

// })
buttonEventListener(italicBtn, "fontStyle", "italic");
buttonEventListener(boldBtn, "fontWeight", "bold");
buttonEventListener(underlineBtn, "textDecoration", "underline");

function buttonEventListener(button, styleProperty, style) {
    button.addEventListener("click", () => {
        if (currentCell.style[styleProperty] === style) {
            currentCell.style[styleProperty] = "normal";
            currentCell.style[styleProperty] = "none";
            button.style.backgroundColor = transparent;
        } else {
            currentCell.style[styleProperty] = style;
            button.style.backgroundColor = transparentGreen;
        }
        updateObjInMatrix();
    })

}

buttonEventListener(leftBtn, "textAlign", "left");
buttonEventListener(rightBtn, "textAlign", "right");
buttonEventListener(centerBtn, "textAlign", "center");

// leftBtn.addEventListener("click", () => {
//     if (currentCell.style.textAlign === "left") {
//         // currentCell.style.textAlign = "left"
//         leftBtn.style.backgroundColor = transparent;
//     } else {
//         currentCell.style.textAlign = "left";
//         leftBtn.style.backgroundColor = transparentGreen;
//     }
// })

// rightBtn.addEventListener("click", () => {
//     if (currentCell.style.textAlign === "right") {
//         currentCell.style.textAlign = "left";
//         rightBtn.style.backgroundColor = transparent;
//     } else {
//         currentCell.style.textAlign = "right";
//         rightBtn.style.backgroundColor = transparentGreen;
//     }
// })

// centerBtn.addEventListener("click", () => {
//     if (currentCell.style.textAlign === "center") {
//         currentCell.style.textAlign = "left";
//         centerBtn.style.backgroundColor = transparent;
//     } else {
//         currentCell.style.textAlign = "center"
//         centerBtn.style.backgroundColor = transparentGreen;
//     }
// })

fontFamilyDropdown.addEventListener("change", (event) => {
    console.log(event.target);
    currentCell.style.fontFamily = fontFamilyDropdown.value;
    updateObjInMatrix();
});

fontSizeDropdown.addEventListener("change", (event) => {
    console.log(event.target);
    currentCell.style.fontSize = fontSizeDropdown.value;
    updateObjInMatrix();
});

textColorInput.addEventListener("input", () => {
    currentCell.style.color = textColorInput.value;
    updateObjInMatrix();
});

bgColorInput.addEventListener("input", () => {
    currentCell.style.backgroundColor = bgColorInput.value;
    updateObjInMatrix();
})


copyBtn.addEventListener("click", () => {
    lastPressedBtn = "copy";
    cutCell = {
        text: currentCell.innerText,
        style: currentCell.style.cssText,
    }
});

cutBtn.addEventListener("click", () => {
    lastPressedBtn = 'cut';
    cutCell = {
        text: currentCell.innerText,
        style: currentCell.style.cssText,
    };
    //deleting currentcell text
    currentCell.innerText = '';
    currentCell.style.cssText = '';
    updateObjInMatrix();
})

pasteBtn.addEventListener("click", () => {
    currentCell.innerText = cutCell.text;
    currentCell.style = cutCell.style;

    // if the btn is cut cleaning cutcell after pasting the text
    if (lastPressedBtn === 'cut') {
        cutCell = undefined;
    }
    updateObjInMatrix();
});
// copyCutPaste(button, type, )
// function copyCutPaste(){
//     if(button==="pasteBtn"){
//         currentCell.innerText = cutCell.text;
//         currentCell.style = cutCell.style;
//     }
// }



