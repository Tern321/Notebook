
declare var TestUploadFile;

class Network
{

    static async saveJson(url: string, json: string, loginHash:string, password: string)
    {
        CryptoWarper.encrypt(password, json).then(function (encriptionData: EncriptionData)
        {
            var data: SerializedData = new SerializedData();
            data.encriptedData = encriptionData;
            data.version = Controller.currentVersion;
            console.log(data);
            //console.log("json data " + JSON.stringify(data));
            //data.json = json;
            if (true) {
                console.log("loginHash " + loginHash);
                console.log(JSON.stringify(data));
                TestUploadFile(loginHash, JSON.stringify(data));
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
            

            //return body.text();
            //CryptoWarper.decrypt("pass123", data).then(function (json: string) {
            //    console.log(json);
            //});
        })
    }

    static async loadJson(url: string) {
        const response = await fetch(url)
            .then(function (body) { return body.text(); })
            .then(function (data) { Model.decriptJson(data, Controller.getEncriptionKey()); })
            .catch(function (body)
            {
                console.log("loadJson error");
                Model.parseJson("");
            }
            );
    }

    static initBackndless() {
        var APP_ID = '4498E4FA-01A9-8E7F-FFC3-073969464300';
        var API_KEY = 'EA20D9FD-18DC-476D-9169-57DD9EA626C7';

        //Backendless.initApp(APP_ID, API_KEY);

        //Backendless.Data.of("TestTable").save({ foo: "bar" })
        //    .then(function (obj) {
        //        console.log("object saved. objectId " + obj.objectId)
        //    })
        //    .catch(function (error) {
        //        console.log("got error - " + error)
        //    })

        //Backendless.initApp(APP_ID, API_KEY);

        //Backendless.Data.of("TestTable").save({ foo: "bar" })
        //    .then(function (obj: any) {
        //        console.log("object saved. objectId " + obj.objectId)
        //    })
        //    .catch(function (error) {
        //        console.log("got error - " + error)
        //    })
    }
}
