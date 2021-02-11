var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class UpdateBranchesJson {
    static GenerateUpdateBranchesJson(login, userPassword, branchId, branchPassword, dumpVersion, encryptionKey, commands) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = new UpdateBranchesJson();
            data.login = login;
            data.userPassword = userPassword;
            data.branchId = branchId;
            data.branchPassword = branchPassword;
            data.dumpVersion = dumpVersion;
            data.encryptedCommands = [];
            for (let i = 0; i < commands.length; i++) {
                data.encryptedCommands.push(yield CryptoWarper.encrypt(encryptionKey, JSON.stringify(commands[i])));
            }
            return data;
        });
    }
}
class BranchLinkJson {
}
class PostRequestData {
}
class BranchDataJson {
}
class AccountDataJson {
}
class LoginData {
}
class BranchInfo {
}
class CreateBranchJson {
}
class CreateBranchResponseJson {
}
class LoginRequestJson {
}
class BranchData {
}
//# sourceMappingURL=Json.js.map