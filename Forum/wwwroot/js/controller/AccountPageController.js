var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const encryptionTextFieldKey = 'encryptionTextFieldKey';
const mailTextFieldKey = 'mailTextFieldKey';
const passwordTextFieldKey = 'passwordTextFieldKey';
const userIdTextFieldKey = 'userIdTextFieldKey';
const lsEncryptionKey = 'lsEncryptionKey';
const lsAccountDataKey = 'lsAccountDataKey';
const branchEncryptionTextFieldKey = "branchEncryptionTextFieldKey";
const branchNameTextFieldKey = "branchNameTextFieldKey";
class AccountPageController {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("init");
            var encriptionKey = localStorage.getItem(lsEncryptionKey);
            var accountDataJson = localStorage.getItem(lsAccountDataKey);
            if (!stringIsEmty(accountDataJson) && !stringIsEmty(encriptionKey)) {
                AccountPageController.accountData = JSON.parse(accountDataJson);
                AccountPageController.updateUI();
            }
        });
    }
    static createBranch(branchType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("createBranch " + branchType);
                var branchName = Common.getTextAreaValue(branchNameTextFieldKey);
                var encryptionKey = Common.getTextAreaValue(branchEncryptionTextFieldKey);
                if (encryptionKey.length == 0)
                    encryptionKey = CryptoWarper.randomString(20);
                // get branch id, save new encription key for branch
                var branchData = new CreateBranchJson();
                branchData.branchName = Common.getTextAreaValue(branchNameTextFieldKey);
                branchData.branchType = branchType;
                branchData.userId = AccountPageController.accountData.userId;
                branchData.password = AccountPageController.accountData.password;
                let response = yield Network.createBranch(branchData);
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
        });
    }
    static addBranchToLoginData(branchId, readPassword, encryptionPassword) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static login() {
        return __awaiter(this, void 0, void 0, function* () {
            var mail = Common.getTextAreaValue(mailTextFieldKey);
            var password = Common.getTextAreaValue(passwordTextFieldKey);
            var accountEncryptionKey = Common.getTextAreaValue(encryptionTextFieldKey);
            localStorage.setItem(lsEncryptionKey, accountEncryptionKey);
            var loginDataJson = yield Network.login(mail, password);
            console.log(loginDataJson);
            var loginData = JSON.parse(loginDataJson);
            if (stringIsEmty(loginData.error)) {
                AccountPageController.accountData = loginData;
                localStorage.setItem(lsAccountDataKey, loginDataJson);
                AccountPageController.updateUI();
            }
        });
    }
    static updateUI() {
        return __awaiter(this, void 0, void 0, function* () {
            Common.setTextAreaValue(encryptionTextFieldKey, localStorage.getItem(lsEncryptionKey));
            Common.setTextAreaValue(mailTextFieldKey, AccountPageController.accountData.mail);
            Common.setTextAreaValue(passwordTextFieldKey, AccountPageController.accountData.password);
            Common.setTextAreaValue(userIdTextFieldKey, AccountPageController.accountData.userId);
        });
    }
    static createAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            var mail = Common.getTextAreaValue(mailTextFieldKey);
            var password = Common.getTextAreaValue(passwordTextFieldKey);
            var accountEncryptionKey = Common.getTextAreaValue(encryptionTextFieldKey);
            if (password.length == 0)
                password = CryptoWarper.randomString(20);
            if (accountEncryptionKey.length == 0)
                accountEncryptionKey = CryptoWarper.randomString(20);
            const json = yield Network.sendRequest(Network.createAccountUrl(password, mail));
            let loginData = JSON.parse(json);
            if (!stringIsEmty(loginData.error) && json) {
                localStorage.setItem(lsEncryptionKey, accountEncryptionKey);
                localStorage.setItem(lsAccountDataKey, json);
                this.updateUI();
            }
            else {
                alert(loginData.error);
            }
        });
    }
}
window.onload = () => {
    AccountPageController.init();
};
//# sourceMappingURL=AccountPageController.js.map