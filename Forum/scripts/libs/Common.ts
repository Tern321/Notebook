class Common {
    static getTextAreaValue(id: string): string {
        var textArea: any = document.getElementById(id);
        return textArea.value;
    }
    static setTextAreaValue(key: string, value: string) {
        var textArea: any = document.getElementById(key);
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