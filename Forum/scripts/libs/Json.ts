class UpdateBranchesJson
{
    login: string;
    userPassword: string;
    branchId: string;
    branchPassword: string;
    dumpVersion: string;
    encryptedCommands: EncryptionData[];

    static async GenerateUpdateBranchesJson(login: string, userPassword: string, branchId: string, branchPassword: string, dumpVersion: string, encryptionKey: string, commands: Command[]): Promise<UpdateBranchesJson> {
        var data = new UpdateBranchesJson();
        data.login = login;
        data.userPassword = userPassword;
        data.branchId = branchId;
        data.branchPassword = branchPassword;
        data.dumpVersion = dumpVersion;

        data.encryptedCommands = [];

        for (let i = 0; i < commands.length; i++) {
            data.encryptedCommands.push(await CryptoWarper.encrypt(encryptionKey, JSON.stringify(commands[i])))
        } 

        return data;
    }
}

class BranchLinkJson { 
    type: string; // data type pwdR pwdW any else
    branchId: string; // branchId
    password: string; // password
    date: string; // date created
    comment: string; // comment
    encryptionKey: string; // encryptionKey
}

class PostRequestData {
    login: string;
    password: string;
    appKey: string;
    messageKey: string;
    message: string;
}

class BranchDataJson {
    branchId: string;
    dump: string;
    commands: string;
    dumpVersion: string;
    commandsVersion: string;
    error: string;
}

class AccountDataJson { // encrypted object
    userId: string;
    password: string;
    //version: string;
    mail: string;
    branchEncryptionKeys: string;
}



class LoginData
{
    mail: string;
    userId: string;
    password: string;
    encryptedAccountData: EncryptionData;
    error: string;
    version: string;
    branches: BranchInfo[];
}

class BranchInfo {
    branchId: string;
    name: string;
    branchType: string;
    dumpVersion: string;
    commandsVersion: string;

    readPassword: string;
}

class CreateBranchJson {
    userId: string;
    password: string;
    branchName: string;
    branchType: string;
}
class CreateBranchResponseJson {
    branchId: string;
    branchName: string;
    branchType: string;
    error: string;
}

class LoginRequestJson {
    mail: string;
    password: string;
}

class BranchData
{
    id: string;
    name: string;

    dump: string;
    dumpVersion: string;
    commands: string;
    commandsVersion: string;
//    encriptionKey: string;
    //    //readPassword: string;
}

