class Controller {
    // getters and setters
    static selectedcontention() {
        return Model.contentionsMap.get(Controller.selectedContentionId);
    }
    static getTextAreaValue(id) {
        var textArea = document.getElementById(id);
        return textArea.value;
    }
    static setTextAreaValue(key, value) {
        var textArea = document.getElementById(key);
        textArea.value = value;
    }
    static getEncriptionKey() {
        return this.getTextAreaValue("encriptionKeyTextArea").trim();
    }
    static argumentTextArea() {
        return document.getElementById("argumentTextArea");
    }
    // files
    static addFile(ev) {
        if (!Controller.selectedContentionId) {
            Controller.selectedContentionId = Controller.topicId;
        }
        var link = "";
        //Model.addContention(textArea.value.split("\n").join("<br>"), Controller.selectedContentionId);
        console.log('File(s) dropped');
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    var file = ev.dataTransfer.items[i].getAsFile();
                    console.log('... file[' + i + '].name = ' + file.name);
                }
            }
        }
        else {
            // Use DataTransfer interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.files.length; i++) {
                console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
            }
        }
    }
    static readFile(file) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        //var reader = new FileReader();
        //reader.onload = function (e) {
        //    var contents = e.target.result;
        //    fileInput.func(contents)
        //    document.body.removeChild(fileInput)
        //}
        //reader.readAsText(file)
    }
    static dragover_handler(ev) {
        console.log(ev);
        ev.preventDefault();
    }
    // import
    static importJson(json) {
        //console.log("importJson " + json);
        // use this to fix problem with id collision
        var idChangeMap = new Map();
        var objectsList = JSON.parse(json);
        for (var i = 0; i < objectsList.length; i++) {
            var obj = objectsList[i];
            var id = obj.id.toString();
            if (Model.contentionsMap.has(id)) {
                var oldId = id;
                id = Model.generateRandomId();
                idChangeMap.set(oldId, id);
                //console.log(" change id to " + cn.id);
            }
            var parentContentionId = obj.parentContentionId.toString();
            if (i == 0) {
                parentContentionId = Controller.selectedContentionId;
            }
            else {
                if (idChangeMap.has(parentContentionId)) {
                    parentContentionId = idChangeMap.get(parentContentionId);
                }
            }
            Controller.executeCommand(Command.addContention(id, parentContentionId, obj.text, obj.url, obj.linkId));
            Controller.executeCommand(Command.changeContentionColor(id, obj.color));
            if (obj.topic) {
                Controller.executeCommand(Command.createTopicFromContention(id, obj.topic));
            }
            if (obj.collapce) {
                Controller.executeCommand(Command.collapseContention(id, obj.collapce));
            }
        }
    }
    // logic
    static textAreasHasFocus() {
        if (Controller.argumentTextArea().matches(":focus")) {
            return true;
        }
        if (document.getElementById("loginTextArea").matches(":focus")) {
            return true;
        }
        if (document.getElementById("encriptionKeyTextArea").matches(":focus")) {
            return true;
        }
        return false;
    }
    static contentionIsVisible(contentionId) {
        return document.getElementById(contentionId) != undefined;
    }
    static cleanTextArea() {
        Controller.argumentTextArea().text = "";
    }
    static removeTextAreaFocus() {
        Controller.argumentTextArea().blur();
    }
    static cleanCutContentionList() {
        Controller.cutContentionList.forEach(function (contentionId) {
            Controller.setContentionBorderType(contentionId, false);
        });
        Controller.cutContentionList = [];
    }
    static setContentionBorderType(id, dashed) {
        var element = document.getElementById(id);
        if (element != undefined) {
            UIDrawer.setElementBorderType(element, dashed);
        }
    }
    // actions
    static reload() {
        const hashCode = s => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
        var login = this.getTextAreaValue("loginTextArea").trim();
        var encriptionKey = this.getTextAreaValue("encriptionKeyTextArea").trim();
        if (login.length > 0) {
            var hash = Math.abs(hashCode(login));
            localStorage.setItem("login", login);
            localStorage.setItem("encriptionKey", encriptionKey);
            Network.sendRequest(Network.loadJsonUrl(login)).then(responseString => {
                Model.decriptJson(responseString, Controller.getEncriptionKey());
            }).catch(function (body) {
                console.log("loadJson error");
                Model.parseJson("");
            });
        }
        else {
            console.log("load default data");
            Model.parseJson("");
            //var url = "https://backendlessappcontent.com/4498E4FA-01A9-8E7F-FFC3-073969464300/B416CA2D-2783-4942-A3ED-B132738BE078/files/DataFolder/1544803905.json";
            //Network.loadJson("instruction url");
        }
    }
    static executeCommand(command) {
        Model.executeCommand(command);
    }
    // UI
    static hideKeyboard() {
        Controller.argumentTextArea().focus();
        Controller.argumentTextArea().blur();
    }
    static showLogin() {
        document.getElementById("loginTextArea").style.width = "400px";
        document.getElementById("encriptionKeyTextArea").style.width = "400px";
    }
}
Controller.topicId = "root";
Controller.changeSelectedContention = false;
Controller.shouldSaveContentionOrder = true;
Controller.showAllEnabled = false;
Controller.cutContentionList = [];
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
window.onload = () => {
    var url = Network.getJsonUpdateTimeUrl(Controller.getTextAreaValue("loginTextArea").trim());
    //Network.sendRequest(url).then(responseString => { console.log(responseString); });
    Controller.topicId = localStorage.getItem("topic");
    Controller.setTextAreaValue("loginTextArea", localStorage.getItem("login"));
    Controller.setTextAreaValue("encriptionKeyTextArea", localStorage.getItem("encriptionKey"));
    enableInput();
    Controller.reload();
};
//# sourceMappingURL=Controller.js.map