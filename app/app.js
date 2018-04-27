import $ from 'jquery';
import 'bootstrap';
import './main.scss';

import {PhotoController} from './controllers/photo.controller';

/**
 * When the app DOM is fully rendered, it creates an instance from PhotoController and sets its main views and
 * performs an API call to get the list of photos from server. 
 */
$(document).ready(() => {
    const photoController = new PhotoController();
    photoController.initViews();
    photoController.getPhotoListAPICall();
    
});
