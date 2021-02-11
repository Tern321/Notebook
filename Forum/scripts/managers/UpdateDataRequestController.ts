class UpdateDataRequestController {

    static updateDataRequestLock: boolean = false;
    static shouldSendUpdateDataRequest = false;
    static lastChangeTime: string = "0";
    //notepadDataUpdateTime



    static async saveCommandsToServer(branchId: string, commands: string[])
    {
        //var updateBranchesData: UpdateBranchesJson = await UpdateBranchesJson.GenerateUpdateBranchesJson("userLogin", "userPassword", branchId, "branchPassword", "dumpVersion", "encryptionKey", commands);

        //var text = JSON.stringify(updateBranchesData);

        //var response = await Network.updateBranchesData(updateBranchesData);
        //console.log(response);
    }
    static async saveUpdatedData() {

        var branchLinkJson = AccountManager.branchLink(BranchPageController.branch.id);
        var branchInfo = AccountManager.getBranchInformation(BranchPageController.branch.id)
        var updateBranchesData: UpdateBranchesJson = await UpdateBranchesJson.GenerateUpdateBranchesJson("userLogin", "userPassword", branchLinkJson.branchId, branchLinkJson.password, branchInfo.dumpVersion, branchLinkJson.encryptionKey, BranchPageController.branch.localCommands);

        var text = JSON.stringify(updateBranchesData);
        console.log(text);
        var response = await Network.updateBranchesData(updateBranchesData);
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
    }

    static async postData(url: string, json: string, password: string) {
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
    }

    static async saveJson(url: string, json: string, password: string) {
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
    }

}