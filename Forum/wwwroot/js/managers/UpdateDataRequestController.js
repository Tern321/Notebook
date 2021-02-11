var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class UpdateDataRequestController {
    //notepadDataUpdateTime
    static saveCommandsToServer(branchId, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            //var updateBranchesData: UpdateBranchesJson = await UpdateBranchesJson.GenerateUpdateBranchesJson("userLogin", "userPassword", branchId, "branchPassword", "dumpVersion", "encryptionKey", commands);
            //var text = JSON.stringify(updateBranchesData);
            //var response = await Network.updateBranchesData(updateBranchesData);
            //console.log(response);
        });
    }
    static saveUpdatedData() {
        return __awaiter(this, void 0, void 0, function* () {
            var branchLinkJson = AccountManager.branchLink(BranchPageController.branch.id);
            var branchInfo = AccountManager.getBranchInformation(BranchPageController.branch.id);
            var updateBranchesData = yield UpdateBranchesJson.GenerateUpdateBranchesJson("userLogin", "userPassword", branchLinkJson.branchId, branchLinkJson.password, branchInfo.dumpVersion, branchLinkJson.encryptionKey, BranchPageController.branch.localCommands);
            var text = JSON.stringify(updateBranchesData);
            console.log(text);
            var response = yield Network.updateBranchesData(updateBranchesData);
            console.log(response);
            //var text = JSON.stringify(updateBranchesData);
            //console.log("saveUpdatedData");
            //const hashCode = s => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
            //var login = Controller.getTextAreaValue("loginTextArea").trim();
            //var hash = Math.abs(hashCode(login));
            //if (login.length > 0) {
            //    var list: Contention[] = [];
            //    Controller.selectedBranch().rootContention().recursiveAddChilds(list);
            //    var json = JSON.stringify(list);
            //    UpdateDataRequestController.saveJson(Network.uploadDataUrl(), json, Controller.getEncriptionKey());
            //}
        });
    }
    static postData(url, json, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //CryptoWarper.encrypt(password, json).then(function (encriptionData: EncryptionData) {
            //    var data: SerializedData = new SerializedData();
            //    data.encryptedData = encriptionData;
            //    var json = "";
            //    var contentType = "text/plain";
            //    if (Network.localhosted()) {
            //        json = JSON.stringify(data);
            //        contentType = "application/json";
            //    }
            //    else {
            //        var requestData: PostRequestData = new PostRequestData();
            //        requestData.appKey = "file";
            //        requestData.messageKey = "notepadData";
            //        requestData.login = Controller.getTextAreaValue("loginTextArea").trim();
            //        requestData.password = "afghknjaophfpeowhfpohawe";
            //        requestData.message = JSON.stringify(data);
            //        json = JSON.stringify(requestData);
            //    }
            //    return fetch(url, {
            //        method: 'POST',
            //        headers: { 'Content-Type': contentType }, // this line is important, if this content-type is not set it wont work
            //        body: json
            //    }).then(function (body) { return body.text(); }).then(function (data) {
            //        //console.log(data);
            //        if (data == "ok") {
            //            //console.log("data saved");
            //        }
            //        else {
            //            alert("страница потеряла актуальность, перезагрузите чтобы вносить изменения");
            //        }
            //    }).catch(function (body) {
            //        UpdateDataRequestController.updateDataRequestLock = false;
            //        alert("Failed to update data");
            //    });
            //})
        });
    }
    static saveJson(url, json, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //CryptoWarper.encrypt(password, json).then(function (encriptionData: EncryptionData) {
            //    var data: SerializedData = new SerializedData();
            //    data.encryptedData = encriptionData;
            //    var json = "";
            //    var contentType = "text/plain";
            //    if (Network.localhosted()) {
            //        json = JSON.stringify(data);
            //        contentType = "application/json";
            //    }
            //    else {
            //        var requestData: PostRequestData = new PostRequestData();
            //        requestData.appKey = "file";
            //        requestData.messageKey = "notepadData";
            //        requestData.login = Controller.getTextAreaValue("loginTextArea").trim();
            //        requestData.password = "afghknjaophfpeowhfpohawe";
            //        requestData.message = JSON.stringify(data);
            //        json = JSON.stringify(requestData);
            //    }
            //    return fetch(url, {
            //        method: 'POST',
            //        headers: { 'Content-Type': contentType }, // this line is important, if this content-type is not set it wont work
            //        body: json
            //    }).then(function (body) { return body.text(); }).then(function (data) {
            //        //console.log(data);
            //        if (data == "ok") {
            //            //console.log("data saved");
            //        }
            //        else {
            //            alert("страница потеряла актуальность, перезагрузите чтобы вносить изменения");
            //        }
            //    }).catch(function (body) {
            //        UpdateDataRequestController.updateDataRequestLock = false;
            //        alert("Failed to update data");
            //    });
            //})
        });
    }
}
UpdateDataRequestController.updateDataRequestLock = false;
UpdateDataRequestController.shouldSendUpdateDataRequest = false;
UpdateDataRequestController.lastChangeTime = "0";
//# sourceMappingURL=UpdateDataRequestController.js.map