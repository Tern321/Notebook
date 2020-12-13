class Command {
    // commands
    static moveContentionToTop(contentionId) {
        var command = new Command();
        command.task = "moveContentionToTop";
        command.contentionId = contentionId;
        return command;
    }
    static removeContention(contentionId) {
        var command = new Command();
        command.task = "removeContention";
        command.contentionId = contentionId;
        return command;
    }
    static moveContention(contentionId, targetId) {
        var command = new Command();
        command.task = "moveContention";
        command.contentionId = contentionId;
        command.targetId = targetId;
        return command;
    }
    static collapseContention(contentionId, collapse) {
        var command = new Command();
        command.task = "collapseContention";
        command.contentionId = contentionId;
        command.collapse = collapse;
        return command;
    }
    static changeContentionColor(contentionId, color) {
        var command = new Command();
        command.task = "changeContentionColor";
        command.contentionId = contentionId;
        command.color = color;
        return command;
    }
    static createTopicFromContention(contentionId, topic) {
        var command = new Command();
        command.task = "createTopicFromContention";
        command.contentionId = contentionId;
        command.topic = topic;
        return command;
    }
    static addContention(contentionId, parentContentionId, text, url, linkId) {
        var command = new Command();
        command.task = "addContention";
        command.contentionId = contentionId;
        command.parentContentionId = parentContentionId;
        command.text = text;
        command.url = url;
        command.linkId = linkId;
        return command;
    }
    static switchContentionsOrder(contentionId, secondElementId, parentContentionId) {
        var command = new Command();
        command.task = "switchContentionsOrder";
        command.contentionId = contentionId;
        command.secondElementId = secondElementId;
        command.parentContentionId = parentContentionId;
        return command;
    }
}
//# sourceMappingURL=Command.js.map