class UIDrawer {

    static topicsWidth = 200;
    static widthMap: Map<string, number>;

    static addCleanObjects(parentElement: Element, contention: Contention, depth: number, x: number, y: number, drawAll: boolean) {
        parentElement?.appendChild(UIDrawer.contentionHtml(contention, x, y));

        x += UIDrawer.widthForDepth(depth);

        if (!contention.collapce || Controller.topicId == contention.id || drawAll) { 
        contention.childs.forEach(function (childContentionId) {
            var childContention = Model.contentionForId(childContentionId);
            UIDrawer.addCleanObjects(parentElement, childContention, depth + 1, x, y, drawAll)
            y += childContention.height;
        });
        }
    }
    static calculateSize(contention: Contention, depth: number, drawAll: boolean)
    {
        contention.depth = depth;

        var savedWidth: number = this.widthMap.get(depth.toString());
        if (!savedWidth || savedWidth < contention.width) {
            this.widthMap.set(depth.toString(), contention.width);
        }

        // если нет листьев, если высота больше чем у листьев
        var childsHeight = 0;
        if (!contention.collapce || Controller.topicId == contention.id || drawAll) {
            contention.childs.forEach(function (childContentionId) {
                var childContention = Model.contentionForId(childContentionId);
                childsHeight += UIDrawer.calculateSize(childContention, depth + 1, drawAll);
            });

            if (childsHeight > contention.height) {
                contention.height = childsHeight;
            }
        }
        return contention.height;
    }

    static widthForDepth(depth: number): number {
        return this.widthMap.get(depth.toString()) + 4;
    }
    static topicIndex = 0;
    static drawTopics(topicContention: Contention, depth: number) {
        
        UIDrawer.topicIndex++;
        var d1 = document.getElementById("topics");
        const element = document.createElement("div");
        element.innerHTML = UIDrawer.topicButtonHtml(topicContention, UIDrawer.topicIndex, depth);
        d1.appendChild(element);
        topicContention.childTopics.forEach(function (childTopicId) {
            var childTopic = Model.contentionForId(childTopicId);
            UIDrawer.drawTopics(childTopic, depth + 1);
        });
    }

    static topicButtonHtml(contention: Contention, index: number, depth: number): string {
        var offset = depth * 10;
        var width = UIDrawer.topicsWidth - offset;
        return "<button style=\"text-align: left; position: fixed; left: " + offset + "px; top: " + index * 20 + "px; width: " + width + "px; height: 20px; \" onclick = \"Controller.moveToTopic('"+contention.id+"')\" >" + contention.text + "</button>"
    }

    static drawUI(drawAll: boolean) {
        var scrollX = window.scrollX;
        var scrollY = window.scrollY;
        
        

        Controller.changeSelectedContention = false;
        var starX = UIDrawer.topicsWidth;
        var startY = 74;
        //Model.updateChilds(false);
        var topicsDiv = document.getElementById("topics");
        topicsDiv.innerHTML = "";
        UIDrawer.topicIndex = 0;
        UIDrawer.drawTopics(Model.contentionsMap.get("root"), 0);
        // add raw elements for size calculation

        const contentionsDiv = document.getElementById("contentions");
        contentionsDiv.innerHTML = "";

        Model.contentionsMap.forEach((contention: Contention, id: string) => {
            contentionsDiv?.appendChild(UIDrawer.contentionHtmlRaw(contention));
        });

        // remove raw objects and save size
        Model.contentionsMap.forEach((contention: Contention, id: string) => {
            //console.log(contention);
            var element = document.getElementById(contention.id);
            contention.width = element.offsetWidth;
            contention.height = element.offsetHeight;
            //console.log("measured height for contention " + contention.text + " " + contention.height);
            element.remove();
            //element.parentElement.remove(); // deletes topics oO
        });

        // calculate height
        var rootKey: string = Controller.topicId;
        //console.log("calculateHeight");
        UIDrawer.widthMap = new Map();
        UIDrawer.calculateSize(Model.contentionsMap.get(rootKey), 0, drawAll);
        // add clean objects
        contentionsDiv.innerHTML = "";
        this.addCleanObjects(contentionsDiv, Model.contentionsMap.get(rootKey), 0, starX, startY, drawAll);

        UIDrawer.selectElement(document.getElementById(Controller.selectedContentionId));

        window.scrollBy(scrollX, scrollY);
    }

    static selectElement(element: HTMLElement) {
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
    static deselectElement(element: HTMLElement) {
        if (element) {
            element.style.borderColor = "black";
            element.style.borderWidth = "1px";
        }
    }

    static contentionHtmlRaw(contention: Contention) {
        const element = document.createElement("div");

        var textString = "<div class='verticalCenter' id=" + contention.id + "  style=\"border: 3px solid #000000;min-width: 100px; max-width: 320px; display: inline-block\" >" +contention.text + "</div>";
        
        element.innerHTML = "<div class='verticalContainer'>" + textString + "</div>";
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
        var positionString: string = "position: absolute; top: " + y + "px; left: " + x + "px; width: " + (UIDrawer.widthForDepth(contention.depth) + 1) + "px; height: " + (contention.height + 1) + "px; min-width: 100px; max-width: 321px; ";
        //console.log("final heoght for contention " + contention.text + " " + contention.height);
        var sizeString: string = "width: " + (UIDrawer.widthForDepth(contention.depth) + 1) + "px; height: " + (contention.height + 1) + "px; min-width: 100px; max-width: 325px; ";

        //var textString = "<div selectable=true childDiv=true id=" + contention.id + " class=\"verticalCenter\">" + contention.text + "</div>";
        var textString = "<div class='verticalCenter' selectable='true' container='true' >" + contention.text + "</div>";
        
        element.innerHTML = "<div selectable=true id=" + contention.id + " style=\"" + positionString + sizeString + " background:" + color + "; border: 1px solid #000000; display: inline-block;\" >" + textString + "</div>";
        return element;
    }

    static switchElements(elementA: HTMLElement, elementB: HTMLElement)
    {
        elementA.style.top = elementB.style.top;
        var top = +elementA.style.top.replace("px", "") + +elementA.style.height.replace("px", "") + "px";
        elementB.style.top = top;
    }
}