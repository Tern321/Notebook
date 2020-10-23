class UIDrawer {
    static addCleanObjects(parentElement, contention, depth, x, y, drawAll) {
        //console.log("addCleanObjects");
        //console.log(contention);
        parentElement.appendChild(UIDrawer.contentionHtml(contention, x, y));
        x += UIDrawer.widthForDepth(depth);
        if (!contention.collapce || Controller.topicId == contention.id || drawAll) {
            contention.childs().forEach(function (childContentionId) {
                var childContention = Model.contentionForId(childContentionId);
                UIDrawer.addCleanObjects(parentElement, childContention, depth + 1, x, y, drawAll);
                y += UIDrawer.heightMap.get(childContention.id);
            });
        }
    }
    static calculateSize(contention, depth, drawAll) {
        this.depthMap.set(contention.id, depth);
        // width
        var savedWidth = this.widthMap.get(depth.toString());
        if (!savedWidth || savedWidth < contention.width) {
            this.widthMap.set(depth.toString(), contention.width);
        }
        // height
        // если нет листьев, если высота больше чем у листьев
        var height = contention.height;
        var childsHeight = 0;
        if (!contention.collapce || Controller.topicId == contention.id || drawAll) {
            contention.childs().forEach(function (childContentionId) {
                var childContention = Model.contentionForId(childContentionId);
                childsHeight += UIDrawer.calculateSize(childContention, depth + 1, drawAll);
            });
            if (childsHeight > height) {
                height = childsHeight;
            }
        }
        this.heightMap.set(contention.id, height);
        return height;
    }
    static widthForDepth(depth) {
        return this.widthMap.get(depth.toString()) + 4;
    }
    static drawTopics(topicContention, depth) {
        UIDrawer.topicIndex++;
        var d1 = document.getElementById("topics");
        const element = document.createElement("div");
        element.innerHTML = UIDrawer.topicButtonHtml(topicContention, UIDrawer.topicIndex, depth);
        d1.appendChild(element);
        topicContention.childTopics().forEach(function (childTopicId) {
            var childTopic = Model.contentionForId(childTopicId);
            UIDrawer.drawTopics(childTopic, depth + 1);
        });
    }
    static topicButtonHtml(contention, index, depth) {
        var offset = depth * 10;
        var width = UIDrawer.topicsWidth - offset;
        return "<button style=\"text-align: left; position: fixed; left: " + offset + "px; top: " + index * 20 + "px; width: " + width + "px; height: 20px; \" onclick = \"Controller.moveToTopic('" + contention.id + "')\" >" + contention.text + "</button>";
    }
    static drawUI(drawAll) {
        var scrollX = window.scrollX;
        var scrollY = window.scrollY;
        var rootKey = Controller.topicId;
        Controller.changeSelectedContention = false;
        var starX = UIDrawer.topicsWidth;
        var startY = 74;
        var topicsDiv = document.getElementById("topics");
        topicsDiv.innerHTML = "";
        UIDrawer.topicIndex = 0;
        UIDrawer.drawTopics(Model.contentionsMap.get("root"), 0);
        // add raw elements for size calculation
        const contentionsDiv = document.getElementById("contentions");
        contentionsDiv.innerHTML = "";
        var rawElementIdList = [];
        this.recursiveAddRawToDom(Model.contentionForId(rootKey), contentionsDiv, rawElementIdList);
        // remove raw objects and save size
        rawElementIdList.forEach(function (contentionId) {
            //console.log("calcuate size for " + contentionId);
            var contention = Model.contentionForId(contentionId);
            var element = document.getElementById(contentionId);
            if (element) {
                contention.width = element.offsetWidth;
                contention.height = element.offsetHeight;
            }
        });
        UIDrawer.widthMap = new Map();
        UIDrawer.heightMap = new Map();
        UIDrawer.depthMap = new Map();
        UIDrawer.calculateSize(Model.contentionsMap.get(rootKey), 0, drawAll);
        // add clean objects
        contentionsDiv.innerHTML = "";
        this.addCleanObjects(contentionsDiv, Model.contentionsMap.get(rootKey), 0, starX, startY, drawAll);
        UIDrawer.selectElement(document.getElementById(Controller.selectedContentionId));
        window.scrollBy(scrollX, scrollY);
    }
    static recursiveAddRawToDom(contention, contentionsDiv, rawElementIdList) {
        if (!contention.width || contention.width == 0) {
            rawElementIdList.push(contention.id);
            console.log("rawElementIdList " + contention.id);
            var element = UIDrawer.contentionHtmlRaw(contention);
            contentionsDiv.appendChild(element);
        }
        contention.childs().forEach(function (childContentionId) {
            var childContention = Model.contentionForId(childContentionId);
            UIDrawer.recursiveAddRawToDom(childContention, contentionsDiv, rawElementIdList);
        });
    }
    static selectElement(element) {
        if (element) {
            if (Controller.changeSelectedContention) {
                element.style.borderColor = "blue";
            }
            else {
                element.style.borderColor = "red";
            }
            element.style.borderWidth = "3px";
        }
    }
    static deselectElement(element) {
        if (element) {
            element.style.borderColor = "black";
            element.style.borderWidth = "1px";
        }
    }
    static contentionHtmlRaw(contention) {
        const element = document.createElement("div");
        var textString = "<div class='verticalCenter' id=" + contention.id + "  style=\"border: 3px solid #000000;min-width: 100px; max-width: 320px; display: inline-block\" >" + contention.text + "</div>";
        element.innerHTML = "<div class='verticalContainer'>" + textString + "</div>";
        return element;
    }
    static contentionHtml(contention, x, y) {
        const element = document.createElement("div");
        var color = contention.color;
        if (contention.topic) {
            color = "#e6e6e6";
        }
        if (contention.collapce) {
            color = "#9b9bff";
        }
        var depth = UIDrawer.depthMap.get(contention.id);
        var height = UIDrawer.heightMap.get(contention.id);
        var positionString = "position: absolute; top: " + y + "px; left: " + x + "px; width: " + (UIDrawer.widthForDepth(depth) + 1) + "px; height: " + (height + 1) + "px; min-width: 100px; max-width: 321px; ";
        //console.log("final heoght for contention " + contention.text + " " + contention.height);
        var sizeString = "width: " + (UIDrawer.widthForDepth(depth) + 1) + "px; height: " + (height + 1) + "px; min-width: 100px; max-width: 325px; ";
        //var textString = "<div selectable=true childDiv=true id=" + contention.id + " class=\"verticalCenter\">" + contention.text + "</div>";
        var textString = "<div class='verticalCenter' selectable='true' container='true' >" + contention.text + "</div>";
        element.innerHTML = "<div selectable=true id=" + contention.id + " style=\"" + positionString + sizeString + " background:" + color + "; border: 1px solid #000000; display: inline-block;\" >" + textString + "</div>";
        return element;
    }
    static switchElements(elementA, elementB) {
        elementA.style.top = elementB.style.top;
        var top = +elementA.style.top.replace("px", "") + +elementA.style.height.replace("px", "") + "px";
        elementB.style.top = top;
    }
}
UIDrawer.topicsWidth = 200;
UIDrawer.topicIndex = 0;
//# sourceMappingURL=UIDrawer.js.map