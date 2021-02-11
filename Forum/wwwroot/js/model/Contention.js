class Contention {
    constructor(id, topic, branch) {
        this.color = "#FFF";
        this.collapce = false;
        this.topic = false;
        this.id = id;
        this.branch = branch;
        branch.childContentionMap.set(this.id, []);
        if (topic) {
            this.branch.childTopicsMap.set(this.id, []);
        }
    }
    parentContention() {
        return this.branch.contentionsMap.get(this.parentContentionId);
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
        if (this.linkId == undefined) {
            this.childs().forEach(function (childContentionId) {
                var childContention = this.branch().contentionForId(childContentionId);
                childContention.recursiveAddChilds(list);
            });
        }
    }
    updateText(text) {
        this.text = text;
        this.width = undefined;
    }
    childs() {
        if (this.linkId == undefined) {
            return this.branch.childContentionMap.get(this.id);
        }
        else {
            return this.branch.childContentionMap.get(this.linkId);
        }
    }
    childTopics() {
        return this.branch.childTopicsMap.get(this.id);
    }
    //branch(): Branch {
    //    return Model.branchesMap.get(this.branchId);
    //}
    indexInParentContention() {
        var parentContention = this.parentContention();
        //console.log("indexInParentContention");
        //console.log("contention");
        //console.log(this);
        //console.log("parent");
        //console.log(parentContention);
        //console.log("search for " + this.id);
        //console.log("childs " + parentContention.childs());
        if (!parentContention) {
            return -1;
        }
        return parentContention.childs().indexOf(this.id);
    }
    nextOrDefault() {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() + 1;
        if (index < parentContention.childs().length) {
            return this.branch.contentionForId(parentContention.childs()[index]);
        }
        return;
    }
    previosOrDefault() {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() - 1;
        if (index >= 0) {
            return this.branch.contentionForId(parentContention.childs()[index]);
        }
        return;
    }
}
//# sourceMappingURL=Contention.js.map