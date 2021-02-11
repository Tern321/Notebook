const encryptionTextFieldKey = 'encryptionTextFieldKey';
const mailTextFieldKey = 'mailTextFieldKey';
const passwordTextFieldKey = 'passwordTextFieldKey';
const userIdTextFieldKey = 'userIdTextFieldKey';



const lsEncryptionKey = 'lsEncryptionKey';
const lsAccountDataKey = 'lsAccountDataKey';

const branchEncryptionTextFieldKey = "branchEncryptionTextFieldKey";
const branchNameTextFieldKey = "branchNameTextFieldKey";

class AccountPageController
{
    static accountData: LoginData;
    static async init() {
        console.log("init");

        var encriptionKey = localStorage.getItem(lsEncryptionKey);
        var accountDataJson = localStorage.getItem(lsAccountDataKey);
        if (!stringIsEmty(accountDataJson) && !stringIsEmty(encriptionKey))
        {
            AccountPageController.accountData = JSON.parse(accountDataJson);
            AccountPageController.updateUI();

        }
    }
    static async createBranch(branchType: string)
    {
        try {
            console.log("createBranch " + branchType);

            var branchName = Common.getTextAreaValue(branchNameTextFieldKey);
            var encryptionKey = Common.getTextAreaValue(branchEncryptionTextFieldKey);

            if (encryptionKey.length == 0) encryptionKey = CryptoWarper.randomString(20);

            // get branch id, save new encription key for branch
            var branchData = new CreateBranchJson();
            branchData.branchName = Common.getTextAreaValue(branchNameTextFieldKey);
            branchData.branchType = branchType;
            branchData.userId = AccountPageController.accountData.userId;
            branchData.password = AccountPageController.accountData.password;


            let response: CreateBranchResponseJson = await Network.createBranch(branchData);
            console.log(response);
            if (stringIsEmty(response.error)) {
                AccountPageController.addBranchToLoginData(branchData.userId, "", encryptionKey);
                var loginData = Network.login(AccountPageController.accountData.mail, branchData.password);
                // расшифровать? данные логина, перезагрузить их

                // call add branch to login data


                //let map = new Map().set('a', 1).set('b', 2);
                //let array = Array.from(map, ([name, value]) => ({ name, value }));


                // save encryptionKey to account data
            }
            else {
                alert(response.error);
            }
        }
        catch (exception) {
            console.log(+exception);
        }
    }

    static async addBranchToLoginData(branchId: string, readPassword: string, encryptionPassword: string) {

    }

    static async login() {

        var mail: string = Common.getTextAreaValue(mailTextFieldKey);
        var password: string = Common.getTextAreaValue(passwordTextFieldKey);

        var accountEncryptionKey = Common.getTextAreaValue(encryptionTextFieldKey);
        localStorage.setItem(lsEncryptionKey, accountEncryptionKey);

        var loginDataJson: string = await Network.login(mail, password);

        console.log(loginDataJson);

        var loginData: LoginData = JSON.parse(loginDataJson) as LoginData;
        if (stringIsEmty(loginData.error))
        {
            AccountPageController.accountData = loginData;
            localStorage.setItem(lsAccountDataKey, loginDataJson);
            AccountPageController.updateUI();
        }
    }

    static async updateUI() {
        Common.setTextAreaValue(encryptionTextFieldKey, localStorage.getItem(lsEncryptionKey));
        Common.setTextAreaValue(mailTextFieldKey, AccountPageController.accountData.mail);
        Common.setTextAreaValue(passwordTextFieldKey, AccountPageController.accountData.password);
        Common.setTextAreaValue(userIdTextFieldKey, AccountPageController.accountData.userId);
    }

    static async createAccount()
    {
        var mail: string = Common.getTextAreaValue(mailTextFieldKey);
        var password: string = Common.getTextAreaValue(passwordTextFieldKey);
        var accountEncryptionKey = Common.getTextAreaValue(encryptionTextFieldKey);

        if (password.length == 0) password = CryptoWarper.randomString(20);
        if (accountEncryptionKey.length == 0) accountEncryptionKey = CryptoWarper.randomString(20);

        const json = await Network.sendRequest(Network.createAccountUrl(password, mail));
        
        let loginData: LoginData = JSON.parse(json);
        if (!stringIsEmty(loginData.error) && json)
        {
            localStorage.setItem(lsEncryptionKey, accountEncryptionKey);
            localStorage.setItem(lsAccountDataKey, json);
            this.updateUI();
        }
        else {
            alert(loginData.error);
        }
    }
}
window.onload = () => {
    AccountPageController.init();
}