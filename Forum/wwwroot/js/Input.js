function enableInput() {
    document.onkeyup = keyUp;
    document.onkeydown = checkKeycode;
    document.addEventListener('keydown', function (e) {
        //console.log(e);
        if (e.keyCode == 46) {
            Controller.deleteContention();
        }
    }, false);
    document.getElementById("contentions").addEventListener("auxclick", mouseClick, false);
    document.getElementById("contentions").addEventListener('click', mouseClick, false);
    document.getElementById("contentions").oncontextmenu = function (e) { return mouseClick(e); };
    document.getElementById("contentions").addEventListener("mousedown", mouseDownEvent);
    document.getElementById("contentions").onmousedown = function (e) { mouseClick(e); };
    document.getElementById("argumentTextArea").addEventListener('focus', (event) => {
        //console.log("argumentTextArea focus");
        var colorTrue = Controller.changeSelectedContention ? "blue" : "red";
        if (Controller.changeSelectedContention) {
            UIDrawer.selectElementBase(document.getElementById("changeButton"), true, colorTrue, "black");
        }
        else {
            UIDrawer.selectElementBase(document.getElementById("addButton"), true, colorTrue, "black");
        }
        UIDrawer.selectElementBase(document.getElementById("argumentTextArea"), true, colorTrue, "black");
    });
    document.getElementById("argumentTextArea").addEventListener('blur', (event) => {
        //console.log("argumentTextArea lost focus");
        UIDrawer.selectElementBase(document.getElementById("addButton"), false, "red", "black");
        UIDrawer.selectElementBase(document.getElementById("changeButton"), false, "red", "black");
        UIDrawer.selectElementBase(document.getElementById("argumentTextArea"), false, "red", "black");
    });
}
function keyUp(event) {
    if (event.keyCode == 16) {
        Controller.saveContentionOrder();
        //console.log("shift up");
    }
    //console.log("ctrlKey:" + event.ctrlKey + " shiftKey:" + event.shiftKey + " altKey:" + event.altKey + " keyCode:" + event.keyCode);
}
function checkKeycode(event) {
    //console.log("ctrlKey:" + event.ctrlKey + " shiftKey:" + event.shiftKey + " altKey:" + event.altKey + " keyCode:" + event.keyCode);
    if ((event.keyCode == 0xA) || (event.keyCode == 0xD)) {
        if (event.shiftKey) {
            Controller.addContentionList();
        }
        else if (event.ctrlKey) {
            if (Controller.changeSelectedContention) {
                Controller.changeContention();
            }
            else {
                Controller.addContentionOrLink();
            }
        }
        else {
            var textArea = document.getElementById("argumentTextArea");
            if (textArea.matches(":focus")) {
                return true;
            }
            textArea.focus();
            return false;
        }
    }
    var leftKeyCode = 37;
    var upKeyCode = 38;
    var rightKeyCode = 39;
    var downKeyCode = 40;
    if ([leftKeyCode, upKeyCode, rightKeyCode, downKeyCode].indexOf(event.keyCode) != -1 && event.ctrlKey) {
        //console.log("move contention selection");
        Controller.moveContentionSelection(event.keyCode);
        return false;
    }
    if ([upKeyCode, downKeyCode].indexOf(event.keyCode) != -1 && event.shiftKey) {
        //console.log("move contention");
        Controller.moveContentionUp(event.keyCode == upKeyCode);
        return false;
    }
    var textArea = document.getElementById("argumentTextArea");
    if (!textArea.matches(":focus") && event.ctrlKey) {
        if (event.keyCode == 67) {
            //console.log("ctrl c");
            Controller.copyContentionCtrlC();
            return true;
        }
        if (event.keyCode == 88) {
            //console.log("ctrl x");
            Controller.deleteContentionCtrlX();
            return true;
        }
        if (event.keyCode == 86) {
            //console.log("ctrl v");
            Controller.addContentionCtrlV();
            return true;
        }
    }
    return true;
}
var start;
function mouseDownEvent(e) {
    //console.log("mouseDownEvent");
    start = new Date();
}
function mousePressedTime() {
    var end = new Date();
    return (end.getTime() - start.getTime());
}
var pendingClick = 0;
function mouseClick(e) {
    var selectableObject = e.target.getAttribute("selectable");
    if (!selectableObject) // clicked not on contention
     {
        return true;
    }
    if (e.detail == 0) {
        return false;
    }
    // kill any pending single clicks
    if (pendingClick) {
        clearTimeout(pendingClick);
        pendingClick = 0;
    }
    //console.log("ctrlKey:" + e.ctrlKey + " shiftKey:" + e.shiftKey + " altKey:" + e.altKey + " keyCode:" + e.keyCode);
    var contentionElement = e.target;
    if (contentionElement.getAttribute("container")) {
        contentionElement = contentionElement.parentElement;
    }
    switch (e.detail) {
        case 1:
            pendingClick = setTimeout(function () {
                Controller.changeSelectedContention = false;
                var pressTime = mousePressedTime();
                if (pressTime < 800) {
                    if (e.which == 1) {
                        if (e.shiftKey) {
                            Controller.moveContention(contentionElement.getAttribute("id"));
                        }
                        else if (e.ctrlKey) {
                            Controller.addToArchive(contentionElement.getAttribute("id"));
                        }
                        else {
                            Controller.selectContention(contentionElement);
                        }
                    }
                }
                if (e.which == 3) {
                    Controller.collapceContention(contentionElement.getAttribute("id"));
                }
            }, 250); // should match OS multi-click speed
            break;
        case 2:
            //console.log("button:" + e.which + " double click");
            if (e.which == 1) {
                Controller.changeSelectedContention = true;
                Controller.selectContention(contentionElement);
                Controller.copyContentionText();
                document.getElementById("argumentTextArea").focus();
                // copy contention text to text field
            }
            break;
        default:
            //alert("multi 3");
            break;
    }
    return false;
}
//# sourceMappingURL=Input.js.map