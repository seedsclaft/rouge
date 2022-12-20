class Model_Animation {
    constructor() {
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