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
    static getLastChangeTime(url) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("getLastChangeTime");
            Network.sendRequest(url)
                .then(responseString => {
                UpdateDataRequestController.lastChangeTime = responseString;
                //console.log("got last update time from server " + UpdateDataRequestController.lastChangeTime);
            })
                .catch(function (body) {
                UpdateDataRequestController.updateDataRequestLock = false;
                UpdateDataRequestController.lastChangeTime = "-1";
                console.log("get last update time from server error");
            });
        });
    }
    static setLastChangeTime(url, time, login) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("setLastChangeTime");
            var requestData = new PostRequestData();
            requestData.appKey = "file";
            requestData.messageKey = "notepadData";
            requestData.login = login;
            requestData.password = "afghknjaophfpeowhfpohawe";
            requestData.message = time + "";
            var json = JSON.stringify(requestData);
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: json
            }).then(function (body) { return body.text(); }).then(function (data) {
                console.log(data);
            }).catch(function (body) {
                UpdateDataRequestController.updateDataRequestLock = false;
                console.log("setLastChangeTime request error");
            });
        });
    }
    static lockCheckChangeTimeAndSaveUpdatedData() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("lockCheckChangeTimeAndSaveUpdatedData updateDataRequestLock " + UpdateDataRequestController.updateDataRequestLock +"  shouldSendUpdateDataRequest "+ UpdateDataRequestController.shouldSendUpdateDataRequest );
            if (!UpdateDataRequestController.updateDataRequestLock && UpdateDataRequestController.shouldSendUpdateDataRequest) {
                //console.log("lockCheckChangeTimeAndSaveUpdatedData lock");
                UpdateDataRequestController.updateDataRequestLock = true;
                UpdateDataRequestController.shouldSendUpdateDataRequest = false;
                Network.sendRequest(Network.getJsonUpdateTimeUrl(Controller.getTextAreaValue("loginTextArea").trim())).then(lastChangeTime => {
                    if (UpdateDataRequestController.lastChangeTime === lastChangeTime) {
                        UpdateDataRequestController.saveUpdatedData();
                        // update change data with Date.now();
                        UpdateDataRequestController.lastChangeTime = Date.now() + "";
                        var login = Controller.getTextAreaValue("loginTextArea").trim();
                        fetch(Network.setJsonUpdateTimeUrl(UpdateDataRequestController.lastChangeTime, login))
                            .then(response => {
                            UpdateDataRequestController.updateDataRequestLock = false;
                            if (response.ok) {
                                UpdateDataRequestController.lockCheckChangeTimeAndSaveUpdatedData();
                            }
                            else {
                                alert("Failed to set last update time");
                            }
                        }).catch(function (body) {
                            UpdateDataRequestController.updateDataRequestLock = false;
                            alert("Failed to set last update time");
                        });
                    }
                    else {
                        console.log("data out of date, reloading");
                        // reload data, apply changes, try o save once more
                        Controller.reload();
                        //UpdateDataRequestController.updateDataRequestLock = false;
                        //alert("Reload page to update data");
                    }
                }).catch(function (body) {
                    UpdateDataRequestController.updateDataRequestLock = false;
                    alert("Failed to load last update time");
                });
            }
        });
    }
    static checkChangeTimeAndSaveUpdatedData() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("checkChangeTimeAndSaveUpdatedData");
            UpdateDataRequestController.shouldSendUpdateDataRequest = true;
            UpdateDataRequestController.lockCheckChangeTimeAndSaveUpdatedData();
        });
    }
    static saveUpdatedData() {
        //console.log("saveUpdatedData");
        const hashCode = s => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
        var login = Controller.getTextAreaValue("loginTextArea").trim();
        var hash = Math.abs(hashCode(login));
        if (login.length > 0) {
            var list = [];
            Model.rootContention().recursiveAddChilds(list);
            var json = JSON.stringify(list);
            UpdateDataRequestController.saveJson(Network.uploadDataUrl(), json, hash.toString(), Controller.getEncriptionKey(), Controller.commandsList.length);
        }
    }
    static saveJson(url, json, loginHash, password, savedCommandsCount) {
        return __awaiter(this, void 0, void 0, function* () {
            CryptoWarper.encrypt(password, json).then(function (encriptionData) {
                var data = new SerializedData();
                data.encriptedData = encriptionData;
                var json = "";
                var contentType = "text/plain";
                if (Network.localhosted) {
                    json = JSON.stringify(data);
                    contentType = "application/json";
                }
                else {
                    var requestData = new PostRequestData();
                    requestData.appKey = "file";
                    requestData.messageKey = "notepadData";
                    requestData.login = Controller.getTextAreaValue("loginTextArea").trim();
                    requestData.password = "afghknjaophfpeowhfpohawe";
                    requestData.message = JSON.stringify(data);
                    json = JSON.stringify(requestData);
                }
                return fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': contentType },
                    body: json
                }).then(function (body) { return body.text(); }).then(function (data) {
                    //console.log(data);
                    if (data == "ok") {
                        console.log("data saved, clean command list");
                        Controller.commandsList = Controller.commandsList.slice(savedCommandsCount);
                        //
                    }
                    else {
                        alert("страница потеряла актуальность, перезагрузите чтобы вносить изменения");
                    }
                }).catch(function (body) {
                    UpdateDataRequestController.updateDataRequestLock = false;
                    alert("Failed to update data");
                });
            });
        });
    }
}
UpdateDataRequestController.updateDataRequestLock = false;
UpdateDataRequestController.shouldSendUpdateDataRequest = false;
UpdateDataRequestController.lastChangeTime = "0";
//# sourceMappingURL=UpdateDataRequestController.js.map