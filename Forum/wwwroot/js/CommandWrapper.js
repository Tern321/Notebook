class CommandWrapper {
    // commands
    static moveContentionToTop(contentionId) {
        var command = new Command();
        command.task = "moveContentionToTop";
        command.contentionId = contentionId;
    }
    static removeContention(contentionId) {
        var command = new Command();
        command.task = "removeContention";
        command.contentionId = contentionId;
    }
    static moveContention(contentionId, targetId) {
        var command = new Command();
        command.task = "moveContention";
        command.contentionId = contentionId;
        command.targetId = targetId;
    }
    static collapseContention(contentionId, collapse) {
    }
    static changeContentionColor(contentionId, color) {
    }
    static createTopicFromContention(contentionId, topic) {
    }
    static addContention(contentionId, parentContentionId, text, url, linkId) {
    }
    static switchContentionsOrder(contentionId, secondElementId, parentContentionId) {
    }
}
//# sourceMappingURL=CommandWrapper.js.map