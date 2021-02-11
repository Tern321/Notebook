class BranchesData {
    constructor() {
        this.branchesDataMap = new Map();
        this.branchesArray = [];
    }
    static branchesDataFromJson(json) {
        var branchesData = new BranchesData();
        try {
            let obj = JSON.parse(json);
            obj.branchesArray.forEach(function (obj) {
                var branchData = new BranchData();
                branchData.id = obj.id;
                branchData.name = obj.name;
                branchesData.branchesDataMap.set(branchData.id, branchData);
            });
        }
        catch (err) {
            console.log(err);
        }
        return branchesData;
    }
    stringify() {
        this.branchesArray = Array.from(this.branchesDataMap.values());
        return JSON.stringify(this);
    }
}
//# sourceMappingURL=BranchesData.js.map