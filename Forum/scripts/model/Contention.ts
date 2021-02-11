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
    branch: Branch;

    constructor(id: string, topic: boolean, branch: Branch) {
        this.id = id;
        this.branch = branch;
        branch.childContentionMap.set(this.id, []);
        if (topic) {
            this.branch.childTopicsMap.set(this.id, []);
        }
    }

    parentContention(): Contention {
        return this.branch.contentionsMap.get(this.parentContentionId)
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
                var childContention = this.branch().contentionForId(childContentionId);
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

    indexInParentContention(): number {

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
    nextOrDefault(): Contention {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() + 1;
        if (index < parentContention.childs().length) {
            return this.branch.contentionForId(parentContention.childs()[index]);
        }
        return;
    }

    previosOrDefault(): Contention {
        var parentContention = this.parentContention();
        var index = this.indexInParentContention() - 1;
        if (index >= 0) {
            return this.branch.contentionForId(parentContention.childs()[index]);
        }
        return;
    }

    

}
