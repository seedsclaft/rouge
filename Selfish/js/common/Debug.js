class Debug {
    constructor() {
    }

    static log(log){
        if (!this.isPlayTest()){
            return;
        }
        console.error(log);
    }

    static error(log){
        if (!this.isPlayTest()){
            return;
        }
        console.error(log);
    }

    static isPlayTest(){
        return $gameTemp && $gameTemp.isPlaytest();
    }
}