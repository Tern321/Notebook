class Model {
    static decriptJson(jsonText, password) {
        //console.log("got from server " + jsonText);
        //try {
        var data = JSON.parse(jsonText);
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
                CryptoWarper.decrypt(password, data.encriptedData).then(function (json) {
                    //console.log("decripted json ");
                    Model.parseJson(json);
                }).catch(function (json) {
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
    static parseJson(jsonText) {
        Model.contentionsMap = new Map();
        try {
            var objectsList = [];
            objectsList = JSON.parse(jsonText);
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
    static updateTopicsFor(topic) {
        topic.childTopics = [];
        topic.childs.forEach(function (childContentionId) {
            var childContention = Model.contentionForId(childContentionId);
            Model.recursiveUpdateParentTopic(childContention, topic);
        });
    }
    static recursiveUpdateParentTopic(contention, parentTopic) {
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
    static removeContention(id) {
        var cn = Model.contentionForId(id);
        var parentTopic = cn.parentTopic();
        var parentContention = cn.parentContention();
        var index = parentContention.childs.indexOf(id);
        if (index > -1) {
            parentContention.childs.splice(index, 1);
        }
        cn.parentContentionId = "-1";
        Model.contentionsMap.delete(id);
        Model.updateTopicsFor(parentTopic);
    }
    static moveContention(id, parentId) {
        var cn = Model.contentionForId(id);
        var parentTopic = cn.parentTopic();
        Model.removeContention(id);
        Model.updateTopicsFor(parentTopic);
        Model.contentionForId(parentId).childs.push(cn.id);
        Model.contentionsMap.set(cn.id, cn);
        cn.parentContentionId = parentId;
        Model.updateTopicsFor(cn.parentTopic());
    }
    static addContentionWithId(text, parentId, id) {
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
    static addContention(text, parentId) {
        this.addContentionWithId(text, parentId, Model.generateRandomId());
    }
    static generateRandomId() {
        var id;
        do {
            id = Math.floor(Math.random() * 1000000).toString();
        } while (Model.contentionsMap.has(id));
        return id;
    }
    static contentionForId(id) {
        return Model.contentionsMap.get(id);
    }
    static rootContention() {
        return Model.contentionsMap.get("root");
    }
    static archiveIdForContention(contentionId) {
        var archiveId = "archive_" + contentionId;
        return archiveId;
    }
    static archiveForContention(cn) {
        var archiveId = this.archiveIdForContention(cn.id);
        if (!Model.contentionsMap.has(archiveId)) {
            Model.addContentionWithId("(" + cn.text + ")", cn.id, archiveId);
            Model.contentionForId(archiveId).collapce = true;
        }
        var archiveContention = Model.contentionForId(archiveId);
        Model.moveContentionToTop(archiveContention);
        return archiveContention;
    }
    static moveContentionToTop(cn) {
        var parentContention = cn.parentContention();
        var index = parentContention.childs.indexOf(cn.id);
        if (index > -1) {
            parentContention.childs.splice(index, 1);
        }
        cn.parentContention().childs.unshift(cn.id);
    }
}
//static contentionsList: Contention[] = [];
Model.contentionsMap = new Map();
class Contention {
    constructor() {
        this.childs = [];
        this.childTopics = [];
        this.width = 0;
        this.height = 0;
        this.depth = 0;
        this.color = "#FFF";
        this.collapce = false;
        this.topic = false;
        this.childs = [];
    }
    parentContention() {
        return Model.contentionsMap.get(this.parentContentionId);
    }
    parentTopic() {
        var parentContention = this.parentContention();
        while (parentContention && !parentContention.topic) {
            parentContention = parentContention.parentContention();
        }
        return parentContention;
    }
    recursiveAddChilds(list) {
        list.push(this);
        this.childs.forEach(function (childContentionId) {
            var childContention = Model.contentionForId(childContentionId);
            childContention.recursiveAddChilds(list);
        });
    }
    indexInParentContention() {
        if (!this.parentContentionId) {
            return -1;
        }
        return this.parentContention().childs.indexOf(this.id);
    }
    nextOrDefault() {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() + 1;
        if (index < parentContention.childs.length) {
            return Model.contentionForId(parentContention.childs[index]);
        }
        return;
    }
    previosOrDefault() {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() - 1;
        if (index >= 0) {
            return Model.contentionForId(parentContention.childs[index]);
        }
        return;
    }
}
class SerializedData {
}
//# sourceMappingURL=Model.js.map