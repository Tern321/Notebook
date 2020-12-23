class UpdateDataRequestController {

    static updateDataRequestLock: boolean = false;
    static shouldSendUpdateDataRequest = false;
    static lastChangeTime: string = "0";
    //notepadDataUpdateTime

    static async getLastChangeTime(url: string) {
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

    }
    static async setLastChangeTime(url: string, time: number, login: string) {
        //console.log("setLastChangeTime");
        var requestData: PostRequestData = new PostRequestData();
        requestData.appKey = "file";
        requestData.messageKey = "notepadData";
        requestData.login = login;
        requestData.password = "afghknjaophfpeowhfpohawe";
        requestData.message = time + "";

        var json = JSON.stringify(requestData);

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' }, // this line is important, if this content-type is not set it wont work
            body: json
        }).then(function (body) { return body.text(); }).then(function (data) {
            console.log(data);
        }).catch(function (body) {
            UpdateDataRequestController.updateDataRequestLock = false;
            console.log("setLastChangeTime request error");
        });
    }

    static async lockCheckChangeTimeAndSaveUpdatedData() // pain
    {
        //console.log("lockCheckChangeTimeAndSaveUpdatedData updateDataRequestLock " + UpdateDataRequestController.updateDataRequestLock +"  shouldSendUpdateDataRequest "+ UpdateDataRequestController.shouldSendUpdateDataRequest );
        if (!UpdateDataRequestController.updateDataRequestLock && UpdateDataRequestController.shouldSendUpdateDataRequest)
        {
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
                            } else {
                                alert("Failed to set last update time"); 
                            }

                        }).catch(function (body) {
                            UpdateDataRequestController.updateDataRequestLock = false;
                            alert("Failed to set last update time");
                        });
                }
                else {
                    UpdateDataRequestController.updateDataRequestLock = false;
                    alert("Reload page to update data");

                }
            }).catch(function (body) {
                UpdateDataRequestController.updateDataRequestLock = false;
                alert("Failed to load last update time");

            });
        }
    }

    static async checkChangeTimeAndSaveUpdatedData()
    {
        //console.log("checkChangeTimeAndSaveUpdatedData");
        UpdateDataRequestController.shouldSendUpdateDataRequest = true;
        UpdateDataRequestController.lockCheckChangeTimeAndSaveUpdatedData();
    }

    static saveUpdatedData() {
        //console.log("saveUpdatedData");
        const hashCode = s => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);

        var login = Controller.getTextAreaValue("loginTextArea").trim();
        var hash = Math.abs(hashCode(login));
        if (login.length > 0) {
            var list: Contention[] = [];
            Model.rootContention().recursiveAddChilds(list);

            var json = JSON.stringify(list);
            UpdateDataRequestController.saveJson(Network.uploadDataUrl(), json, hash.toString(), Controller.getEncriptionKey());
        }
    }

    static async saveJson(url: string, json: string, loginHash: string, password: string) {
        CryptoWarper.encrypt(password, json).then(function (encriptionData: EncriptionData) {
            var data: SerializedData = new SerializedData();
            data.encriptedData = encriptionData;

            var json = "";
            var contentType = "text/plain";
            if (Network.localhosted) {
                json = JSON.stringify(data);
                contentType = "application/json";
            }
            else {
                var requestData: PostRequestData = new PostRequestData();
                requestData.appKey = "file";
                requestData.messageKey = "notepadData";
                requestData.login = Controller.getTextAreaValue("loginTextArea").trim();
                requestData.password = "afghknjaophfpeowhfpohawe";
                requestData.message = JSON.stringify(data);

                json = JSON.stringify(requestData);
            }

            return fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': contentType }, // this line is important, if this content-type is not set it wont work
                body: json
            }).then(function (body) { return body.text(); }).then(function (data) {
                //console.log(data);
                if (data == "ok") {
                    //console.log("data saved");
                }
                else {
                    alert("страница потеряла актуальность, перезагрузите чтобы вносить изменения");
                }
            }).catch(function (body) {
                UpdateDataRequestController.updateDataRequestLock = false;
                alert("Failed to update data");
            });
        })
    }

}