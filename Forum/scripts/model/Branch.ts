class Branch {
    id: string;

    contentionsMap: Map<string, Contention> = new Map();
    childContentionMap: Map<string, string[]> = new Map();
    childTopicsMap: Map<string, string[]> = new Map();

    localCommands: Command[] = [];

    static async CreateBranch(branchInformation: BranchData, branchEncryptionKey: string): Promise<Branch> {
        var br: Branch = new Branch();

        br.id = branchInformation.id;
        //console.log(branchInformation);
        br.addRootTopic();
        br.parseDumpJson(branchInformation.dump, branchEncryptionKey);
        br.addRootTopic();
        await br.parseCommands(branchInformation.commands, branchEncryptionKey);
        br.addRootTopic();

        br.updateTopics();
        return br;
        //var data: SerializedData = <SerializedData>JSON.parse(jsonText);

    }

    async parseCommands(text: string, branchEncryptionKey: string) {
        try {
            if (stringIsEmty(text)) {
                return;
            }
            var commands = text.trim().split("\n");
            try
            {
                for (var i = 0; i < commands.length; i++)
                {
                    var text = commands[i];
                    //console.log(text);

                    if (text.length > 1) {
                        var json = await CryptoWarper.decrypt(branchEncryptionKey, JSON.parse(text) as EncryptionData);
                        //console.log(json);
                        var command = JSON.parse(json) as Command;
                        //console.log(command);
                        //this.localCommands.push(command);
                        this.executeCommand(command);
                    }
                }
            }
            catch (e) {
                console.log("parse Command error " + e);
            }

        }
        catch (e) {
            console.log("parseCommands error " + e);
        }

    }
    addRootTopic() {
        if (this.contentionsMap.has("root")) {
            this.contentionsMap.get("root").topic = true;
        }
        else {
            var cn = new Contention("root", true, this);
            cn.text = "root";
            cn.parentContentionId = "-1";
            cn.topic = true;
            this.contentionsMap.set(cn.id, cn);
        }

    }
    parseDumpJson(dumpJson: string, branchEncryptionKey: string)
    {
        //console.log("parseJson " + jsonText);
        try
        {
            if (dumpJson === null || dumpJson.length == 0) {
            }
            else
            {
                var objectsList = [];
                objectsList = <Contention[]>JSON.parse(dumpJson);

                // fill contentionsMap and contentionsList with real objects
                objectsList.forEach(function (obj) {
                    var cn = new Contention(obj.id, obj.topic, this);
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
                        this.childTopicsMap.set(cn.id, []);
                    }
                    //cn.childTopics = obj.childTopics;
                    this.contentionsMap.set(cn.id, cn);


                    var parentContentionChildsList = this.childContentionMap.get(cn.parentContentionId);
                    if (parentContentionChildsList) {
                        parentContentionChildsList.push(cn.id);
                    }

                });
            }
            //UpdateDataRequestController.getLastChangeTime(Network.getJsonUpdateTimeUrl(Controller.getTextAreaValue("loginTextArea").trim()));
        }
        catch (e) {
            console.log("parseDumpJson " + e);
        }
    }
    parseCommandsJson(commandsJson: string) {

    }

    // getters
    contentionForId(contentionId: string): Contention {
        return this.contentionsMap.get(contentionId);
    }

    rootContention(): Contention {
        return this.contentionsMap.get("root");
    }

    updateTopics() {
        this.childTopicsMap.forEach((subtopics: string[], id: string) => {
            //console.log(id);
            this.childTopicsMap.set(id, []);
        });
        this.childTopicsMap.forEach((subtopics: string[], id: string) => {
            //console.log(key, value);
            var topicContention = this.contentionForId(id);
            if (topicContention && topicContention.topic) {
                var parentTopic = topicContention.parentTopic();
                //console.log(topicContention);
                if (parentTopic) {
                    parentTopic.childTopics().push(id);
                }
            }
        });
    }
    removeContention(contentionId: string) {
        var cn = this.contentionForId(contentionId);
        var parentTopic = cn.parentTopic();
        var parentContention = cn.parentContention();

        var index: number = parentContention.childs().indexOf(contentionId)
        if (index > -1) {
            parentContention.childs().splice(index, 1);
        }
        cn.parentContentionId = "-1";
        this.contentionsMap.delete(contentionId);
        this.updateTopics();
    }

    moveContention(contentionId: string, targetId: string) {

        var contention = this.contentionForId(contentionId);
        this.removeContention(contentionId);
        this.contentionForId(targetId).childs().push(contentionId);


        this.contentionsMap.set(contentionId, contention);
        contention.parentContentionId = targetId;

        this.updateTopics();
    }

    collapseContention(contentionId: string, collapse: boolean) {
        var cn = this.contentionsMap.get(contentionId);
        cn.collapce = collapse;
    }

    // command tasks
    moveContentionToTop(contentionId: string) {
        var cn: Contention = this.contentionForId(contentionId);
        var parentContention = cn.parentContention();

        var index: number = parentContention.childs().indexOf(cn.id);
        if (index > -1) {
            parentContention.childs().splice(index, 1);
        }
        cn.parentContention().childs().unshift(cn.id);
    }


    changeContentionColor(contentionId: string, color: string) {
        this.contentionForId(contentionId).color = color;
    }

    createTopicFromContention(contentionId: string, topic: boolean) {
        var selectedcontention: Contention = this.contentionForId(contentionId);
        selectedcontention.topic = topic;
        this.childTopicsMap.set(selectedcontention.id, []);
        this.updateTopics();
    }

    addContention(contentionId: string, parentContentionId: string, text: string, url: string, linkId: string) {
        text = text.trim();
        if (text.length > 0 || url.length > 0) {
            var parentContention = this.contentionForId(parentContentionId);
            if (parentContention.linkId != undefined) {
                parentContentionId = parentContention.linkId;
            }
            //console.log("addContentionWithId " + id);
            var cn = new Contention(contentionId, false, this);
            cn.text = text;
            cn.parentContentionId = parentContentionId;
            cn.url = url;
            cn.linkId = linkId;
            this.contentionsMap.set(cn.id, cn);
            this.contentionForId(parentContentionId).childs().push(cn.id);
        }
    }

    switchContentionsOrder(contentionId: string, secondElementId: string, parentContentionId: string) {
        var parentContention = this.contentionForId(parentContentionId);
        var indexA = parentContention.childs().indexOf(contentionId);
        var indexB = parentContention.childs().indexOf(secondElementId);

        if (indexA > -1 && indexB > -1) {
            parentContention.childs()[indexA] = secondElementId;
            parentContention.childs()[indexB] = contentionId;
        }
    }

    recursiveUpdateParentTopic(contention: Contention, parentTopic: Contention) {
        if (contention.topic) {
            parentTopic.childTopics().push(contention.id);
        }
        else {
            contention.childs().forEach(function (childContentionId) {
                var childContention = this.contentionForId(childContentionId);
                this.recursiveUpdateParentTopic(childContention, parentTopic);
            });
        }
    }

    generateRandomId(): string {
        var id;
        do {
            id = Math.floor(Math.random() * 1000000).toString();
        } while (this.contentionsMap.has(id));

        return id;
    }

    archiveIdForContention(contentionId: string): string {

        var archiveId = "archive_" + contentionId;
        return archiveId;
    }
    executeCommand(command: Command)
    {
        try
        {
            Command.executeCommand(command, this);
        }
        catch (exception) {
            console.log("executeCommand exception " + exception);
        }
    }

    executeUICommand(command: Command) {
        this.localCommands.push(command);
        //var branch = Model.branchesMap.get(command.branchId);
        this.executeCommand(command);

    }

}