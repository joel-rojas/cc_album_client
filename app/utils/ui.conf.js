/**
 * @class This class is used to get/perform custom and generic UI data/methods.
 */
class UIUtils {
    /**
     * @constructor Inits UI generic properties.
     */
    constructor() {
        this.screenWidth = {
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1140
        };
    }
    /**
     * Returns screen-width map object.
     */
    getScreenWidth() {
        return this.screenWidth;
    }
}
export const uiUtils = new UIUtils();