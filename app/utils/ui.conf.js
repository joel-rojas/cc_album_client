class UIUtils {
    constructor() {
        this.screenWidth = {
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1140
        };
    }
    getScreenWidth() {
        return this.screenWidth;
    }
}
export const uiUtils = new UIUtils();