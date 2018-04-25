import {model} from '../models/photo.model';

const photoListViewPath = '../views/photo.html';
const photoAddViewPath = '../views/add-photo.html';

export class PhotoController {
    constructor() {
        this.appEl = $('#app');
        this.onUploadPhotoEventHandler = (ev) => {
            const modal = this.appEl.find('div#addPhotoModal');
            const modalContentEl = modal.find('modal-content');
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
            model.addPhoto(data)
                .then(res => {
                    this.getPhotoListAPICall();                    
                    modalContentEl.append(this.getUploadPhotoSuccessAlertTemplate());
                    setTimeout(() => {
                       const alert = $('div.alert-success');
                       alert.alert('close');
                    }, 2000);
                })
                .catch(err => {
                    modalContentEl.append(this.getUploadPhotoFailedAlertTemplate());
                    setTimeout(() => {
                        const alert = $('div.alert-danger');
                        alert.alert('close');
                     }, 2000);
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
    }
    appendMainHTMLComponents() {
        this.appEl.append('<div class="title row"><h2>Photo Album App</h2></div>');
        this.appEl.append('<div class="header row"></div>');
        this.appEl.append('<div class="body row"></div>');
        this.appEl.append(this.getAddPhotoModalTemplate());
    }
    getPhotoListAPICall() {
        model.getPhotoList()
            .then(data => {
                model.photoList = Object.assign([], data);                
                this.renderPhotoList(model.photoList);
            })
            .catch(err => {
                model.photoList = [];
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
    renderPhotoList(list = []) {
        const photoListEl = $('.photo-list');
        photoListEl.empty();
        photoListEl.addClass('col-12');
        photoListEl.addClass('col-md-12');

        let rowCounter = 1;
        const MAX_ITEMS_PER_ROW = 4;
        const rowElTxt = '<div class="row"></div>';
        
        photoListEl.append(rowElTxt);
        if (list.length > 0) {
            let aRow = photoListEl.find('div.row');
            aRow.addClass(`row-${rowCounter}`);
            list.forEach(photo => {
                const row = photoListEl.find(`div.row-${rowCounter}`);
                const thumbnailElTxt = `<div class="col-3 col-md-3">
                    <div class="thumbnail" id="item-${photo.id}">
                        <img class="img-thumbnail" src="${photo.link}"/>
                        <p class="title">${photo.name}</p>
                    </div>                
                </div>`;
                row.append(thumbnailElTxt);
                if (photo.id % MAX_ITEMS_PER_ROW === 0) {
                    rowCounter++;
                    photoListEl.append(rowElTxt);
                    aRow = photoListEl.last();
                    aRow.addClass(`row-${rowCounter}`);
                }
            });
        } else {
            photoListEl.last().append('<p>No photos to show. Please add some photos');
        }  
    }
    setAddPhotoModalEvents() {
        const addPhotoBtnEl = this.appEl.find('button#uploadPhoto');
        addPhotoBtnEl.click(this.onUploadPhotoEventHandler.bind(this));
        const addPhotoModalCloseBtnEl = this.appEl.find('button.close-ev');
        addPhotoModalCloseBtnEl.click(this.onCloseAddPhotoModalEventHandler.bind(this));
    }
}