class Network {

    static async saveJson(url: string, json: string, loginHash: string, password: string) {
        CryptoWarper.encrypt(password, json).then(function (encriptionData: EncriptionData) {
            var data: SerializedData = new SerializedData();
            data.encriptedData = encriptionData;
            data.version = Controller.currentVersion;
            //console.log(data);
            //console.log("json data " + JSON.stringify(data));
            //data.json = json;
            if (false) {
                //console.log("loginHash " + loginHash);
                //console.log(JSON.stringify(data));
            }
            else {
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, // this line is important, if this content-type is not set it wont work
                    body: JSON.stringify(data)
                }).then(function (body) { return body.text(); }).then(function (data) {

                    if (data == "ok") {
                        console.log("data saved");
                    }
                    else {
                        alert("страница потеряла актуальность, перезагрузите чтобы вносить изменения");
                        Controller.currentVersion = -1000;
                    }
                });
            }
        })
    }

    static async loadJson(url: string) {
        const response = await fetch(url)
            .then(function (body) { return body.text(); })
            .then(function (data) { Model.decriptJson(data, Controller.getEncriptionKey()); })
            .catch(function (body) {
                console.log("loadJson error");
                Model.parseJson("");
            }
            );
    }
}
