class ActionsController {
    // selection
    static selectContention(e) {
        this.selectContentionById(e.getAttribute("id"));
    }
    static selectContentionById(contentionId) {
        UIDrawer.deselectElement(document.getElementById(Controller.selectedContentionId));
        UIDrawer.selectElement(document.getElementById(contentionId));
        Controller.selectedContentionId = contentionId;
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
            // проверка что мы не перемещаем потомка в предка
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
            var contentionIdToSelect = Controller.selectedcontention().parentContentionId;
            if (contentionIdToSelect && Controller.contentionIsVisible(contentionIdToSelect)) {
                this.selectContentionById(contentionIdToSelect);
            }
        }
        if (keyCode == rightKeyCode) {
            var contentionIdToSelect = Controller.selectedcontention().childs()[Controller.selectedcontention().childs().length - 1];
            if (contentionIdToSelect && Controller.contentionIsVisible(contentionIdToSelect)) {
                this.selectContentionById(contentionIdToSelect);
            }
        }
        if (keyCode == upKeyCode) {
            var previosContention = Controller.selectedcontention().previosOrDefault();
            if (previosContention) {
                this.selectContentionById(previosContention.id);
            }
            else {
                var offset = 0;
                var contention = Controller.selectedcontention();
                while (contention && !previosContention) {
                    contention = contention.parentContention();
                    previosContention = contention.previosOrDefault();
                    offset++;
                }
                contention = previosContention;
                while (contention.childs().length > 0 && offset > 0 && Controller.contentionIsVisible(contention.childs()[contention.childs().length - 1])) {
                    contention = Model.contentionForId(contention.childs()[contention.childs().length - 1]);
                    offset--;
                }
                if (contention) {
                    this.selectContentionById(contention.id);
                }
            }
        }
        if (keyCode == downKeyCode) {
            var nextContention = Controller.selectedcontention().nextOrDefault();
            if (nextContention) {
                this.selectContentionById(nextContention.id);
            }
            else {
                var offset = 0;
                var contention = Controller.selectedcontention();
                while (contention && !nextContention) {
                    contention = contention.parentContention();
                    nextContention = contention.nextOrDefault();
                    offset++;
                }
                contention = nextContention;
                while (contention.childs().length > 0 && offset > 0 && Controller.contentionIsVisible(contention.childs()[0])) {
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
        Controller.shouldSaveContentionOrder = true;
        var parentContention = Controller.selectedcontention().parentContention();
        var index = parentContention.childs().indexOf(Controller.selectedContentionId);
        if (up) {
            if (index > 0) {
                // UIDrawer.switchElements
                var secondElementId = parentContention.childs()[index - 1];
                UIDrawer.switchElements(document.getElementById(Controller.selectedContentionId), document.getElementById(secondElementId));
                parentContention.childs()[index] = secondElementId;
                parentContention.childs()[index - 1] = Controller.selectedContentionId;
            }
        }
        else {
            if (index < parentContention.childs().length - 1) {
                var secondElementId = parentContention.childs()[index + 1];
                UIDrawer.switchElements(document.getElementById(secondElementId), document.getElementById(Controller.selectedContentionId));
                parentContention.childs()[index] = secondElementId;
                parentContention.childs()[index + 1] = Controller.selectedContentionId;
            }
        }
    }
    // add
    static addContentionOrLink() {
        var textArea = Controller.argumentTextArea();
        if (textArea.value.startsWith("http")) {
            ActionsController.addLink();
        }
        else {
            ActionsController.addContention();
        }
    }
    // add
    static addContention() {
        if (!Controller.selectedContentionId) {
            Controller.selectedContentionId = Controller.topicId;
        }
        var textArea = Controller.argumentTextArea();
        Model.addContention(textArea.value.split("\n").join("<br>"), Controller.selectedContentionId);
        textArea.value = "";
        textArea.focus();
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static copyContentionCtrlC() {
        Controller.cleanCutContentionList();
        var textArea = Controller.argumentTextArea();
        textArea.focus();
        var contention = Controller.selectedcontention();
        if (contention.url == undefined) {
            textArea.value = Controller.selectedcontention().text;
        }
        else {
            textArea.value = Controller.selectedcontention().url;
        }
        textArea.select();
        setTimeout(function () { Controller.removeTextAreaFocus(); }, 50);
    }
    static cutContentionCtrlX() {
        var indexInCutArray = Controller.cutContentionList.indexOf(Controller.selectedContentionId);
        if (indexInCutArray > -1) {
            Controller.cutContentionList.splice(indexInCutArray, 1);
            Controller.setContentionBorderType(Controller.selectedContentionId, false);
        }
        else {
            Controller.cutContentionList.push(Controller.selectedContentionId);
            Controller.setContentionBorderType(Controller.selectedContentionId, true);
        }
    }
    static addContentionCtrlV() {
        if (Controller.cutContentionList.length > 0) {
            Controller.cutContentionList.forEach(function (contentionId) {
                Model.moveContention(contentionId, Controller.selectedContentionId);
            });
            Controller.cleanCutContentionList();
            UIDrawer.drawUI();
            UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        }
        else {
            var textArea = Controller.argumentTextArea();
            textArea.focus();
            textArea.select();
            setTimeout(function () { ActionsController.addContentionOrLink(); Controller.removeTextAreaFocus(); }, 50);
        }
    }
    static addContentionList() {
        if (!Controller.selectedContentionId) {
            Controller.selectedContentionId = Controller.topicId;
        }
        var textArea = Controller.argumentTextArea();
        textArea.value.split(/\r?\n/).forEach(function (line) {
            if (line.startsWith("http")) {
                Model.addLink("", line, Controller.selectedContentionId);
            }
            else {
                Model.addContention(line, Controller.selectedContentionId);
            }
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
        var textArea = Controller.argumentTextArea();
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
    // change
    static changeContention() {
        var selectedcontention = Controller.selectedcontention();
        var textArea = Controller.argumentTextArea();
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
        var textArea = Controller.argumentTextArea();
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
        var contentionId = Controller.selectedcontention().id;
        var nextContention = Controller.selectedcontention().nextOrDefault();
        if (nextContention == undefined) {
            this.selectContentionById(Controller.selectedcontention().parentContentionId);
        }
        else {
            this.selectContentionById(nextContention.id);
        }
        Model.removeContention(contentionId);
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
        this.addToArchive(Controller.selectedContentionId);
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
    static export() {
        var list = [];
        Controller.selectedcontention().recursiveAddChilds(list);
        var json = JSON.stringify(list);
        download(Controller.selectedcontention().text + Date.now() + ".json", json);
    }
}
//# sourceMappingURL=ActionsController.js.map