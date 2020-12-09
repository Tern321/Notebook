class Controller {

    static topicId: string = "root";
    static selectedContentionId: string;
    static changeSelectedContention: boolean = false;
    static shouldSaveContentionOrder: boolean = true;
    static showAllEnabled: boolean = false;

    static cutContentionList: string[] = []

    static selectedcontention(): Contention {
        return Model.contentionsMap.get(Controller.selectedContentionId);
    }

    static moveToTopic(event: any, topicId: string) { // refactor to show all property
        Controller.showAllEnabled = event.ctrlKey;
        
        Controller.topicId = topicId;
        localStorage.setItem("topic", Controller.topicId);
        UIDrawer.drawUI();
    }

    //static viewAll() {
    //    Controller.topicId = "root";
    //    UIDrawer.drawUI();
    //}


    static getTextAreaValue(id: string): string {
        var textArea: any = document.getElementById(id);
        return textArea.value;
    }
    static setTextAreaValue(key: string, value: string) {
        var textArea: any = document.getElementById(key);
        textArea.value = value;
    }
    static getEncriptionKey(): string {
        return this.getTextAreaValue("encriptionKeyTextArea").trim();
    }
    static contentionIsVisible(contentionId: string): boolean {
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


    static saveContentionOrder() {
        if (Controller.shouldSaveContentionOrder) {
            this.shouldSaveContentionOrder = false;

            UpdateDataRequestController.checkChangeTimeAndSaveUpdatedData();
            UIDrawer.drawUI();
        }
    }

    static importJson(json: string) {
        console.log("importJson " + json);
        var idChangeMap: Map<string, string> = new Map();

        var objectsList = <Contention[]>JSON.parse(json);
       
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

            if (i==0) {
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
            cn.collapce = obj.collapce ? true: false;
            cn.topic = obj.topic ? true : false;
            if (cn.topic) {
                cn.parentTopic().childTopics().push(cn.id);
            }
            
            Model.contentionsMap.set(cn.id, cn);
        }
    }

    static argumentTextArea(): any {
        return document.getElementById("argumentTextArea");
    }
    static cleanTextArea() {
        Controller.argumentTextArea().text = "";
    }

    static removeTextAreaFocus() {
        Controller.argumentTextArea().blur();
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
        } else {
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

    static textAreasHasFocus(): boolean
    {
        if (Controller.argumentTextArea().matches(":focus")) { return true; }
        if (document.getElementById("loginTextArea").matches(":focus")) { return true; }
        if (document.getElementById("encriptionKeyTextArea").matches(":focus")) { return true; }

        return false;
    }

    static setContentionBorderType(id:string, dashed: boolean) {
        var element = document.getElementById(id);
        if (element != undefined) {
            UIDrawer.setElementBorderType(element, dashed);
        }
    }
    static cleanCutContentionList() {
        Controller.cutContentionList.forEach(function (contentionId) {
            Controller.setContentionBorderType(contentionId, false);
        });
        Controller.cutContentionList = [];
    }
}

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

