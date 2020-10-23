var pendingClick = 0;
function mouseClick(e) {
    var contentionId = e.target.getAttribute("contentionId");
    if (!contentionId) // clicked not on contention
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
    switch (e.detail) {
        case 1:
            pendingClick = setTimeout(function () {
                console.log("button:" + e.which + " single click");
                if (e.which == 1) {
                    Controller.singleLeftMouseClick(e);
                }
                if (e.which == 3) {
                    Controller.singleRightMouseClick(e);
                }
            }, 250); // should match OS multi-click speed
            break;
        case 2:
            console.log("button:" + e.which + " double click");
            break;
        default:
            //alert("multi 3");
            break;
    }
    return false;
}
//# sourceMappingURL=mouse.js.map