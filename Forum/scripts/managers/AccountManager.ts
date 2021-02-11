
const branchLinksKey: string = "branchLinks";

const userIdKey: string = "userId";
const userPasswordKey: string = "userPassword";

const branchInformationPrefixKey: string = "branchInformation_";
class AccountManager
{
    static userId: string;
    static userPassword: string;
    static branchLinks: Map<string, BranchLinkJson>;
    //static serverBranchLinks: Map<string, BranchLinkJson> = new Map();
    static initialize() {
        AccountManager.branchLinks = new Map();
        AccountManager.userId = localStorage.getItem(userIdKey);
        AccountManager.userPassword = localStorage.getItem(userPasswordKey);
        var json: string = localStorage.getItem(branchLinksKey);
        if ( json !== 'undefined' && json !== null && json.length > 0) {
            //console.log("load AccountManager json");
            //console.log(json);

            var links = JSON.parse(json) as BranchLinkJson[]

            for (var i = 0; i < links.length; i++) {
                AccountManager.branchLinks.set(links[i].branchId, links[i]);
            }
        }
    }

    static saveUpdatedData() {
        // save localy
        // save to server
        var json = JSON.stringify(Array.from( AccountManager.branchLinks.values()));
        //console.log(json);
        localStorage.setItem(branchLinksKey, json);
            //var list: Contention[] = [];
            //Controller.selectedBranch().rootContention().recursiveAddChilds(list);

            //var json = JSON.stringify(list);
            //UpdateDataRequestController.saveJson(Network.uploadDataUrl(), json, Controller.getEncriptionKey());

    }
    static branchLink(branchId: string) {
        return AccountManager.branchLinks.get(branchId);
    }
    static containsBranchLink(link: BranchLinkJson): boolean {
        return AccountManager.branchLinks.has(link.branchId);
    }

    static importBranchLink(link: BranchLinkJson) {
        AccountManager.branchLinks.set(link.branchId, link);
        AccountManager.saveUpdatedData();
    }

    static removeBranchInformation(branchId: string) {
        var branchInformationKey = branchInformationPrefixKey + branchId;
        localStorage.setItem(branchInformationKey, "");
    }

    static getBranchInformation(branchId: string): BranchData
    {
        try
        {
            var branchInformationKey = branchInformationPrefixKey + branchId;
            //console.log(branchInformationKey);
            var json: string = localStorage.getItem(branchInformationKey);
            //console.log("getBranchInformation saved item" + json);
            if (json === undefined || json === null || json.length == 0) {
                //console.log("no data saved");
            }
            else {
                //console.log("getBranchInformation " + branchInformationPrefixKey + branchId);
                //console.log(json);

                var branchInformation = JSON.parse(json) as BranchData
                //console.log("return branchInformation json " + branchInformation);
                return branchInformation;
            }
        }
        catch (exception) {
            console.log("getBranchInformation error " + exception);
        }

        //console.log("getBranchInformation error ");
        var branchInformation = new BranchData();
        branchInformation.id = branchId;
        //console.log("return branchInformation err " + branchInformation);
        return branchInformation;
    }
    static updateBranchInformation(branchInformation: BranchDataJson) {

        if (branchInformation.error === null || branchInformation.error.length == 0)
        {
            //console.log("updateBranchInformation branchInformation");
            //console.log(branchInformation);

            var localBranchInfo = AccountManager.getBranchInformation(branchInformation.branchId);
            //console.log("localBranchInfo ");
            //console.log(localBranchInfo);
            if (localBranchInfo.dumpVersion != branchInformation.dumpVersion) {
                localBranchInfo.dump = branchInformation.dump;
                localBranchInfo.dumpVersion = branchInformation.dumpVersion;
            }
            if (localBranchInfo.commandsVersion != branchInformation.commandsVersion) {
                localBranchInfo.commands = branchInformation.commands;
                localBranchInfo.commandsVersion = branchInformation.commandsVersion;
            }
            //console.log("save data " + JSON.stringify(localBranchInfo));
            var branchInformationKey = branchInformationPrefixKey + branchInformation.branchId;

            // save

            //console.log("localBranchInfo for saving");
            //console.log(localBranchInfo);

            localStorage.setItem(branchInformationKey, JSON.stringify(localBranchInfo));
            // reload UI
            // FIX THIS
            //BranchPageController.reloadUIForBranch(branchInformation);

        }
        else {
            console.log("updateBranchInformation error " + branchInformation.error);
        }
    }
}
AccountManager.initialize();

