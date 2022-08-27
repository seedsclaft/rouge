class Model_Animation {
    constructor() {
    }
    get animationData(){
        return $dataAnimationsMv;
    }
    getAnimationById(id){
        const animationData = this.animationData[id];
        if (!animationData){
            Debug.error("getAnimationById" + id + " = null");
            return null;
        }
        return animationData;
    }
}