import {model} from '../models/photo.model';
import {uiUtils} from '../utils/ui.conf';

const photoListViewPath = '../views/photo.html';
const photoAddViewPath = '../views/add-photo.html';

/**
 * Photo Controller. This controller renders the distinct UI views for this particular page of the app, handles distinct UI events and 
 * performs API calls to the server to get a list of photos and to upload a photo with title and description.
 */
export class PhotoController {
    /**
     * @constructor. Inits public UI properties, its model property and all the UI events as public methods.
     */
    constructor() {
        /**
         * @property Gets the first parent element from app. 
         */
        this.appEl = $('#app');
        this.resizeTimeout = null;
        /**
         * @property Saves window full width.
         */
        this.currentWidth = window.innerWidth;
        /**
         * @property Sets a reference to UiUtils object from its class.
         */
        this.uiUtils = uiUtils;
        /**
         * @property Sets a reference to Photo's Model object from its class
         */
        this.model = model;
        /**
         * @event click This event triggers upload photo button click event from Add Photo modal component. 
         * It performs an API call to the server in order to save photo name, description and file data. 
         * If the call is successful then a success alert message is shown and form fields values will be cleaned.
         * Otherwise, the call shows an error alert message and form field values won't be cleaned.
         * @param {DOMEvent} ev - DOM event object 
         */
        this.onUploadPhotoEventHandler = (ev) => {
            ev.preventDefault();
            const modal = this.appEl.find('div#addPhotoModal');
            const modalContentEl = modal.find('.modal-content');
            const photoNameEl = modal.find('#photoName');
            const photoDescEl = modal.find('#photoDesc');
            const photoFileEl = modal.find('#photoFile');
            const photoNameText = photoNameEl.val();
            const photoDescText = photoDescEl.val();
            const photoFile = photoFileEl[0].files[0];
            const data = {
                name: photoNameText,
                description: photoDescText,
                file: photoFile
            };
            this.model.addPhoto(data)
                .then(res => {
                    this.getPhotoListAPICall();                    
                    modalContentEl.append(this.getUploadPhotoSuccessAlertTemplate());
                    this.onCloseAddPhotoModalEventHandler.call(this);
                    setTimeout(() => {
                       const alert = $('div.alert-success');
                       alert.alert('close');
                    }, 3000);
                })
                .catch(err => {
                    modalContentEl.append(this.getUploadPhotoFailedAlertTemplate());
                    setTimeout(() => {
                        const alert = $('div.alert-danger');
                        alert.alert('close');
                     }, 3000);
                })
        };
        /**
         * @event click This event triggers close button click event from Add Photo modal component.
         * It closes the Add Photo modal component and cleans Add Photo modal form field values.
         * @param {DOMEvent} ev - DOM event object
         */
        this.onCloseAddPhotoModalEventHandler = (ev) => {
            const modal = this.appEl.find('div#addPhotoModal');
            const photoNameEl = modal.find('#photoName');
            const photoDescEl = modal.find('#photoDesc');
            const photoFileEl = modal.find('#photoFile');
            photoNameEl.val('');
            photoDescEl.val('');
            photoFileEl.val(null);
        };
        /**
         * @event click This event triggers thumbnail element click event from the photo list view.
         * It shows View Photo modal component and populates photo datailed data from thumbanil element to modal elements.
         * @param {DOMEvent} ev - DOM event object 
         */
        this.onThumbnailImgClickEventHandler = (ev) => {
            const currentEl = $(ev.target);
            const parentEl = currentEl.parent();
            const photoImgSrc = parentEl.find('img').attr('src');
            const nameTxt = parentEl.find('h5.card-title').text();
            const descTxt = parentEl.find('p.card-desc').text();
            const viewPhotoModalEl = this.appEl.find('#viewPhotoModal');
            viewPhotoModalEl.find('img.photo-img').attr('src', photoImgSrc);
            viewPhotoModalEl.find('h5.modal-title').text(nameTxt);
            viewPhotoModalEl.find('p.desc').text(descTxt);
            viewPhotoModalEl.modal('show');
        };
    }
    /**
     * This method appends all main DOM elements to this controller.
     */
    appendMainHTMLComponents() {
        this.appEl.append('<div class="title row"><h2 class="col-12 col-md-12">Photo Album App</h2></div>');
        this.appEl.append('<div class="header row"></div>');
        this.appEl.append('<div class="body row"></div>');
        this.appEl.append(this.getAddPhotoModalTemplate());
        this.appEl.append(this.getViewPhotoModalTemplate());
    }
    /**
     * This method performs PhotoList API call to the server. If the call is successful then it saves to photo model property and 
     * it calls to renderPhotoList method to render the photo album list view. Otherwise, it will append an error message to the app 
     * describing the error from API call.
     */
    getPhotoListAPICall() {
        this.model.getPhotoList()
            .then(data => {
                this.model.photoList = Object.assign([], data);
                this.renderPhotoList(this.model.photoList);
            })
            .catch(err => {
                this.model.photoList = [];
                const photoListEl = $('.photo-list');
                photoListEl.empty();
                photoListEl.append('<p>There was a problem to get photo album list.</p>');
            });    
    }
    /**
     * This methods sets main UI views to be rendered on the app.  
     */
    initViews() {
        const self = this;
        this.appendMainHTMLComponents();
        const headerEl = this.appEl.find('div.header');
        const bodyEl = this.appEl.find('div.body');
        const addPhotoModalEl = this.appEl.find('div#addPhotoModal');        
        headerEl.load(`${photoAddViewPath}`);
        bodyEl.load(`${photoListViewPath}`);
        addPhotoModalEl.ready(() => {
            self.setAddPhotoModalEvents();
        });
    }
    /**
     * Returns Add photo modal HTML template as string. 
     * @returns {String}
     */
    getAddPhotoModalTemplate() {
        return `<div class="modal fade" id="addPhotoModal" tabindex="-1" role="dialog" aria-labelledby="addPhotoModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addPhotoModalLabel">Upload a photo</h5>
                        <button type="button" class="close close-ev" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="photoName">Photo Name</label>
                                <input type="email" class="form-control" id="photoName" aria-describedby="emailHelp" placeholder="Enter photo name">
                            </div>
                            <div class="form-group">
                                <label for="photoDesc">Description</label>
                                <textarea rows="5" class="form-control" id="photoDesc" placeholder="Enter a description"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="photoDesc">Photo File</label>
                                <input type="file" class="form-control-file" accept=".jpg, .png" id="photoFile">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary close-ev" data-dismiss="modal">Close</button>
                        <button type="button" id="uploadPhoto" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>`;
    }
    /**
     * Returns Add-Photo's success alert HTML template as string. 
     * @returns {String}
     */
    getUploadPhotoSuccessAlertTemplate() {
        return `<div class="alert alert-success" role="alert">
            <h4>Photo uploaded successfully!</h4>
        </div>`;
    }
    /**
     * Returns Add-Photo's error alert HTML template as string. 
     * @returns {String}
     */
    getUploadPhotoFailedAlertTemplate() {
        return `<div class="alert alert-danger" role="alert">
            <h4>Couln't be able to upload a photo :(</h4>
        </div>`;
    }
    /**
     * Returns View-Photo modal HTML template as string. 
     * @returns {String}
     */
    getViewPhotoModalTemplate() {
        return `<div class="modal fade bd-example-modal-lg" id="viewPhotoModal" tabindex="-1" role="dialog" aria-labelledby="viewPhotoModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title title" id="viewPhotoModalLabel"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row d-block">
                                <div class="col-12 img-ctn">
                                    <img class="photo-img"/>
                                </div>
                            </div>
                            <div class="row d-block">
                                <div class="col-12">
                                    <p class="desc"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>`;
    }
    /**
     * This method appends the list of photos in the app. It uses card component templates from Bootstrap 4 library.
     * Sets Thumbnail element click event once a thumbnail has been rendered in app.
     * @param {Object[]} list - List of photos from Photo model. 
     * @param {number} MAX_ITEMS_PER_ROW - Max items to be set for each row in the album list view. 
     */
    renderPhotoList(list = [], MAX_ITEMS_PER_ROW = 3) {
        const photoListEl = $('.photo-list');
        const photoCtn = photoListEl.find('.row.photo-ctn');
        photoCtn.empty();        

        if (list.length > 0) {
            let index = 0;
            while (index < list.length) {
                const photoObj = list[index];
                const photoItemsTxt = `<div class="col-item col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                    <div class="card">
                        <img class="card-img-top" src="${photoObj.link}">
                        <div class="card-body">
                            <h5 class="card-title">${photoObj.name}</h5>
                            <p class="card-desc d-none">${photoObj.description}</p>
                        </div>
                    </div>
                </div>`
                photoCtn.append(photoItemsTxt);
                index++;
            }
        } else {
            photoListEl.last().append('<p>No photos to show. Please add some photos');
        }
        const cardEl = photoListEl.find('.card');
        if (cardEl.length > 0) {
            cardEl.ready(() => {
                this.setPhotoImgClickEvent();
            });
        }
    }
    /**
     * This method sets add-photo modal UI events.
     */
    setAddPhotoModalEvents() {
        const addPhotoBtnEl = this.appEl.find('button#uploadPhoto');
        addPhotoBtnEl.click(this.onUploadPhotoEventHandler.bind(this));
        const addPhotoModalCloseBtnEl = this.appEl.find('button.close-ev');
        addPhotoModalCloseBtnEl.click(this.onCloseAddPhotoModalEventHandler.bind(this));
    }
    /**
     * This method sets thumbnail element UI event (For each photo shown in app).
     */
    setPhotoImgClickEvent() {
        const photoListCtnEl = this.appEl.find('.photo-list');
        const cardEl = photoListCtnEl.find('.card');
        cardEl.click(this.onThumbnailImgClickEventHandler.bind(this));
    }
}