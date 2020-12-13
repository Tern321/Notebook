class Model {
    static contentionsMap: Map<string, Contention> = new Map();

    static childContentionMap: Map<string, string[]> = new Map();
    static childTopicsMap: Map<string, string[]> = new Map();

    // getters
    static contentionForId(contentionId: string): Contention {
        return Model.contentionsMap.get(contentionId);
    }

    static rootContention(): Contention {
        return Model.contentionsMap.get("root");
    }

    // logic
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
                cn.linkId = obj.linkId;
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

    static generateRandomId(): string {
        var id;
        do {
            id = Math.floor(Math.random() * 1000000).toString();
        } while (Model.contentionsMap.has(id));

        return id;
    }

    

    static archiveIdForContention(contentionId: string): string {

        var archiveId = "archive_" + contentionId;
        return archiveId;
    }
   


    static executeCommand(command: Command) {
        switch (command.task) {
            case 'moveContentionToTop':
                Model.moveContentionToTop(command.contentionId);
                break;
            case 'removeContention':
                Model.removeContention(command.contentionId);
                break;
            case 'moveContention':
                Model.moveContention(command.contentionId, command.targetId);
                break;
            case 'collapseContention':
                Model.collapseContention(command.contentionId, command.collapse);
                break;
            case 'changeContentionColor':
                Model.changeContentionColor(command.contentionId, command.color);
                break;
            case 'createTopicFromContention':
                Model.createTopicFromContention(command.contentionId, command.topic);
                break;
            case 'addContention':
                Model.addContention(command.contentionId, command.parentContentionId, command.text, command.url, command.linkId);
                break;
            case 'switchContentionsOrder':
                Model.switchContentionsOrder(command.contentionId, command.secondElementId, command.parentContentionId);
                break;
            default:
                console.log("executeCommand error, command not found");
        }
    }
    // command tasks
    static moveContentionToTop(contentionId: string) {
        var cn: Contention = Model.contentionForId(contentionId);
        var parentContention = cn.parentContention();

        var index: number = parentContention.childs().indexOf(cn.id);
        if (index > -1) {
            parentContention.childs().splice(index, 1);
        }
        cn.parentContention().childs().unshift(cn.id);
    }

    static removeContention(contentionId: string) {
        var cn = Model.contentionForId(contentionId);
        var parentTopic = cn.parentTopic();
        var parentContention = cn.parentContention();

        var index: number = parentContention.childs().indexOf(contentionId)
        if (index > -1) {
            parentContention.childs().splice(index, 1);
        }
        cn.parentContentionId = "-1";
        Model.contentionsMap.delete(contentionId);
        Model.updateTopics();
    }

    static moveContention(contentionId: string, targetId: string) {
        
        Model.removeContention(contentionId);
        Model.contentionForId(targetId).childs().push(contentionId);

        var contention = Model.contentionForId(contentionId);
        Model.contentionsMap.set(contentionId, contention);
        contention.parentContentionId = targetId;

        Model.updateTopics();
    }

    static collapseContention(contentionId: string, collapse: boolean) {
        var cn = Model.contentionsMap.get(contentionId);
        cn.collapce = collapse;
    }

    static changeContentionColor(contentionId: string, color: string) {
        Model.contentionForId(contentionId).color = color;
    }

    static createTopicFromContention(contentionId: string, topic: boolean) {
        var selectedcontention: Contention = Model.contentionForId(contentionId);
        selectedcontention.topic = topic;
        Model.childTopicsMap.set(selectedcontention.id, []);
        Model.updateTopics();
    }

    static addContention(contentionId: string, parentContentionId: string, text: string, url: string, linkId: string) {
        text = text.trim();
        if (text.length > 0 || url.length > 0) {
            var parentContention = Model.contentionForId(parentContentionId);
            if (parentContention.linkId != undefined) {
                parentContentionId = parentContention.linkId;
            }
            //console.log("addContentionWithId " + id);
            var cn = new Contention(contentionId, false);
            cn.text = text;
            cn.parentContentionId = parentContentionId;
            cn.url = url;
            cn.linkId = linkId;
            Model.contentionsMap.set(cn.id, cn);
            Model.contentionForId(parentContentionId).childs().push(cn.id);
        }
    }

    static switchContentionsOrder(contentionId: string, secondElementId: string, parentContentionId: string) {
        var parentContention = Model.contentionForId(parentContentionId);
        var indexA = parentContention.childs().indexOf(contentionId);
        var indexB = parentContention.childs().indexOf(secondElementId);

        if (indexA > -1 && indexB > -1) {
            parentContention.childs()[indexA] = secondElementId;
            parentContention.childs()[indexB] = contentionId;
        }
    }
}

class SerializedData {
    version: number;
    json: string;
    encriptedData: EncriptionData;
}