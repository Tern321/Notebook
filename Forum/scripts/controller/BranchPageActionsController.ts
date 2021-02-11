class BranchPageActionsController {

    // selection
    static selectContention(e) {
        this.selectContentionById(e.getAttribute("id"));
    }
    static selectContentionById(contentionId) {
        UIDrawer.deselectElement(document.getElementById(BranchPageController.selectedContentionId));
        UIDrawer.selectElement(document.getElementById(contentionId));
        BranchPageController.selectedContentionId = contentionId;
    }
    

    // move
    static moveContention(targetContentionId: string) {

        var testParents = BranchPageController.selectedContention();
        if (BranchPageController.selectedBranch().contentionForId(targetContentionId).parentContentionId == BranchPageController.selectedContentionId) {
            //console.log("moveContentionToTop");
            
            BranchPageController.executeCommand(Command.moveContentionToTop(targetContentionId));

            //console.log("moveContention");
            var archiveContentionId = BranchPageController.selectedBranch().archiveIdForContention(BranchPageController.selectedContentionId);

            if (BranchPageController.selectedBranch().contentionsMap.has(archiveContentionId)) {
                BranchPageController.executeCommand(Command.moveContentionToTop(archiveContentionId));
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
            BranchPageController.executeCommand(Command.moveContention(targetContentionId, BranchPageController.selectedContention().id));
        }
        UpdateDataRequestController.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static moveContentionSelection(keyCode: number) {
        var leftKeyCode = 37;
        var upKeyCode = 38;
        var rightKeyCode = 39;
        var downKeyCode = 40;
        //switch
        if (keyCode == leftKeyCode) {
            var contentionIdToSelect = BranchPageController.selectedContention().parentContentionId;
            if (contentionIdToSelect && BranchPageController.contentionIsVisible(contentionIdToSelect)) {
                this.selectContentionById(contentionIdToSelect);
            }
        }
        if (keyCode == rightKeyCode) {
            var contentionIdToSelect = BranchPageController.selectedContention().childs()[BranchPageController.selectedContention().childs().length-1];
            if (contentionIdToSelect && BranchPageController.contentionIsVisible(contentionIdToSelect)) {
                this.selectContentionById(contentionIdToSelect);
            }
        }
        if (keyCode == upKeyCode) {
            var previosContention = BranchPageController.selectedContention().previosOrDefault();
            if (previosContention) {
                this.selectContentionById(previosContention.id);
            }
            else {
                var offset = 0;
                var contention = BranchPageController.selectedContention();
                while (contention && !previosContention) {
                    contention = contention.parentContention();
                    previosContention = contention.previosOrDefault();
                    offset++;
                }
                contention = previosContention;
                while (contention.childs().length > 0 && offset > 0 && BranchPageController.contentionIsVisible(contention.childs()[contention.childs().length - 1])) {
                    contention = BranchPageController.selectedBranch().contentionForId(contention.childs()[contention.childs().length - 1]);
                    offset--;
                }
                if (contention) {
                    this.selectContentionById(contention.id);
                }
            }
        }
        if (keyCode == downKeyCode) {

            var nextContention = BranchPageController.selectedContention().nextOrDefault();
            if (nextContention) {
                this.selectContentionById(nextContention.id);
            }
            else {
                var offset = 0;
                var contention = BranchPageController.selectedContention();
                while (contention && !nextContention) {
                    contention = contention.parentContention();
                    nextContention = contention.nextOrDefault();
                    offset++;
                }
                contention = nextContention;
                while (contention.childs().length > 0 && offset > 0 && BranchPageController.contentionIsVisible(contention.childs()[0])) {
                    contention = BranchPageController.selectedBranch().contentionForId(contention.childs()[0]);
                    offset--;
                }
                if (contention) {
                    this.selectContentionById(contention.id);
                }
            }
        }
    }
    static moveContentionUp(up: boolean) {
        BranchPageController.shouldSaveContentionOrder = true;
        var parentContention = BranchPageController.selectedContention().parentContention();
        var index = parentContention.childs().indexOf(BranchPageController.selectedContentionId);
        if (up) {
            if (index > 0) {
                var secondElementId = parentContention.childs()[index - 1];
                UIDrawer.switchElements(document.getElementById(BranchPageController.selectedContentionId), document.getElementById(secondElementId));
                BranchPageController.executeCommand(Command.switchContentionsOrder(BranchPageController.selectedContentionId, secondElementId, parentContention.id));
            }
        }
        else {
            if (index < parentContention.childs().length - 1) {
                var secondElementId = parentContention.childs()[index + 1];
                UIDrawer.switchElements(document.getElementById(secondElementId), document.getElementById(BranchPageController.selectedContentionId));
                BranchPageController.executeCommand(Command.switchContentionsOrder(BranchPageController.selectedContentionId, secondElementId, parentContention.id,));
            }
        }
    }
    
    // add
    static addLink() {

        var contention = BranchPageController.selectedContention();
        var parentContentionId = contention.parentContentionId;
        var text = "Link (" + contention.text + ")";
        BranchPageController.executeCommand(Command.addContention( BranchPageController.selectedBranch().generateRandomId(), contention.parentContentionId, text, contention.url, contention.id));
        UpdateDataRequestController.saveUpdatedData();
        UIDrawer.drawUI();
    }

    static addContentionOrUrl() {
        
        var textArea: any = BranchPageController.argumentTextArea();
        if (textArea.value.startsWith("http")) {
            BranchPageActionsController.addUrl();
        }
        else {
            BranchPageActionsController.addContention();
        }
    }
    // add
    static addContention() {
        if (!BranchPageController.selectedContentionId) {
            BranchPageController.selectedContentionId = BranchPageController.topicId;
        }

        var textArea: any = BranchPageController.argumentTextArea();
        BranchPageActionsController.addContentionWithText(textArea.value.split("\n").join("<br>"), BranchPageController.selectedContentionId);
        textArea.value = "";
        textArea.focus();
        UpdateDataRequestController.saveUpdatedData();
        UIDrawer.drawUI();
    }

    static copyContentionCtrlC() {

        BranchPageController.cleanCutContentionList();

        var textArea: any = BranchPageController.argumentTextArea();
        textArea.focus();
        var contention = BranchPageController.selectedContention();
        if (contention.url == undefined) {
            textArea.value = BranchPageController.selectedContention().text;
        }
        else {
            textArea.value = BranchPageController.selectedContention().url;
        }

        textArea.select();
        setTimeout(function () { BranchPageController.removeTextAreaFocus(); }, 50);
    }

    static cutContentionCtrlX() {
        var indexInCutArray = BranchPageController.cutContentionList.indexOf(BranchPageController.selectedContentionId);
        if (indexInCutArray > -1) {
            BranchPageController.cutContentionList.splice(indexInCutArray, 1);
            BranchPageController.setContentionBorderType(BranchPageController.selectedContentionId, false);
        }
        else {
            BranchPageController.cutContentionList.push(BranchPageController.selectedContentionId);
            BranchPageController.setContentionBorderType(BranchPageController.selectedContentionId, true);
        }
    }
    
    static addContentionCtrlV() {
        if (BranchPageController.cutContentionList.length > 0) {

            BranchPageController.cutContentionList.forEach(function (contentionId) {
                BranchPageController.executeCommand(Command.moveContention(contentionId, BranchPageController.selectedContentionId));
            });

            BranchPageController.cleanCutContentionList();
            UIDrawer.drawUI();
            UpdateDataRequestController.saveUpdatedData();
        }
        else {
            var textArea: any = BranchPageController.argumentTextArea();
            textArea.focus();
            textArea.select();
            setTimeout(function () { BranchPageActionsController.addContentionOrUrl(); BranchPageController.removeTextAreaFocus(); }, 50);
        }
    }

    static addContentionList() {
        if (!BranchPageController.selectedContentionId) {
            BranchPageController.selectedContentionId = BranchPageController.topicId;
        }

        var textArea: any = BranchPageController.argumentTextArea();

        textArea.value.split(/\r?\n/).forEach(function (line) {
            if (line.startsWith("http")) {
                BranchPageActionsController.addUrlTask("", line, BranchPageController.selectedContentionId)
            }
            else {
                BranchPageActionsController.addContentionWithText(line, BranchPageController.selectedContentionId);
            }
        });

        textArea.value = "";
        textArea.focus();
        UpdateDataRequestController.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static addUrl() {
        if (!BranchPageController.selectedContentionId) {
            BranchPageController.selectedContentionId = BranchPageController.topicId;
        }

        var textArea: any = BranchPageController.argumentTextArea();
        var text: string = textArea.value + " ";
        var lines = text.split(/\r?\n/);
        text = text.substring(lines[0].length)
        text = text.replace("\r", "").trim().split("\n").join("<br>").trim();
        BranchPageActionsController.addUrlTask(text, lines[0], BranchPageController.selectedContentionId);
        textArea.value = "";
        textArea.focus();
        UpdateDataRequestController.saveUpdatedData();
        UIDrawer.drawUI();

    }

    static addContentionWithText(text: string, parentId: string) {
        this.addContentionWithId(text, parentId, BranchPageController.selectedBranch().generateRandomId());
    }

    static archiveForContention(contentionId: string): Contention {
        var cn: Contention = BranchPageController.selectedBranch().contentionForId(contentionId);
        var archiveId = BranchPageController.selectedBranch().archiveIdForContention(cn.id);
        if (!BranchPageController.selectedBranch().contentionsMap.has(archiveId)) {
            BranchPageActionsController.addContentionWithId("(" + cn.text + ")", cn.id, archiveId);
            BranchPageController.selectedBranch().contentionForId(archiveId).collapce = true;
        }
        var archiveContention = BranchPageController.selectedBranch().contentionForId(archiveId);
        BranchPageController.executeCommand(Command.moveContentionToTop(archiveId));
        return archiveContention;
    }

    // change
    static changeContention() {
        var selectedcontention: Contention = BranchPageController.selectedContention();
        var textArea: any = BranchPageController.argumentTextArea();
        var text: string = textArea.value.trim();

        if (text.length == 0) {
            return;
        }
        selectedcontention.updateText(text);
        textArea.value = "";
        UpdateDataRequestController.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static copyContentionText() {
        var selectedcontention: Contention = BranchPageController.selectedContention();
        var textArea: any = BranchPageController.argumentTextArea();
        textArea.value = selectedcontention.text;
    }

    static changeContentionColor(color: string) {
        BranchPageController.executeCommand(Command.changeContentionColor(BranchPageController.selectedContentionId, color));
        UpdateDataRequestController.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static deleteContention() {
        //console.log("removeContention " + Controller.selectedContentionId);
        var contentionId = BranchPageController.selectedContention().id;
        var nextContention = BranchPageController.selectedContention().nextOrDefault();

        if (nextContention == undefined) {
            this.selectContentionById(BranchPageController.selectedContention().parentContentionId);
        }
        else {
            this.selectContentionById(nextContention.id);
        }
        
        BranchPageController.executeCommand(Command.removeContention(contentionId));
        UpdateDataRequestController.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static collapceContention(contentionId: string) {
        BranchPageController.executeCommand(Command.collapseContention( contentionId, !BranchPageController.selectedBranch().contentionForId(contentionId).collapce));
        UpdateDataRequestController.saveUpdatedData();
        UIDrawer.drawUI();
    }

    static collapceSelectedContention() {
        BranchPageActionsController.collapceContention(BranchPageController.selectedContentionId);
    }

    static addSelectedToArchive() {
        this.addToArchive(BranchPageController.selectedContentionId);
    }
    
    static addToArchive(contentionId: string) {
        var cn: Contention = BranchPageController.selectedBranch().contentionsMap.get(contentionId);
        var archiveContention = BranchPageActionsController.archiveForContention(cn.parentContentionId);
        BranchPageController.executeCommand(Command.moveContention(cn.id, archiveContention.id));

        UpdateDataRequestController.saveUpdatedData();
        UIDrawer.drawUI();
    }

    // topic
    static createTopicFromContention()
    {
        BranchPageController.executeCommand(Command.createTopicFromContention(BranchPageController.selectedContentionId, !BranchPageController.selectedContention().topic));
        UpdateDataRequestController.saveUpdatedData();
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
                    BranchPageController.importJson(reader.result.toString());
                    UpdateDataRequestController.saveUpdatedData();
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
        BranchPageController.selectedContention().recursiveAddChilds(list);
        var json = JSON.stringify(list);
        download(BranchPageController.selectedContention().text + Date.now() + ".json", json);
    }
    // other
    static moveToTopic(event: any, topicId: string) { // refactor to show all property
        BranchPageController.showAllEnabled = event.ctrlKey || event.metaKey;

        BranchPageController.topicId = topicId;
        localStorage.setItem("topic", BranchPageController.topicId);
        UIDrawer.drawUI();
    }
    static saveContentionOrder() {
        if (BranchPageController.shouldSaveContentionOrder) {
            BranchPageController.shouldSaveContentionOrder = false;

            UpdateDataRequestController.saveUpdatedData();
            UIDrawer.drawUI();
        }
    }

    // sugar
    static addContentionWithLinkId(text: string, parentId: string, id: string, linkId: string) {
        BranchPageController.executeCommand(Command.addContention(id, parentId, text, undefined, linkId));
    }

    static addContentionWithId(text: string, parentId: string, id: string) {
        BranchPageController.executeCommand(Command.addContention(id, parentId, text, undefined, undefined));
    }

    static addUrlTask(text: string, url: string, parentId: string) {
        BranchPageController.executeCommand(Command.addContention( BranchPageController.selectedBranch().generateRandomId(), parentId, text, url, undefined));
    }
}
