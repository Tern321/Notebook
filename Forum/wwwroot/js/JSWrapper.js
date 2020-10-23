//function TestSave() {
//    console.log("TestSave");
    
//    Backendless.Data.of("TestTable").save({ foo: "bar" })
//        .then(function (obj) {
//            console.log("object saved. objectId " + obj.objectId)
//        })
//        .catch(function (error) {
//            console.log("got error - " + error)
//        })
//}
function backendlessInit() {
    var APP_ID = '4498E4FA-01A9-8E7F-FFC3-073969464300';
    var API_KEY = 'EA20D9FD-18DC-476D-9169-57DD9EA626C7';
    Backendless.initApp(APP_ID, API_KEY);
}
//function TestLoad() {
//    console.log("TestLoad");

//    Backendless.Data.of("TestTable").findFirst()
//        .then(function (result) {
//            console.log(result);
//        })
//        .catch(function (error) {
//            console.log(error);
//        });


//    //const queryBuilder = Backendless.DataQueryBuilder.create()
//    //queryBuilder.addProperties('name', 'dateOfBirth')

//    //Backendless.Data.of('Person').find(queryBuilder)
//}

function backendlessUploadFile(fileName, text) {
    //console.log("backendlessUploadFile " + hash);
    var file = new File([text], fileName, {
        type: "text/plain",
    });
    //"https://backendlessappcontent.com/4498E4FA-01A9-8E7F-FFC3-073969464300/B416CA2D-2783-4942-A3ED-B132738BE078/files/DataFolder/" + hash + ".json";
    Backendless.Files.upload(file, "DataFolder", true)
        .then(function (fileURL) {
            console.log("File successfully uploaded. Path to download: " + result.fileURL);
        })
        .catch(function (error) {
            console.log("error - " + error.message);
        });
}