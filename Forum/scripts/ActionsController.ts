﻿class ActionsController {

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
    static moveContention(targetContentionId: string) {

        var testParents = Controller.selectedcontention();
        if (Model.contentionForId(targetContentionId).parentContentionId == Controller.selectedContentionId) {
            //console.log("moveContentionToTop");
            
            Controller.executeCommand(Command.moveContentionToTop(targetContentionId));

            //console.log("moveContention");
            var archiveContentionId = Model.archiveIdForContention(Controller.selectedContentionId);

            if (Model.contentionsMap.has(archiveContentionId)) {
                Controller.executeCommand(Command.moveContentionToTop(archiveContentionId));
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
            Controller.executeCommand(Command.moveContention(targetContentionId, Controller.selectedcontention().id));
        }
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static moveContentionSelection(keyCode: number) {
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
            var contentionIdToSelect = Controller.selectedcontention().childs()[Controller.selectedcontention().childs().length-1];
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
    static moveContentionUp(up: boolean) {
        Controller.shouldSaveContentionOrder = true;
        var parentContention = Controller.selectedcontention().parentContention();
        var index = parentContention.childs().indexOf(Controller.selectedContentionId);
        if (up) {
            if (index > 0) {
                var secondElementId = parentContention.childs()[index - 1];
                UIDrawer.switchElements(document.getElementById(Controller.selectedContentionId), document.getElementById(secondElementId));
                Controller.executeCommand(Command.switchContentionsOrder(Controller.selectedContentionId, secondElementId, parentContention.id));
            }
        }
        else {
            if (index < parentContention.childs().length - 1) {
                var secondElementId = parentContention.childs()[index + 1];
                UIDrawer.switchElements(document.getElementById(secondElementId), document.getElementById(Controller.selectedContentionId));
                Controller.executeCommand(Command.switchContentionsOrder(Controller.selectedContentionId, secondElementId, parentContention.id,));
            }
        }
    }
    
    // add
    static addLink() {

        var contention = Controller.selectedcontention();
        var parentContentionId = contention.parentContentionId;
        var text = "Link (" + contention.text + ")";
        Controller.executeCommand(Command.addContention(Model.generateRandomId(), contention.parentContentionId, text, contention.url, contention.id));
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }

    static addContentionOrUrl() {
        
        var textArea: any = Controller.argumentTextArea();
        if (textArea.value.startsWith("http")) {
            ActionsController.addUrl();
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

        var textArea: any = Controller.argumentTextArea();
        ActionsController.addContentionWithText(textArea.value.split("\n").join("<br>"), Controller.selectedContentionId);
        textArea.value = "";
        textArea.focus();
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }

    static copyContentionCtrlC() {

        Controller.cleanCutContentionList();

        var textArea: any = Controller.argumentTextArea();
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
                Controller.executeCommand(Command.moveContention(contentionId, Controller.selectedContentionId));
            });

            Controller.cleanCutContentionList();
            UIDrawer.drawUI();
            UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        }
        else {
            var textArea: any = Controller.argumentTextArea();
            textArea.focus();
            textArea.select();
            setTimeout(function () { ActionsController.addContentionOrUrl(); Controller.removeTextAreaFocus(); }, 50);
        }
    }

    static addContentionList() {
        if (!Controller.selectedContentionId) {
            Controller.selectedContentionId = Controller.topicId;
        }

        var textArea: any = Controller.argumentTextArea();

        textArea.value.split(/\r?\n/).forEach(function (line) {
            if (line.startsWith("http")) {
                ActionsController.addUrlTask("", line, Controller.selectedContentionId)
            }
            else {
                ActionsController.addContentionWithText(line, Controller.selectedContentionId);
            }
        });

        textArea.value = "";
        textArea.focus();
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static addUrl() {
        if (!Controller.selectedContentionId) {
            Controller.selectedContentionId = Controller.topicId;
        }

        var textArea: any = Controller.argumentTextArea();
        var text: string = textArea.value + " ";
        var lines = text.split(/\r?\n/);
        text = text.substring(lines[0].length)
        text = text.replace("\r", "").trim().split("\n").join("<br>").trim();
        ActionsController.addUrlTask(text, lines[0], Controller.selectedContentionId);
        textArea.value = "";
        textArea.focus();
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();

    }

    static addContentionWithText(text: string, parentId: string) {
        this.addContentionWithId(text, parentId, Model.generateRandomId());
    }

    static archiveForContention(contentionId: string): Contention {
        var cn: Contention = Model.contentionForId(contentionId);
        var archiveId = Model.archiveIdForContention(cn.id);
        if (!Model.contentionsMap.has(archiveId)) {
            ActionsController.addContentionWithId("(" + cn.text + ")", cn.id, archiveId);
            Model.contentionForId(archiveId).collapce = true;
        }
        var archiveContention = Model.contentionForId(archiveId);
        Controller.executeCommand(Command.moveContentionToTop(archiveId));
        return archiveContention;
    }

    // change
    static changeContention() {
        var selectedcontention: Contention = Controller.selectedcontention();
        var textArea: any = Controller.argumentTextArea();
        var text: string = textArea.value.trim();

        if (text.length == 0) {
            return;
        }
        selectedcontention.updateText(text);
        textArea.value = "";
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static copyContentionText() {
        var selectedcontention: Contention = Controller.selectedcontention();
        var textArea: any = Controller.argumentTextArea();
        textArea.value = selectedcontention.text;
    }

    static changeContentionColor(color: string) {
        Controller.executeCommand(Command.changeContentionColor(Controller.selectedContentionId, color));
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
        
        Controller.executeCommand(Command.removeContention(contentionId));
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }
    static collapceContention(contentionId: string) {
        Controller.executeCommand(Command.collapseContention(contentionId, !Model.contentionForId(contentionId).collapce));
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }

    static collapceSelectedContention() {
        ActionsController.collapceContention(Controller.selectedContentionId);
    }

    static addSelectedToArchive() {
        this.addToArchive(Controller.selectedContentionId);
    }
    
    static addToArchive(contentionId: string) {
        var cn: Contention = Model.contentionsMap.get(contentionId);
        var archiveContention = ActionsController.archiveForContention(cn.parentContentionId);
        Controller.executeCommand(Command.moveContention(cn.id, archiveContention.id));

        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }

    // topic
    static createTopicFromContention()
    {
        Controller.executeCommand(Command.createTopicFromContention(Controller.selectedContentionId, !Controller.selectedcontention().topic));
        UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
        UIDrawer.drawUI();
    }


    static import() {
        var element = document.createElement('div');
        element.innerHTML = '<input type="file">';
        var fileInput: any = element.firstChild;

        fileInput.addEventListener('change', function () {
            var file = fileInput.files[0];

            if (file.name.match(/\.(txt|json)$/)) {
                var reader = new FileReader();

                reader.onload = function () {
                    console.log(reader.result);
                    Controller.importJson(reader.result.toString());
                    UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
                    UIDrawer.drawUI();
                };

                reader.readAsText(file);
            } else {
                alert("File not supported, .txt or .json files only");
            }
        });
        fileInput.click();
        //document.body.removeChild(element);
    }

    static export() {
        var list: Contention[] = [];
        Controller.selectedcontention().recursiveAddChilds(list);
        var json = JSON.stringify(list);
        download(Controller.selectedcontention().text + Date.now() + ".json", json);
    }
    // other
    static moveToTopic(event: any, topicId: string) { // refactor to show all property
        Controller.showAllEnabled = event.ctrlKey || event.metaKey;

        Controller.topicId = topicId;
        localStorage.setItem("topic", Controller.topicId);
        UIDrawer.drawUI();
    }
    static saveContentionOrder() {
        if (Controller.shouldSaveContentionOrder) {
            Controller.shouldSaveContentionOrder = false;

            UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
            UIDrawer.drawUI();
        }
    }

    // sugar
    static addContentionWithLinkId(text: string, parentId: string, id: string, linkId: string) {
        Controller.executeCommand(Command.addContention(id, parentId, text, undefined, linkId));
    }

    static addContentionWithId(text: string, parentId: string, id: string) {
        Controller.executeCommand(Command.addContention(id, parentId, text, undefined, undefined));
    }

    static addUrlTask(text: string, url: string, parentId: string) {
        Controller.executeCommand(Command.addContention(Model.generateRandomId(), parentId, text, url, undefined));
    }
}
