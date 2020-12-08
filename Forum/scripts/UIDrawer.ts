class UIDrawer {

    static topicsWidth = 200;
    static widthMap: Map<string, number>;
    static heightMap: Map<string, number>;
    static depthMap: Map<string, number>;
    static addCleanObjects(parentElement: Element, contention: Contention, depth: number, x: number, y: number, drawAll: boolean)
    {
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

    static calculateSize(contention: Contention, depth: number, drawAll: boolean)
    {
        this.depthMap.set(contention.id, depth);

        // width
        var savedWidth: number = this.widthMap.get(depth.toString());
        if (!savedWidth || savedWidth < contention.width) {
            this.widthMap.set(depth.toString(), contention.width);
        }

        // height
        // если нет листьев, если высота больше чем у листьев
        var height = contention.height -3;
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

    static widthForDepth(depth: number): number {
        return this.widthMap.get(depth.toString());
    }

    static topicIndex = 0;
    static drawTopics(topicContention: Contention, depth: number)
    {
        var d1 = document.getElementById("topics");
        const element = document.createElement("div");
        element.innerHTML = UIDrawer.topicButtonHtml(topicContention, UIDrawer.topicIndex, depth);
        UIDrawer.topicIndex++;
        d1.appendChild(element);
        topicContention.childTopics().forEach(function (childTopicId) {
            var childTopic = Model.contentionForId(childTopicId);
            UIDrawer.drawTopics(childTopic, depth + 1);
        });
    }

    static topicButtonHtml(contention: Contention, index: number, depth: number): string {
        var offset = depth * 10;
        var width = UIDrawer.topicsWidth - offset;
        //style =\"" + positionString + sizeString + " background:" + color +
        if (contention.id == Controller.topicId) {
            return "<button class='topicButton' style=\"background-color: #AAA; left: " + offset + "px; top: " + index * 19 + "px; width: " + width + "px; height: 20px; \" onclick = \"Controller.moveToTopic(event, '" + contention.id + "')\" >" + contention.text + "</button>"
        }
        else {
            var backgroundColor = contention.color;
            if (backgroundColor == undefined) {
                backgroundColor = "#FFF";
            }
            return "<button class='topicButton' style=\"background-color: " + backgroundColor+";left: " + offset + "px; top: " + index * 19 + "px; width: " + width + "px; height: 20px; \" onclick = \"Controller.moveToTopic(event, '" + contention.id + "')\" >" + contention.text + "</button>"
        }
   }
    //static drawUI(drawAll: boolean) {
    static drawUI() {
        var drawAll = Controller.showAllEnabled;
        if (!Model.contentionsMap.has(Controller.topicId))
        {
            Controller.topicId = "root";
        }
        
        var scrollX = window.pageXOffset;
        var scrollY = window.pageYOffset;

        var rootKey: string = Controller.topicId;
        

        Controller.changeSelectedContention = false;
        var starX = UIDrawer.topicsWidth;
        var startY = 74;

        var topicsDiv = document.getElementById("topics");
        topicsDiv.innerHTML = "";
        //
        const element = document.createElement("div");
        element.innerHTML = '<div class="topicsBackground" style = "width:' + UIDrawer.topicsWidth+'px;" />'
        UIDrawer.topicIndex++;
        topicsDiv.appendChild(element);

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
                //console.log("calculate size for element " + contention.id + " width " + contention.width + " height " + contention.height);
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

        window.scrollTo(scrollX, scrollY);

    }

    static recursiveAddRawToDom(contention: Contention, contentionsDiv, rawElementIdList: string[]) {
        if (!contention.width || contention.width == 0) {
            rawElementIdList.push(contention.id);
            var element = UIDrawer.contentionHtmlRaw(contention);
            contentionsDiv.appendChild(element);
        }

        contention.childs().forEach(function (childContentionId) {
            var childContention = Model.contentionForId(childContentionId);
            UIDrawer.recursiveAddRawToDom(childContention, contentionsDiv, rawElementIdList);
        });
    }
    static selectElementBase(element: HTMLElement, select: boolean, colorTrue: string, colorFalse: string) {
        if (element)
        {
            if (select)
            {
                element.style.borderColor = colorTrue;
                element.style.paddingRight = "0px";
                element.style.paddingLeft = "0px";

                element.style.borderWidth = "3px";
            }
            else {
                element.style.borderColor = colorFalse;

                element.style.paddingLeft = "2px";
                element.style.paddingRight = "2px";

                element.style.borderWidth = "1px";
            }
        }
    }

    static selectElement(element: HTMLElement) {
        var colorTrue = Controller.changeSelectedContention ? "blue" : "red";
        UIDrawer.selectElementBase(element, true, colorTrue, "black");
    }
    static deselectElement(element: HTMLElement)
    {
        var colorTrue = Controller.changeSelectedContention ? "blue" : "red";
        UIDrawer.selectElementBase(element, false, colorTrue, "black");
    }

    static contentionDataToText(contention: Contention): String {
        if (contention.url == undefined) {
            return contention.text;
        }
        else {
            var linkName = contention.url;
            if (linkName.length > 38) {
                linkName = linkName.substring(0, 38) + " ...";
            }
            var str = '<a href="' + contention.url + '" target = "_blank" >' + linkName + "</a><br>" + contention.text;
            return str;
        }
    }
    static contentionHtmlRaw(contention: Contention): HTMLElement
    {
        const element = document.createElement("div");
        var textString = "<div class='verticalCenter rawContentionElement'  >" + UIDrawer.contentionDataToText(contention) + "</div>";
        element.innerHTML = "<div class='contentionElement rawContentionElement'  id=" + contention.id + ">" + textString + "</div>";
        return element;
    }

    static contentionHtml(contention: Contention, x: number, y: number) {
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

        var positionString: string = " top:" + y + "px; left:" + x + "px;";
        var sizeString: string = "width: " + (UIDrawer.widthForDepth(depth) + 1) + "px; height: " + (height + 1) + "px;";
        var textString = "<div class='verticalCenter' selectable='true' container='true' >" + UIDrawer.contentionDataToText(contention) + "</div>";
        
        element.innerHTML = "<div class='contentionElement' selectable=true id=" + contention.id + " style=\"" + positionString + sizeString + " background:" + color + "; \" >" + textString + "</div>";
        return element;
    }

    static switchElements(elementA: HTMLElement, elementB: HTMLElement)
    {
        elementA.style.top = elementB.style.top;
        var top = +elementA.style.top.replace("px", "") + +elementA.style.height.replace("px", "") + "px";
        elementB.style.top = top;
    }
}