var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Network {
    static localhosted() {
        return (location.hostname === "localhost" || location.hostname === "127.0.0.1");
    }
    static sendRequest(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch(url)
                .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.text();
            });
        });
    }
    static uploadDataUrl() {
        return "/Branch/saveUdatedData";
    }
    static loadJsonUrl(login) {
        return "/Branch/json";
    }
    static login(mail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var url = "/Account/login";
            var loginJson = new LoginRequestJson();
            loginJson.mail = mail;
            loginJson.password = password;
            var response = yield Network.sendPostRequest(url, JSON.stringify(loginJson));
            return yield response.text();
        });
    }
    static createBranch(branchData) {
        return __awaiter(this, void 0, void 0, function* () {
            var url = "/Account/createBranch";
            var json = JSON.stringify(branchData);
            var response = yield Network.sendPostRequest(url, json);
            var text = yield response.text();
            return JSON.parse(text);
        });
    }
    static createAccountUrl(password, mail) {
        return "/Account/CreateAccount/" + password + "/" + mail;
    }
    static getJsonUpdateTimeUrl(login) {
        return "/Branch/lastChangeTime";
    }
    static setJsonUpdateTimeUrl(time, login) {
        return "/Branch/setLastChangeTime/" + time;
    }
    static getBranchesData(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var json = yield fetch("https://localhost:44380/Branch/branches/" + login + "/" + password);
            //console.log(json.text());
            return json.text();
            //return json.text();
        });
    }
    //
    static getBranchData(login, userPassword, branchId, branchPassword, dumpVersion, commandsVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            //[Route("Home/branchData/{login}/{userPassword}/{branchId}/{branchPassword}/{dumpVersion}/{commandsVersion}")]
            //public JsonResult branchData(string login, string userPassword, string branchId, string branchPassword, string dumpVersion, string commandsVersion)
            var json = yield fetch("https://localhost:44380/Branch/branchData/" + login + "/" + userPassword + "/" + branchId + "/" + branchPassword + "/" + dumpVersion + "/" + commandsVersion);
            return json.text();
        });
    }
    static sendPostRequest(url, json) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: json
            });
        });
    }
    static updateBranchesData(branchesData) {
        return __awaiter(this, void 0, void 0, function* () {
            var json = JSON.stringify(branchesData);
            var url = "https://localhost:44380/Branch/updateBranchData/";
            console.log(json);
            return Network.sendPostRequest(url, json);
        });
    }
}
//# sourceMappingURL=Network.js.map