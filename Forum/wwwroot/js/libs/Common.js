class Common {
    static getTextAreaValue(id) {
        var textArea = document.getElementById(id);
        return textArea.value;
    }
    static setTextAreaValue(key, value) {
        var textArea = document.getElementById(key);
        textArea.value = value;
    }
}
function stringIsEmty(e) {
    switch (e) {
        case "":
        case 0:
        case "0":
        case null:
        case false:
        case typeof (e) == "undefined":
            return true;
        default:
            return false;
    }
}
//# sourceMappingURL=Common.js.map