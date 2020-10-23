var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function myfunction(id) {
    alert("myfunction");
    console.log("myfunction " + id);
    Controller.selectedContentionId = id;
}
class Controller {
    static createTopicFromContention() {
        var selectedcontention = Controller.selectedcontention();
        selectedcontention.topic = true;
        Model.updateTopicsFor(selectedcontention.parentTopic());
        Controller.topicId = selectedcontention.id;
        Controller.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static changeContention() {
        var selectedcontention = Controller.selectedcontention();
        var textArea = document.getElementById("argumentTextArea");
        selectedcontention.text = textArea.value;
        textArea.value = "";
        Controller.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static copyContentionText() {
        var selectedcontention = Controller.selectedcontention();
        var textArea = document.getElementById("argumentTextArea");
        textArea.value = selectedcontention.text;
    }
    static saveUpdatedData() {
        var json = JSON.stringify([...Model.contentionsMap]);
        //console.log(json);
        // sand request on server
    }
    static selectedcontention() {
        return Model.contentionsMap.get(Controller.selectedContentionId);
    }
    static changeContentionColor(color) {
        var selectedcontention = Controller.selectedcontention();
        selectedcontention.color = color;
        Controller.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static deleteContention() {
        Model.removeContention(Controller.selectedContentionId);
        Controller.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static moveContention(e) {
        Model.moveContention(Controller.selectedcontention().id, e.target.getAttribute("id"));
        Controller.selectedcontention().parentContentionId = e.target.getAttribute("id");
        Controller.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static addContention() {
        var textArea = document.getElementById("argumentTextArea");
        Model.addContention(textArea.value, Controller.selectedContentionId);
        textArea.value = "";
        textArea.focus();
        Controller.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static selectContention(e) {
        var contentionId = e.target.getAttribute("id");
        UIDrawer.deselectElement(document.getElementById(this.selectedContentionId));
        UIDrawer.selectElement(e.target);
        this.selectedContentionId = contentionId;
    }
    static collapceSelectedContention() {
        var cn = Controller.selectedcontention();
        cn.collapce = !cn.collapce;
        Controller.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static collapceContention(e) {
        var contentionId = e.target.getAttribute("id");
        var cn = Model.contentionsMap.get(contentionId);
        cn.collapce = !cn.collapce;
        Controller.saveUpdatedData();
        UIDrawer.drawUI();
    }
    static loadJson(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url).then(function (body) { return body.text(); }).then(function (data) {
                Model.parseJson(data);
                Controller.topicId = "root";
                UIDrawer.drawUI();
            });
        });
    }
    static saveJson(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url).then(function (body) { return body.text(); }).then(function (data) {
                Model.parseJson(data);
                Controller.topicId = "root";
                UIDrawer.drawUI();
            });
        });
    }
    static moveToTopic(topicId) {
        Controller.topicId = topicId;
        UIDrawer.drawUI();
    }
}
Controller.topicId = "root";
window.onload = () => {
    console.log("on load");
    enableInput();
    var url = "https://localhost:44380/Home/json";
    var text = Controller.loadJson(url);
};
//# sourceMappingURL=app.js.map