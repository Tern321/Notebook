class Model {
    //static branchesData: BranchesData = new BranchesData();
    static branchesMap: Map<string, Branch> = new Map();

    

    // logic
    static decriptJson(jsonText: string, password: string) {
        var data: SerializedData = <SerializedData>JSON.parse(jsonText);
        //console.log(data.version);
        //console.log(data.json);
 
        CryptoWarper.decrypt(password, data.encryptedData).then(function (json: string) {
            //console.log("decripted json ");
            Model.parseJson(json);
        }).catch(function (error) {
            console.log(error);
        });
        
    }

    static parseJson(jsonText: string) {
        //var branchId: string = "1";
        //if (!Model.branchesMap.has(branchId)) {
        //    //Model.branchesMap.set(branchId, new Branch(branchId));
        //}
        //var branch = Model.branchesMap.get(branchId);
        ////console.log("parseJson " + jsonText);
        //branch.contentionsMap = new Map();
        //branch.childContentionMap = new Map();
        //branch.childTopicsMap = new Map();

        //try {
        //    var objectsList = [];
        //    objectsList = <Contention[]>JSON.parse(jsonText);

        //    // fill contentionsMap and contentionsList with real objects
        //    objectsList.forEach(function (obj) {
        //        var cn = new Contention(obj.id, obj.topic);
        //        cn.text = obj.text;
        //        cn.url = obj.url;
        //        cn.parentContentionId = obj.parentContentionId;
        //        //cn.childs = obj.childs;
        //        cn.color = obj.color;
        //        cn.collapce = obj.collapce;
        //        cn.topic = obj.topic;
        //        cn.linkId = obj.linkId;
        //        //cn.width = obj.width;
        //        //cn.height = obj.height;
        //        if (cn.topic) {
        //            branch.childTopicsMap.set(cn.id, []);
        //        }
        //        //cn.childTopics = obj.childTopics;
        //        branch.contentionsMap.set(cn.id, cn);

                
        //        var parentContentionChildsList = branch.childContentionMap.get(cn.parentContentionId);
        //        if (parentContentionChildsList) {
        //            parentContentionChildsList.push(cn.id);
        //        }
                
        //    });
        //    UpdateDataRequestController.getLastChangeTime(Network.getJsonUpdateTimeUrl(Controller.getTextAreaValue("loginTextArea").trim()));
        //}
        //catch (e) {
        //    console.log("parse error " + e);
        //}

        //// add root element if there is no one
        //if (!branch.contentionsMap.has("root")) {
        //    console.log("create root topic");
        //    var cn = new Contention("root", true);
        //    cn.text = "root";
        //    cn.parentContentionId = "-1";
        //    //cn.width = 320;
        //    cn.topic = true;
        //    branch.contentionsMap.set(cn.id, cn);
        //}

        //branch.contentionsMap.get("root").topic = true;
        //branch.updateTopics();
        //UIDrawer.drawUI();
    }

   
    
}

class SerializedData {
    version: number;
    json: string;
    encryptedData: EncryptionData;
}