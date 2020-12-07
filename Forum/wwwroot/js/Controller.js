class Controller {
    // selection
    static selectContention(e) {
        this.selectContentionById(e.getAttribute("id"));
    }
    static selectContentionById(contentionId) {
        UIDrawer.deselectElement(document.getElementById(this.selectedContentionId));
        UIDrawer.selectElement(document.getElementById(contentionId));
        this.selectedContentionId = contentionId;
    }
    static selectedcontention() {
        return Model.contentionsMap.get(Controller.selectedContentionId);
    }
    // move
    static moveContention(targetContentionId) {
        var testParents = Controller.selectedcontention();
        if (Model.contentionForId(targetContentionId).parentContentionId == Controller.selectedContentionId) {
            //console.log("moveContentionToTop");
            Model.moveContentionToTop(Model.contentionForId(targetContentionId));
            //console.log("moveContention");
            var archiveContentionId = Model.archiveIdForContention(Controller.selectedContentionId);
            if (Model.contentionsMap.has(archiveContentionId)) {
                Model.moveContentionToTop(Model.contentionForId(archiveContentionId));
                //console.log("parent contains archive");
            }
        }
        else {
            // �������� ��� �� �� ���������� ������� � ������
            while (testParents && testParents.parentContentionId != "-1") {
                if (testParents.id == targetContentionId) {
                    //console.log("error contention move");
                    return;
                }
                testParents = testParents.parentContention();
            }
            Model.moveContention(targetContentionId, Controller.selectedcontention().id);
        }
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static moveContentionSelection(keyCode) {
        var leftKeyCode = 37;
        var upKeyCode = 38;
        var rightKeyCode = 39;
        var downKeyCode = 40;
        //switch
        if (keyCode == leftKeyCode) {
            var contentionIdToSelect = this.selectedcontention().parentContentionId;
            if (contentionIdToSelect && this.contentionIsVisible(contentionIdToSelect)) {
                this.selectContentionById(contentionIdToSelect);
            }
        }
        if (keyCode == rightKeyCode) {
            var contentionIdToSelect = this.selectedcontention().childs()[0];
            if (contentionIdToSelect && this.contentionIsVisible(contentionIdToSelect)) {
                this.selectContentionById(contentionIdToSelect);
            }
        }
        if (keyCode == upKeyCode) {
            var previosContention = this.selectedcontention().previosOrDefault();
            if (previosContention) {
                this.selectContentionById(previosContention.id);
            }
            else {
                var offset = 0;
                var contention = this.selectedcontention();
                while (contention && !previosContention) {
                    contention = contention.parentContention();
                    previosContention = contention.previosOrDefault();
                    offset++;
                }
                contention = previosContention;
                while (contention.childs().length > 0 && offset > 0 && this.contentionIsVisible(contention.childs()[contention.childs().length - 1])) {
                    contention = Model.contentionForId(contention.childs()[contention.childs().length - 1]);
                    offset--;
                }
                if (contention) {
                    this.selectContentionById(contention.id);
                }
            }
        }
        if (keyCode == downKeyCode) {
            var nextContention = this.selectedcontention().nextOrDefault();
            if (nextContention) {
                this.selectContentionById(nextContention.id);
            }
            else {
                var offset = 0;
                var contention = this.selectedcontention();
                while (contention && !nextContention) {
                    contention = contention.parentContention();
                    nextContention = contention.nextOrDefault();
                    offset++;
                }
                contention = nextContention;
                while (contention.childs().length > 0 && offset > 0 && this.contentionIsVisible(contention.childs()[0])) {
                    contention = Model.contentionForId(contention.childs()[0]);
                    offset--;
                }
                if (contention) {
                    this.selectContentionById(contention.id);
                }
            }
        }
    }
    static moveContentionUp(up) {
        this.shouldSaveContentionOrder = true;
        var parentContention = this.selectedcontention().parentContention();
        var index = parentContention.childs().indexOf(this.selectedContentionId);
        if (up) {
            if (index > 0) {
                // UIDrawer.switchElements
                var secondElementId = parentContention.childs()[index - 1];
                UIDrawer.switchElements(document.getElementById(this.selectedContentionId), document.getElementById(secondElementId));
                parentContention.childs()[index] = secondElementId;
                parentContention.childs()[index - 1] = this.selectedContentionId;
            }
        }
        else {
            if (index < parentContention.childs().length - 1) {
                var secondElementId = parentContention.childs()[index + 1];
                UIDrawer.switchElements(document.getElementById(secondElementId), document.getElementById(this.selectedContentionId));
                parentContention.childs()[index] = secondElementId;
                parentContention.childs()[index + 1] = this.selectedContentionId;
            }
        }
    }
    static saveContentionOrder() {
        if (this.shouldSaveContentionOrder) {
            this.shouldSaveContentionOrder = false;
            UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
            UIDrawer.drawUI();
        }
    }
    // add
    static addContentionOrLink() {
        var textArea = document.getElementById("argumentTextArea");
        if (textArea.value.startsWith("http")) {
            Controller.addLink();
        }
        else {
            Controller.addContention();
        }
    }
    // add
    static addContention() {
        if (!Controller.selectedContentionId) {
            Controller.selectedContentionId = Controller.topicId;
        }
        var textArea = document.getElementById("argumentTextArea");
        Model.addContention(textArea.value.split("\n").join("<br>"), Controller.selectedContentionId);
        textArea.value = "";
        textArea.focus();
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static copyContentionCtrlC() {
        var textArea = document.getElementById("argumentTextArea");
        textArea.focus();
        var contention = Controller.selectedcontention();
        if (contention.url == undefined) {
            textArea.value = Controller.selectedcontention().text;
        }
        else {
            textArea.value = Controller.selectedcontention().url;
        }
        textArea.select();
        setTimeout(function () { Controller.removeTextAreaFocus(); }, 100);
    }
    static deleteContentionCtrlX() {
    }
    static removeTextAreaFocus() {
        var textArea = document.getElementById("argumentTextArea");
        textArea.blur();
    }
    static addContentionCtrlV() {
        var textArea = document.getElementById("argumentTextArea");
        textArea.focus();
        textArea.select();
        setTimeout(function () { Controller.addContention(); Controller.removeTextAreaFocus(); }, 100);
    }
    static addContentionList() {
        if (!Controller.selectedContentionId) {
            Controller.selectedContentionId = Controller.topicId;
        }
        var textArea = document.getElementById("argumentTextArea");
        textArea.value.split(/\r?\n/).forEach(function (line) {
            Model.addContention(line, Controller.selectedContentionId);
        });
        textArea.value = "";
        textArea.focus();
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static addLink() {
        if (!Controller.selectedContentionId) {
            Controller.selectedContentionId = Controller.topicId;
        }
        var textArea = document.getElementById("argumentTextArea");
        var text = textArea.value + " ";
        var lines = text.split(/\r?\n/);
        text = text.substring(lines[0].length);
        text = text.replace("\r", "").trim().split("\n").join("<br>").trim();
        Model.addLink(text, lines[0], Controller.selectedContentionId);
        textArea.value = "";
        textArea.focus();
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
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
    // change
    static changeContention() {
        var selectedcontention = Controller.selectedcontention();
        var textArea = document.getElementById("argumentTextArea");
        var text = textArea.value.trim();
        if (text.length == 0) {
            return;
        }
        selectedcontention.updateText(text);
        textArea.value = "";
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static copyContentionText() {
        var selectedcontention = Controller.selectedcontention();
        var textArea = document.getElementById("argumentTextArea");
        textArea.value = selectedcontention.text;
    }
    static changeContentionColor(color) {
        var selectedcontention = Controller.selectedcontention();
        selectedcontention.color = color;
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static deleteContention() {
        //console.log("removeContention " + Controller.selectedContentionId);
        Model.removeContention(Controller.selectedContentionId);
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static collapceContention(contentionId) {
        var cn = Model.contentionsMap.get(contentionId);
        cn.collapce = !cn.collapce;
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static collapceSelectedContention() {
        var cn = Controller.selectedcontention();
        cn.collapce = !cn.collapce;
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static addSelectedToArchive() {
        this.addToArchive(this.selectedContentionId);
    }
    static addToArchive(contentionId) {
        var cn = Model.contentionsMap.get(contentionId);
        var archiveContention = Model.archiveForContention(cn.parentContention());
        Model.moveContention(cn.id, archiveContention.id);
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    // topic
    static createTopicFromContention() {
        var selectedcontention = Controller.selectedcontention();
        selectedcontention.collapce = true;
        selectedcontention.topic = !selectedcontention.topic;
        Model.childTopicsMap.set(selectedcontention.id, []);
        Model.updateTopics();
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        if (selectedcontention.topic) {
            //Controller.topicId = selectedcontention.id;
        }
        UIDrawer.drawUI();
    }
    static moveToTopic(event, topicId) {
        Controller.showAllEnabled = event.ctrlKey;
        Controller.topicId = topicId;
        localStorage.setItem("topic", Controller.topicId);
        UIDrawer.drawUI();
    }
    static viewAll() {
        Controller.topicId = "root";
        UIDrawer.drawUI();
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
    static contentionIsVisible(contentionId) {
        return document.getElementById(contentionId) != undefined;
    }
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
    static import() {
        var element = document.createElement('div');
        element.innerHTML = '<input type="file">';
        var fileInput = element.firstChild;
        fileInput.addEventListener('change', function () {
            var file = fileInput.files[0];
            if (file.name.match(/\.(txt|json)$/)) {
                var reader = new FileReader();
                reader.onload = function () {
                    console.log(reader.result);
                    Controller.importJson(reader.result.toString());
                    //Controller.saveUpdatedData();
                    UIDrawer.drawUI();
                };
                reader.readAsText(file);
            }
            else {
                alert("File not supported, .txt or .json files only");
            }
        });
        fileInput.click();
        //document.body.removeChild(element);
    }
    static importJson(json) {
        console.log("importJson " + json);
        var idChangeMap = new Map();
        var objectsList = JSON.parse(json);
        // fill contentionsMap and contentionsList with real objects
        for (var i = 0; i < objectsList.length; i++) {
            var obj = objectsList[i];
            var id = obj.id.toString();
            if (Model.contentionsMap.has(id)) {
                var oldId = id;
                id = Model.generateRandomId();
                idChangeMap.set(oldId, id);
                //console.log(" change id to " + cn.id);
            }
            var cn = new Contention(id, obj.topic);
            //console.log("add object " + cn.id + " text " + obj.text +" parent id "+ cn.parentContentionId);
            cn.parentContentionId = obj.parentContentionId.toString();
            if (i == 0) {
                cn.parentContentionId = Controller.selectedContentionId;
            }
            else {
                if (idChangeMap.has(cn.parentContentionId)) {
                    cn.parentContentionId = idChangeMap.get(cn.parentContentionId);
                    //console.log(" change parent id to " + cn.parentContentionId);
                }
            }
            if (cn.parentContention()) { // wtf
                cn.parentContention().childs().push(cn.id);
            }
            cn.text = obj.text;
            cn.color = obj.color;
            cn.collapce = obj.collapce ? true : false;
            cn.topic = obj.topic ? true : false;
            if (cn.topic) {
                cn.parentTopic().childTopics().push(cn.id);
            }
            Model.contentionsMap.set(cn.id, cn);
        }
    }
    static export() {
        var list = [];
        this.selectedcontention().recursiveAddChilds(list);
        var json = JSON.stringify(list);
        download(this.selectedcontention().text + Date.now() + ".json", json);
    }
}
Controller.topicId = "root";
Controller.changeSelectedContention = false;
Controller.shouldSaveContentionOrder = true;
Controller.showAllEnabled = false;
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