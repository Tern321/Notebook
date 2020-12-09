class Network
{
    static localhosted: boolean = true;


    static async sendRequest(url: string): Promise<string> {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.text();
            })
    }

    static generateReadUrl(login: string, appKey: string, messageKey: string) {
        return "https://www.sbitravel.com/rest/messages/read_message?login=" + login + "&password=afghknjaophfpeowhfpohawe&appKey=" + appKey + "&messageKey=" + messageKey;
    }

    static generateWriteUrl(login: string, appKey: string, messageKey: string, message: string) {
        return "https://www.sbitravel.com/rest/messages/send_message?login=" + login + "&password=afghknjaophfpeowhfpohawe&appKey=" + appKey + "&messageKey=" + messageKey + "&message=" + message;
    }

    static uploadDataUrl(): string {
        if (Network.localhosted) {
            return "/Home/saveUdatedData"
        }
        return "https://www.sbitravel.com/rest/messages/send_message_post";
    }

    static loadJsonUrl(login: string): string {
       
        if (Network.localhosted) {
            return "/Home/json"
        }
        return Network.generateReadUrl(login, "file", "notepadData");
    }

    static getJsonUpdateTimeUrl(login: string): string {
        if (Network.localhosted) {
            return "/Home/lastChangeTime"
        }
        return Network.generateReadUrl(login, "file", "notepadDataUpdateTime");
    }

    static setJsonUpdateTimeUrl(time: string, login: string): string {
        if (Network.localhosted) {
            return "/Home/setLastChangeTime/" + time;
        }
        return Network.generateWriteUrl(login, "file", "notepadDataUpdateTime", UpdateDataRequestController.lastChangeTime)
    }

}

class PostRequestData {
    login: string;
    password: string;
    appKey: string;
    messageKey: string;
    message: string;
}