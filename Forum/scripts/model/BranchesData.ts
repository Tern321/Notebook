class BranchesData {

    branchesDataMap: Map<string, BranchData> = new Map();
    private branchesArray: Array<BranchData> = [];

    static branchesDataFromJson(json: string): BranchesData {
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
        catch (err)
        {
            console.log(err);
        }
        return branchesData;
    }
    
    
    stringify(): string {
        this.branchesArray = Array.from(this.branchesDataMap.values());
        return JSON.stringify(this);
    }
}
