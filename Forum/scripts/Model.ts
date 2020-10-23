class Model {
    //static contentionsList: Contention[] = [];
    static contentionsMap: Map<string, Contention> = new Map();


    static decriptJson(jsonText: string, password: string) {
        //console.log("got from server " + jsonText);
        //try {
            var data: SerializedData = <SerializedData>JSON.parse(jsonText);
            //console.log(data.version);
            //console.log(data.json);
            Controller.currentVersion = data.version;
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
                    }).catch(function (json: string) {
                        console.log("decription error ");
                    });
                }
                else {
                    //console.log("decription error ");
                    //console.log("new format, data not encripted");
                    Model.parseJson(data.encriptedData.encriptedString);
                }
            }
        //}
        //catch (e) {
        //    console.log(e);
        //    console.log("decriptJson error");
        //    Model.parseJson("[]");
        //}
        //if (Model.contentionsMap.keys.length == 0) {
        //    console.log("parse default Json " + jsonText);
        //    Model.parseJson("[]");
        //}
        //console.log("decriptJson done");
    }
    static parseJson(jsonText: string) {
        
        Model.contentionsMap = new Map();
        try {
            var objectsList = [];
            objectsList = <Contention[]>JSON.parse(jsonText);
            if (objectsList.length == 0 && jsonText.length > 10) {
                console.log("decription error ");
            }
            // fill contentionsMap and contentionsList with real objects
            objectsList.forEach(function (obj) {
                var cn = new Contention();
                cn.id = obj.id.toString();
                cn.text = obj.text;
                cn.parentContentionId = obj.parentContentionId;
                cn.childs = obj.childs;
                cn.color = obj.color;
                cn.collapce = obj.collapce;
                cn.topic = obj.topic;
                cn.childTopics = obj.childTopics;
                Model.contentionsMap.set(cn.id, cn);
            });
        }
        catch (e) {
            console.log("parce error " + e);
        }
        // add root element if there is no one
        if (!Model.contentionsMap.has("root")) {
            console.log("create root topic");
            var cn = new Contention();
            cn.id = "root";
            cn.text = "root";
            cn.parentContentionId = "-1";
            cn.width = 320;
            cn.topic = true;
            Model.contentionsMap.set(cn.id, cn);
        }

        Model.contentionsMap.get("root").topic = true;
        Model.updateTopicsFor(Model.contentionsMap.get("root"));

        Controller.topicId = "root";
        UIDrawer.drawUI(false);
    }

    static updateTopicsFor(topic: Contention) {
        topic.childTopics = [];
        topic.childs.forEach(function (childContentionId) {
            var childContention = Model.contentionForId(childContentionId);
            Model.recursiveUpdateParentTopic(childContention, topic);
        });
    }

    static recursiveUpdateParentTopic(contention: Contention, parentTopic: Contention) {
        if (contention.topic) {
            parentTopic.childTopics.push(contention.id);
        }
        else {
            contention.childs.forEach(function (childContentionId) {
                var childContention = Model.contentionForId(childContentionId);
                Model.recursiveUpdateParentTopic(childContention, parentTopic);
            });
        }
    }

    static removeContention(id: string) {
        var cn = Model.contentionForId(id);
        var parentTopic = cn.parentTopic();
        var parentContention = cn.parentContention();

        var index: number = parentContention.childs.indexOf(id)
        if (index > -1) {
            parentContention.childs.splice(index, 1);
        }
        cn.parentContentionId = "-1";
        Model.contentionsMap.delete(id);
        Model.updateTopicsFor(parentTopic);
    }


    static moveContention(id: string, parentId: string) {
        var cn = Model.contentionForId(id);
        var parentTopic = cn.parentTopic();
        Model.removeContention(id);
        Model.updateTopicsFor(parentTopic);

        Model.contentionForId(parentId).childs.push(cn.id);
        Model.contentionsMap.set(cn.id, cn);
        cn.parentContentionId = parentId;
        Model.updateTopicsFor(cn.parentTopic());
    }
    static addContentionWithId(text: string, parentId: string, id: string) {
        text = text.trim();
        if (text.length > 0) {
            var cn = new Contention();
            cn.id = id;
            cn.text = text;
            cn.parentContentionId = parentId;
            cn.width = 320;

            Model.contentionForId(parentId).childs.push(cn.id);
            Model.contentionsMap.set(cn.id, cn);
        }
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

        var index: number = parentContention.childs.indexOf(cn.id);
        if (index > -1) {
            parentContention.childs.splice(index, 1);
        }
        cn.parentContention().childs.unshift(cn.id);
    }

    
}

class Contention {
    id: string;
    text: string;
    parentContentionId: string;
    childs: string[] = [];
    childTopics: string[] = [];

    width: number = 0;
    height: number = 0;
    depth: number = 0;
    color: string = "#FFF";
    collapce: boolean = false;
    topic: boolean = false;
    constructor() {
        this.childs = [];
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
        this.childs.forEach(function (childContentionId) {
            var childContention = Model.contentionForId(childContentionId);
            childContention.recursiveAddChilds(list);
        });
    }

    indexInParentContention(): number {
        if (!this.parentContentionId) {
            return -1;
        }
        return this.parentContention().childs.indexOf(this.id);
    }
    nextOrDefault(): Contention {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() + 1;
        if (index < parentContention.childs.length) {
            return Model.contentionForId(parentContention.childs[index])
        }
        return;
    }
    previosOrDefault(): Contention
    {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() - 1;
        if (index >= 0 ) {
            return Model.contentionForId(parentContention.childs[index])
        }
        return;
    }
}

class SerializedData {
    version: number;
    json: string;
    encriptedData: EncriptionData;
}