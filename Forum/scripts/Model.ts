class Model {
    static contentionsMap: Map<string, Contention> = new Map();

    static childContentionMap: Map<string, string[]> = new Map();
    static childTopicsMap: Map<string, string[]> = new Map();

    static decriptJson(jsonText: string, password: string) {
        var data: SerializedData = <SerializedData>JSON.parse(jsonText);
        //console.log(data.version);
        //console.log(data.json);
        if (data.json) {
            //console.log("old data format");
            Model.parseJson(data.json);
        }
        else {
            //console.log("encripted data format");
            if (password.length > 0) {
                CryptoWarper.decrypt(password, data.encriptedData).then(function (json: string) {
                    //console.log("decripted json ");
                    Model.parseJson(json);
                }).catch(function (error) {
                    console.log(error);
                });
            }
            else {
                //console.log("decription error ");
                //console.log("new format, data not encripted");
                Model.parseJson(data.encriptedData.encriptedString);
            }
        }
    }

    


    static parseJson(jsonText: string) {
        //console.log("parseJson " + jsonText);
        Model.contentionsMap = new Map();
        Model.childContentionMap = new Map();
        Model.childTopicsMap = new Map();

        try {
            var objectsList = [];
            objectsList = <Contention[]>JSON.parse(jsonText);

            // fill contentionsMap and contentionsList with real objects
            objectsList.forEach(function (obj) {
                var cn = new Contention(obj.id, obj.topic);
                cn.text = obj.text;
                cn.url = obj.url;
                cn.parentContentionId = obj.parentContentionId;
                //cn.childs = obj.childs;
                cn.color = obj.color;
                cn.collapce = obj.collapce;
                cn.topic = obj.topic;
                
                //cn.width = obj.width;
                //cn.height = obj.height;
                if (cn.topic) {
                    Model.childTopicsMap.set(cn.id, []);
                }
                //cn.childTopics = obj.childTopics;
                Model.contentionsMap.set(cn.id, cn);

                var parentContentionChildsList = Model.childContentionMap.get(cn.parentContentionId);
                if (parentContentionChildsList) {
                    parentContentionChildsList.push(cn.id);
                }
                
            });
            UpdateDataRequestController.getLastChangeTime(Network.getJsonUpdateTimeUrl(Controller.getTextAreaValue("loginTextArea").trim()));
        }
        catch (e) {
            console.log("parce error " + e);
        }

        // add root element if there is no one
        if (!Model.contentionsMap.has("root")) {
            console.log("create root topic");
            var cn = new Contention("root", true);
            cn.text = "root";
            cn.parentContentionId = "-1";
            //cn.width = 320;
            cn.topic = true;
            Model.contentionsMap.set(cn.id, cn);
        }

        Model.contentionsMap.get("root").topic = true;
        Model.updateTopics();
        UIDrawer.drawUI();
    }

    static updateTopics() {

        Model.childTopicsMap.forEach((subtopics: string[], id: string) => {
            //console.log(id);
            Model.childTopicsMap.set(id, []);
        });
        Model.childTopicsMap.forEach((subtopics: string[], id: string) => {
            //console.log(key, value);
            var topicContention = Model.contentionForId(id);
            if (topicContention && topicContention.topic) {
                var parentTopic = topicContention.parentTopic();
                //console.log(topicContention);
                if (parentTopic) {
                    parentTopic.childTopics().push(id);
                }
            }
        });
    }

    static recursiveUpdateParentTopic(contention: Contention, parentTopic: Contention) {
        if (contention.topic) {
            parentTopic.childTopics().push(contention.id);
        }
        else {
            contention.childs().forEach(function (childContentionId) {
                var childContention = Model.contentionForId(childContentionId);
                Model.recursiveUpdateParentTopic(childContention, parentTopic);
            });
        }
    }

    static removeContention(id: string) {
        var cn = Model.contentionForId(id);
        var parentTopic = cn.parentTopic();
        var parentContention = cn.parentContention();

        var index: number = parentContention.childs().indexOf(id)
        if (index > -1) {
            parentContention.childs().splice(index, 1);
        }
        cn.parentContentionId = "-1";
        Model.contentionsMap.delete(id);
        Model.updateTopics();
    }


    static moveContention(id: string, toId: string) {
        var cn = Model.contentionForId(id);
        var parentTopic = cn.parentTopic();
        Model.removeContention(id);
        Model.updateTopics();

        Model.contentionForId(toId).childs().push(cn.id);
        Model.contentionsMap.set(cn.id, cn);
        cn.parentContentionId = toId;
        Model.updateTopics();
    }
    static addContentionWithId(text: string, parentId: string, id: string) {
        this.addContentionWithIdUrl(text, undefined, parentId, id);
    }

    static addContentionWithIdUrl(text: string, url: string, parentId: string, id: string) {
        text = text.trim();
        if (text.length > 0 || url.length > 0) {
            //console.log("addContentionWithId " + id);
            var cn = new Contention(id, false);
            cn.text = text;
            cn.parentContentionId = parentId;
            cn.url = url;

            Model.contentionsMap.set(cn.id, cn);
            Model.contentionForId(parentId).childs().push(cn.id);

        }
    }
    static addLink(text: string, url:string, parentId: string) {
        this.addContentionWithIdUrl(text, url, parentId, Model.generateRandomId());
    }
    static addContention(text: string, parentId: string) {
        this.addContentionWithId(text, parentId, Model.generateRandomId());
    }

    static generateRandomId(): string {
        var id;
        do {
            id = Math.floor(Math.random() * 1000000).toString();
        } while (Model.contentionsMap.has(id));

        return id;
    }
    static contentionForId(id: string): Contention {
        return Model.contentionsMap.get(id);
    }
    static rootContention(): Contention {
        return Model.contentionsMap.get("root");
    }
    static archiveIdForContention(contentionId: string): string {

        var archiveId = "archive_" + contentionId;
        return archiveId;
    }

    static archiveForContention(cn: Contention): Contention {

        var archiveId = this.archiveIdForContention(cn.id);
        if (!Model.contentionsMap.has(archiveId)) {
            Model.addContentionWithId("(" + cn.text + ")", cn.id, archiveId);
            Model.contentionForId(archiveId).collapce = true;
        }
        var archiveContention = Model.contentionForId(archiveId);
        Model.moveContentionToTop(archiveContention);
        return archiveContention;
    }

    static moveContentionToTop(cn: Contention) {
        var parentContention = cn.parentContention();

        var index: number = parentContention.childs().indexOf(cn.id);
        if (index > -1) {
            parentContention.childs().splice(index, 1);
        }
        cn.parentContention().childs().unshift(cn.id);
    }
}

