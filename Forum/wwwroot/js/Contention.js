class Contention {
    constructor(id, topic) {
        this.color = "#FFF";
        this.collapce = false;
        this.topic = false;
        this.id = id;
        Model.childContentionMap.set(this.id, []);
        if (topic) {
            Model.childTopicsMap.set(this.id, []);
        }
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
        if (this.linkId == undefined) {
            this.childs().forEach(function (childContentionId) {
                var childContention = Model.contentionForId(childContentionId);
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
            return Model.childContentionMap.get(this.id);
        }
        else {
            return Model.childContentionMap.get(this.linkId);
        }
    }
    childTopics() {
        return Model.childTopicsMap.get(this.id);
    }
    indexInParentContention() {
        var parentContention = this.parentContention();
        if (!parentContention) {
            return -1;
        }
        return parentContention.childs().indexOf(this.id);
    }
    nextOrDefault() {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() + 1;
        if (index < parentContention.childs().length) {
            return Model.contentionForId(parentContention.childs()[index]);
        }
        return;
    }
    previosOrDefault() {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() - 1;
        if (index >= 0) {
            return Model.contentionForId(parentContention.childs()[index]);
        }
        return;
    }
}
//# sourceMappingURL=Contention.js.map