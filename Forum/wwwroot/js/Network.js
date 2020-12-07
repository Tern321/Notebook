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
    static generateReadUrl(login, appKey, messageKey) {
        return "https://www.sbitravel.com/rest/messages/read_message?login=" + login + "&password=afghknjaophfpeowhfpohawe&appKey=" + appKey + "&messageKey=" + messageKey;
    }
    static generateWriteUrl(login, appKey, messageKey, message) {
        return "https://www.sbitravel.com/rest/messages/send_message?login=" + login + "&password=afghknjaophfpeowhfpohawe&appKey=" + appKey + "&messageKey=" + messageKey + "&message=" + message;
    }
    static uploadDataUrl() {
        if (Network.localhosted) {
            return "/Home/saveUdatedData";
        }
        return "https://www.sbitravel.com/rest/messages/send_message_post";
    }
    static loadJsonUrl(login) {
        if (Network.localhosted) {
            return "/Home/json";
        }
        return Network.generateReadUrl(login, "file", "notepadData");
    }
    static getJsonUpdateTimeUrl(login) {
        if (Network.localhosted) {
            return "/Home/lastChangeTime";
        }
        return Network.generateReadUrl(login, "file", "notepadDataUpdateTime");
    }
    static setJsonUpdateTimeUrl(time, login) {
        if (Network.localhosted) {
            return "/Home/setLastChangeTime/" + time;
        }
        return Network.generateWriteUrl(login, "file", "notepadDataUpdateTime", UpdateDataRequestController.lastChangeTime);
    }
}
Network.localhosted = false;
class PostRequestData {
}
//# sourceMappingURL=Network.js.map