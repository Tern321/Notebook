var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BranchPageController {
    // getters and setters
    static selectedBranch() {
        return BranchPageController.branch; //Model.branchesMap.get(Controller.branchId);
    }
    static selectedContention() {
        return BranchPageController.selectedBranch().contentionsMap.get(BranchPageController.selectedContentionId);
    }
    static getEncriptionKey() {
        return Common.getTextAreaValue("encriptionKeyTextArea").trim();
    }
    static argumentTextArea() {
        return document.getElementById("argumentTextArea");
    }
    // files
    static addFile(ev) {
        if (!BranchPageController.selectedContentionId) {
            BranchPageController.selectedContentionId = BranchPageController.topicId;
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
            if (BranchPageController.selectedBranch().contentionsMap.has(id)) {
                var oldId = id;
                id = BranchPageController.selectedBranch().generateRandomId();
                idChangeMap.set(oldId, id);
                //console.log(" change id to " + cn.id);
            }
            var parentContentionId = obj.parentContentionId.toString();
            if (i == 0) {
                parentContentionId = BranchPageController.selectedContentionId;
            }
            else {
                if (idChangeMap.has(parentContentionId)) {
                    parentContentionId = idChangeMap.get(parentContentionId);
                }
            }
            BranchPageController.executeCommand(Command.addContention(id, parentContentionId, obj.text, obj.url, obj.linkId));
            BranchPageController.executeCommand(Command.changeContentionColor(id, obj.color));
            if (obj.topic) {
                BranchPageController.executeCommand(Command.createTopicFromContention(id, obj.topic));
            }
            if (obj.collapce) {
                BranchPageController.executeCommand(Command.collapseContention(id, obj.collapce));
            }
        }
    }
    // logic
    static textAreasHasFocus() {
        if (BranchPageController.argumentTextArea().matches(":focus")) {
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
        BranchPageController.argumentTextArea().text = "";
    }
    static removeTextAreaFocus() {
        BranchPageController.argumentTextArea().blur();
    }
    static cleanCutContentionList() {
        BranchPageController.cutContentionList.forEach(function (contentionId) {
            BranchPageController.setContentionBorderType(contentionId, false);
        });
        BranchPageController.cutContentionList = [];
    }
    static setContentionBorderType(id, dashed) {
        var element = document.getElementById(id);
        if (element != undefined) {
            UIDrawer.setElementBorderType(element, dashed);
        }
    }
    // actions
    static reload() {
        //const hashCode = s => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
        //var login = this.getTextAreaValue("loginTextArea").trim();
        //var encriptionKey = this.getTextAreaValue("encriptionKeyTextArea").trim();
        //if (login.length > 0) {
        //    var hash = Math.abs(hashCode(login));
        //    localStorage.setItem("login", login);
        //    localStorage.setItem("encriptionKey", encriptionKey);
        //    Network.sendRequest(Network.loadJsonUrl(login)).then(responseString => {
        //        Model.decriptJson(responseString, Controller.getEncriptionKey()); 
        //    }).catch(function (body) {
        //        console.log("loadJson error");
        //        Model.parseJson("");
        //    });
        //}
        //else {
        //    console.log("load default data");
        //    Model.parseJson("");
        //    //var url = "https://backendlessappcontent.com/4498E4FA-01A9-8E7F-FFC3-073969464300/B416CA2D-2783-4942-A3ED-B132738BE078/files/DataFolder/1544803905.json";
        //    //Network.loadJson("instruction url");
        //}
    }
    static AccountPage() {
        var win = window.open("/Account/AccountPage", '_blank');
        win.focus();
    }
    static executeCommand(command) {
        BranchPageController.branch.executeUICommand(command);
    }
    // UI
    static hideKeyboard() {
        BranchPageController.argumentTextArea().focus();
        BranchPageController.argumentTextArea().blur();
    }
    static showLogin() {
        document.getElementById("loginTextArea").style.width = "400px";
        document.getElementById("encriptionKeyTextArea").style.width = "400px";
    }
    static copy() {
        var text = "";
        if (BranchPageController.selectedContention().url == undefined) {
            text = BranchPageController.selectedContention().text;
        }
        else {
            text = BranchPageController.selectedContention().url;
        }
        var w = window;
        w.Clipboard = (function (window, document, navigator) {
            var textArea, copy;
            function isOS() {
                return navigator.userAgent.match(/ipad|iphone/i);
            }
            function createTextArea(text) {
                textArea = document.createElement('textArea');
                textArea.value = text;
                document.body.appendChild(textArea);
            }
            function selectText() {
                var range, selection;
                if (isOS()) {
                    range = document.createRange();
                    range.selectNodeContents(textArea);
                    selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    textArea.setSelectionRange(0, 999999);
                }
                else {
                    textArea.select();
                }
            }
            function copyToClipboard() {
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            copy = function (text) {
                createTextArea(text);
                selectText();
                copyToClipboard();
            };
            return {
                copy: copy
            };
        })(w, document, navigator);
        var c = Clipboard;
        c.copy(text);
    }
    static reloadUIForBranch(branchInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            BranchPageController.branch = yield Branch.CreateBranch(branchInformation, AccountManager.branchLink(branchInformation.id).encryptionKey);
            UIDrawer.drawUI();
        });
    }
    static test() {
        return __awaiter(this, void 0, void 0, function* () {
            //var encryptedData = await CryptoWarper.encrypt("password", "test json string");
            //console.log(encryptedData);
            //var decriptedData = await CryptoWarper.decrypt("password", encryptedData);
            //console.log(decriptedData);
            //return;
            var ancor = "7b226272616e63684964223a223131222c2270617373776f7264223a227061737331222c22636f6d6d656e74223a2274657374206c696e6b222c2274797065223a2270776457222c2264617465223a2231363131343832303234222c22656e6372797074696f6e4b6579223a22656e6372797074696f6e4b6579616263227d";
            //ancor = ;
            if (ancor.length > 0) {
                var linkData = JSON.parse(Base32.base16Decode(ancor));
                AccountManager.importBranchLink(linkData);
                //AccountManager.removeBranchInformation(linkData.branchId);
                //Controller.branchId = linkData.br;
                //console.log(linkData);
                var linkData = AccountManager.branchLink(linkData.branchId);
                //console.log(linkData);
                var branchInformation = AccountManager.getBranchInformation(linkData.branchId);
                //console.log("branchInformation ");
                //console.log(branchInformation);
                //console.log("===== ");
                var text = yield Network.getBranchData(AccountManager.userId, AccountManager.userPassword, linkData.branchId, linkData.password, branchInformation.dumpVersion, branchInformation.commandsVersion);
                var branchData = JSON.parse(text);
                //console.log(branchData);
                AccountManager.updateBranchInformation(branchData);
                //console.log(branchData);
                BranchPageController.reloadUIForBranch(branchInformation);
                //if (linkData.type == "pwdW" || )
                //linkData.pwd
                // parse ancor
                // if 
            }
            //var branchId = "11";
            //var c1 = Command.addContention("root", "", "root", "", "");
            //var c2 = Command.addContention("1", "root", "text 1", "", "");
            //var commands = [];
            //commands.push(c1);
            //commands.push(c2);
            //var updateBranchesData: UpdateBranchesJson = await UpdateBranchesJson.GenerateUpdateBranchesJson("userLogin", "userPassword", branchId, "branchPassword", "dumpVersion", "encryptionKey", commands);
            //var text = JSON.stringify(updateBranchesData);
            //var response = await Network.updateBranchesData(updateBranchesData);
            //console.log(response);
        });
    }
}
//static branchId: string = "1";
BranchPageController.topicId = "root";
BranchPageController.changeSelectedContention = false;
BranchPageController.shouldSaveContentionOrder = true;
BranchPageController.showAllEnabled = false;
BranchPageController.cutContentionList = [];
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
    BranchPageController.test();
    //var linkA = new BranchLinkJson();
    //linkA.branchId = "11";
    //linkA.password = "pass1";
    //linkA.comment = "test link";
    //linkA.type = "pwdW";
    //linkA.date = "1611482024";
    //linkA.encryptionKey = "encryptionKeyabc"
    //var json = JSON.stringify(linkA);
    //console.log(json);
    //console.log(Base32.base16Encode(json));
    //var base32 = Base32.base32Encode(json);
    //console.log(base32);
    //console.log(Base32.base32Decode(base32));
    //var array = [];
    //for (var i = 0; i < 255; i++) {
    //    array.push(i);
    //}
    //console.log("array");
    //console.log(array);
    //var array8 = new Uint8Array(array);
    //console.log("array8");
    //console.log(array8);
    //console.log(CryptoWarper.Int8toBase64(array8));
    //var buffer = array8.buffer;
    //console.log("buffer");
    //console.log(buffer);
    //console.log(CryptoWarper.arrayBufferToBase64(buffer));
    //console.log("CUSTOM");
    //console.log(CryptoWarper.bytesArrToBase64(array8));
    // ----------
    // TEST
    // ----------
    //let test = "Alice's Adventure in Wondeland.";
    //let testBytes = [...test].map(c => c.charCodeAt(0));
    //console.log('test string:', test);
    //console.log('bytes:', JSON.stringify(testBytes));
    //console.log('btoa            ', btoa(test));
    //console.log('bytesArrToBase64', bytesArrToBase64(testBytes));
    //console.log(ancor);
    //var ancor = window.location.hash.substr(1);
    //console.log(ancor);
    //var lastVisitedBranchId = localStorage.getItem("lastVisitedBranchId");
    //localStorage.getItem("login");
    //var branchesData = new BranchesData();
    //var b1 = new BranchData();
    //b1.id = "b id 1";
    //b1.name = "test b1 name";
    //b1.password = "1read pass";
    //var b2 = new BranchData();
    //b2.id = "b id 2";
    //b2.name = "test b2 name";
    //b2.password = "2read pass";
    //branchesData.branchesDataMap.set(b1.id, b1);
    //branchesData.branchesDataMap.set(b2.id, b2);
    ////Array.from(map.entries())
    ////Array.from(map.entries())
    //var json = branchesData.stringify();
    //console.log(json);
    //branchesData = BranchesData.branchesDataFromJson(json);
    //var json = branchesData.stringify();
    //console.log(json);
    //Network.updateBranchesData("user42", "sdfssdfwefr", branchesData);
    //console.log(text);
    //Network.getBranchData("branchId", "readPassword");
    //var url = Network.getJsonUpdateTimeUrl(Controller.getTextAreaValue("loginTextArea").trim());
    ////Network.sendRequest(url).then(responseString => { console.log(responseString); });
    //Controller.topicId = localStorage.getItem("topic");
    //Controller.setTextAreaValue("loginTextArea", localStorage.getItem("login"));
    //Controller.setTextAreaValue("encriptionKeyTextArea", localStorage.getItem("encriptionKey"));
    enableInput();
};
//# sourceMappingURL=BranchPageController.js.map