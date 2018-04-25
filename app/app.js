import $ from 'jquery';
import 'bootstrap';
import './main.scss';

import {PhotoController} from './controllers/photo.controller';

$(document).ready(() => {
    const photoController = new PhotoController();
    photoController.initViews();
    photoController.getPhotoListAPICall();
    
});
