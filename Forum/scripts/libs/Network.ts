class Network
{
    static localhosted(): boolean {
        return (location.hostname === "localhost" || location.hostname === "127.0.0.1");
    }

    static async sendRequest(url: string): Promise<string> {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.text();
            })
    }

    static uploadDataUrl(): string {
        return "/Branch/saveUdatedData";
    }

    static loadJsonUrl(login: string): string {
        return "/Branch/json";
    }

    static async login(mail: string, password: string): Promise<string> {
        var url = "/Account/login";

        var loginJson = new LoginRequestJson();
        loginJson.mail = mail;
        loginJson.password = password;

        var response = await Network.sendPostRequest(url, JSON.stringify(loginJson));
        return await response.text();
    }

    static async createBranch(branchData: CreateBranchJson): Promise<CreateBranchResponseJson> {
        var url = "/Account/createBranch";
        var json = JSON.stringify(branchData);
        var response = await Network.sendPostRequest(url, json);
        var text: string = await response.text();
        return JSON.parse(text) as CreateBranchResponseJson;
    }

    static createAccountUrl(password: string, mail:string): string {
        return "/Account/CreateAccount/" + password + "/" + mail;
    }

    static getJsonUpdateTimeUrl(login: string): string {
        return "/Branch/lastChangeTime";
    }

    static setJsonUpdateTimeUrl(time: string, login: string): string {
            return "/Branch/setLastChangeTime/" + time;
    }

    static async getBranchesData(login: string, password: string): Promise<string> {
        var json = await fetch("https://localhost:44380/Branch/branches/" + login + "/" + password);
        //console.log(json.text());
        return json.text();
        //return json.text();
    }

    //
    static async getBranchData(login, userPassword, branchId, branchPassword, dumpVersion, commandsVersion) {
        //[Route("Home/branchData/{login}/{userPassword}/{branchId}/{branchPassword}/{dumpVersion}/{commandsVersion}")]
        //public JsonResult branchData(string login, string userPassword, string branchId, string branchPassword, string dumpVersion, string commandsVersion)

        var json = await fetch("https://localhost:44380/Branch/branchData/" + login + "/" + userPassword + "/" + branchId + "/" + branchPassword + "/" + dumpVersion + "/" + commandsVersion);
        return json.text();
    }


    static async sendPostRequest(url: string, json: string): Promise<Response>
    {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: json
        });
    }


    static async updateBranchesData(branchesData: UpdateBranchesJson) {

        var json = JSON.stringify(branchesData);
        var url = "https://localhost:44380/Branch/updateBranchData/";
        console.log(json);
        return Network.sendPostRequest(url, json);
    }
}