class Contention {
    id: string;
    text: string;
    url: string;
    parentContentionId: string;
    //childs: string[] = [];
    //childTopics: string[] = [];

    width: number; // this property determines if contention size is counted
    height: number;

    color: string = "#FFF";
    collapce: boolean = false;
    topic: boolean = false;

    constructor(id: string, topic: boolean) {
        this.id = id;
        Model.childContentionMap.set(this.id, []);
        if (topic) {
            Model.childTopicsMap.set(this.id, []);
        }
    }
    parentContention(): Contention {
        return Model.contentionsMap.get(this.parentContentionId)
    }
    parentTopic(): Contention {
        var parentContention = this.parentContention();

        while (parentContention && !parentContention.topic) {
            parentContention = parentContention.parentContention();
        }
        return parentContention;
    }

    recursiveAddChilds(list: Contention[]) {
        list.push(this);
        this.childs().forEach(function (childContentionId) {
            var childContention = Model.contentionForId(childContentionId);
            childContention.recursiveAddChilds(list);
        });
    }
    updateText(text: string) {
        this.text = text;
        this.width = undefined;
    }
    childs() {
        return Model.childContentionMap.get(this.id);
    }
    childTopics() {
        return Model.childTopicsMap.get(this.id);
    }

    indexInParentContention(): number {

        var parentContention = this.parentContention();
        console.log("indexInParentContention");
        console.log("contention");
        console.log(this);
        console.log("parent");
        console.log(parentContention);
        console.log("search for " + this.id);
        console.log("childs " + parentContention.childs());

        if (!parentContention) {
            return -1;
        }

        return parentContention.childs().indexOf(this.id);
    }
    nextOrDefault(): Contention {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() + 1;
        if (index < parentContention.childs().length) {
            return Model.contentionForId(parentContention.childs()[index]);
        }
        return;
    }
    previosOrDefault(): Contention {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() - 1;
        if (index >= 0) {
            return Model.contentionForId(parentContention.childs()[index]);
        }
        return;
    }
}

class SerializedData {
    version: number;
    json: string;
    encriptedData: EncriptionData;
}