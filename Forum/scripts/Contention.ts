class Contention {
    id: string;
    text: string;
    url: string;
    parentContentionId: string;

    width: number; // this property determines if contention size is counted
    height: number;

    color: string = "#FFF";
    collapce: boolean = false;
    topic: boolean = false;

    linkId: string;

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
        if (this.linkId == undefined) {
            this.childs().forEach(function (childContentionId) {
                var childContention = Model.contentionForId(childContentionId);
                childContention.recursiveAddChilds(list);
            });
        }
    }
    updateText(text: string) {
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

    indexInParentContention(): number {

        var parentContention = this.parentContention();

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
