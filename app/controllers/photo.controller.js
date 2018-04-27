import {model} from '../models/photo.model';
import {uiUtils} from '../utils/ui.conf';

const photoListViewPath = '../views/photo.html';
const photoAddViewPath = '../views/add-photo.html';

export class PhotoController {
    constructor() {
        this.appEl = $('#app');
        this.resizeTimeout = null;
        this.currentWidth = window.innerWidth;
        this.uiUtils = uiUtils;
        this.model = model;
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
        this.onCloseAddPhotoModalEventHandler = (ev) => {
            const modal = this.appEl.find('div#addPhotoModal');
            const photoNameEl = modal.find('#photoName');
            const photoDescEl = modal.find('#photoDesc');
            const photoFileEl = modal.find('#photoFile');
            photoNameEl.val('');
            photoDescEl.val('');
            photoFileEl.val(null);
        };
        this.onThumbnailImgClickEventHandler = (ev) => {
            const currentEl = $(ev.target);
            const parentEl = currentEl.parent();
            const photoImgSrc = parentEl.find('img').attr('src');
            const nameTxt = parentEl.find('p.title').text();
            const descTxt = parentEl.find('p.desc').text();
            const viewPhotoModalEl = this.appEl.find('#viewPhotoModal');
            viewPhotoModalEl.find('img.photo-img').attr('src', photoImgSrc);
            viewPhotoModalEl.find('h4.title').text(nameTxt);
            viewPhotoModalEl.find('p.desc').text(descTxt);
            viewPhotoModalEl.modal('show');
        };
        this.onResizeFn = () => {
            this.currentWidth = window.innerWidth;
            const cardLayoutEl = this.appEl.find('.card-deck');
            const cardEl = cardLayoutEl.find('.card');
            if (cardEl.length > 0) {
                cardEl.ready(() => {
                    this.setPhotoListUI();
                });
            }
        }
        this.onResizeScreenEventHandler = (ev) => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(this.onResizeFn.bind(this), 100);
        };
        this.setScreenResizeEvent();
    }
    appendMainHTMLComponents() {
        this.appEl.append('<div class="title row"><h2 class="col-12 col-md-12">Photo Album App</h2></div>');
        this.appEl.append('<div class="header row"></div>');
        this.appEl.append('<div class="body row"></div>');
        this.appEl.append(this.getAddPhotoModalTemplate());
        this.appEl.append(this.getViewPhotoModalTemplate());
    }
    getPhotoListAPICall() {
        this.model.getPhotoList()
            .then(data => {
                this.model.photoList = Object.assign([], data);
                this.setPhotoListUI();
            })
            .catch(err => {
                this.model.photoList = [];
                const photoListEl = $('.photo-list');
                photoListEl.empty();
                photoListEl.append('<p>There was a problem to get photo album list.</p>');
            });    
    }
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
    getUploadPhotoSuccessAlertTemplate() {
        return `<div class="alert alert-success" role="alert">
            <h4>Photo uploaded successfully!</h4>
        </div>`;
    }
    getUploadPhotoFailedAlertTemplate() {
        return `<div class="alert alert-danger" role="alert">
            <h4>Couln't be able to upload a photo :(</h4>
        </div>`;
    }
    getViewPhotoModalTemplate() {
        return `<div class="modal fade bd-example-modal-lg" id="viewPhotoModal" tabindex="-1" role="dialog" aria-labelledby="viewPhotoModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12 col-md-8">
                                <img class="photo-img"/>
                            </div>
                            <div class="col-12 col-md-4">
                                <h4 class="title"></h4>
                                <p class="desc"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
    renderPhotoList(list = [], MAX_ITEMS_PER_ROW = 3) {
        const photoListEl = $('.photo-list');
        photoListEl.empty();
        photoListEl.addClass('col-12');
        photoListEl.addClass('col-md-12');

        const cardLayoutElTxt = '<div class="card-deck"></div>'
        photoListEl.append(cardLayoutElTxt);

        let deckCounter = 1;
        let cardCounter = 0;
        
        if (list.length > 0) {
            let aCardDeckEl = photoListEl.find('.card-deck');
            aCardDeckEl.addClass(`cdeck-${deckCounter}`);
            list.forEach((photo, index, arr) => {
                cardCounter++;                
                const deckEl = photoListEl.find(`div.cdeck-${deckCounter}`);
                const cardElTxt = `<div class="card card-${cardCounter}">
                    <img class="card-img-top" src="${photo.link}">
                    <div class="card-body">
                        <h5 class="card-title">${photo.name}</h5>
                        <p class="desc d-none">${photo.description}</p>
                    </div>
                </div>`;
                deckEl.append(cardElTxt);                
                const lastItem = arr[arr.length - 1];
                if (lastItem.id === photo.id && cardCounter < MAX_ITEMS_PER_ROW) {
                    const widthMap = this.uiUtils.getScreenWidth();
                    if (this.currentWidth > widthMap.sm) {
                        let leftItems = MAX_ITEMS_PER_ROW - cardCounter;
                        while (leftItems != 0) {
                            const invisibleCardElTxt = '<div class="card invisible"></div>';
                            deckEl.append(invisibleCardElTxt);
                            leftItems--;
                        }
                    }
                }
                if (cardCounter === MAX_ITEMS_PER_ROW && arr.length > (MAX_ITEMS_PER_ROW * deckCounter)) {
                    cardCounter = 0;
                    deckCounter++;
                    photoListEl.append(cardLayoutElTxt);
                    aCardDeckEl = photoListEl.find('div.card-deck').last();
                    aCardDeckEl.addClass(`cdeck-${deckCounter}`);
                }
            });
        } else {
            photoListEl.last().append('<p>No photos to show. Please add some photos');
        }
        const thumbnailEl = photoListEl.find('.thumbnail');
        if (thumbnailEl.length > 0) {
            thumbnailEl.ready(() => {
                this.setPhotoImgClickEvent();
            });
        }
        
    }
    setAddPhotoModalEvents() {
        const addPhotoBtnEl = this.appEl.find('button#uploadPhoto');
        addPhotoBtnEl.click(this.onUploadPhotoEventHandler.bind(this));
        const addPhotoModalCloseBtnEl = this.appEl.find('button.close-ev');
        addPhotoModalCloseBtnEl.click(this.onCloseAddPhotoModalEventHandler.bind(this));
    }
    setPhotoImgClickEvent() {
        const photoListCtnEl = this.appEl.find('.photo-list');
        const thumbnailEl = photoListCtnEl.find('.thumbnail');
        thumbnailEl.click(this.onThumbnailImgClickEventHandler.bind(this));
    }
    setPhotoListUI() {
        const widthMap = this.uiUtils.getScreenWidth();
        if (this.currentWidth >= widthMap.sm && this.currentWidth < widthMap.md) {
            this.renderPhotoList(this.model.photoList, 2);
        } else {
            this.renderPhotoList(this.model.photoList);
        }
    }
    setScreenResizeEvent() {
        $(window).resize(this.onResizeScreenEventHandler.bind(this));
    }
}