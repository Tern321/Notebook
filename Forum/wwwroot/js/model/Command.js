const moveContentionToTopKey = 'mCT';
const removeContentionKey = 'rC';
const moveContentionKey = 'mC';
const collapseContentionKey = 'cC';
const changeContentionColorKey = 'cCC';
const createTopicFromContentionKey = 'cT';
const addContentionKey = 'aC';
const switchContentionsOrderKey = 'sCO';
class Command {
    // commands
    static moveContentionToTop(contentionId) {
        var command = new Command();
        command.t = moveContentionToTopKey;
        command.cId = contentionId;
        return command;
    }
    static removeContention(contentionId) {
        var command = new Command();
        command.t = removeContentionKey;
        command.cId = contentionId;
        return command;
    }
    static moveContention(contentionId, targetId) {
        var command = new Command();
        command.t = moveContentionKey;
        command.cId = contentionId;
        command.tId = targetId;
        return command;
    }
    static collapseContention(contentionId, collapse) {
        var command = new Command();
        command.t = collapseContentionKey;
        command.cId = contentionId;
        command.collapse = collapse;
        return command;
    }
    static changeContentionColor(contentionId, color) {
        var command = new Command();
        command.t = changeContentionColorKey;
        command.cId = contentionId;
        command.color = color;
        return command;
    }
    static createTopicFromContention(contentionId, topic) {
        var command = new Command();
        command.t = createTopicFromContentionKey;
        command.cId = contentionId;
        command.topic = topic;
        return command;
    }
    static addContention(contentionId, parentContentionId, text, url, linkId) {
        var command = new Command();
        command.t = addContentionKey;
        command.cId = contentionId;
        command.pCId = parentContentionId;
        command.text = text;
        command.url = url;
        command.linkId = linkId;
        return command;
    }
    static switchContentionsOrder(contentionId, secondElementId, parentContentionId) {
        var command = new Command();
        command.t = switchContentionsOrderKey;
        command.cId = contentionId;
        command.secondElementId = secondElementId;
        command.pCId = parentContentionId;
        return command;
    }
    static executeCommand(command, branch) {
        try {
            switch (command.t) {
                case moveContentionToTopKey:
                    branch.moveContentionToTop(command.cId);
                    break;
                case removeContentionKey:
                    branch.removeContention(command.cId);
                    break;
                case moveContentionKey:
                    branch.moveContention(command.cId, command.tId);
                    break;
                case collapseContentionKey:
                    branch.collapseContention(command.cId, command.collapse);
                    break;
                case changeContentionColorKey:
                    branch.changeContentionColor(command.cId, command.color);
                    break;
                case createTopicFromContentionKey:
                    branch.createTopicFromContention(command.cId, command.topic);
                    break;
                case addContentionKey:
                    branch.addContention(command.cId, command.pCId, command.text, command.url, command.linkId);
                    break;
                case switchContentionsOrderKey:
                    branch.switchContentionsOrder(command.cId, command.secondElementId, command.pCId);
                    break;
                default:
                    console.log("executeCommand error " + JSON.stringify(command));
            }
        }
        catch (exception) {
            console.log("executeCommand exception " + exception);
        }
    }
}
//# sourceMappingURL=Command.js.map