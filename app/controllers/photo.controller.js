import {model} from '../models/photo.model';

const photoListViewPath = '../views/photo.html';
const photoAddViewPath = '../views/add-photo.html';

export class PhotoController {
    constructor() {
        this.appEl = $('#app');
    }
    appendMainHTMLComponents() {
        this.appEl.append('<div class="title row"><h2>Photo Album App</h2></div>');
        this.appEl.append('<div class="header row"></div>');
        this.appEl.append('<div class="body row"></div>');
    }
    initAPICalls() {
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
        this.appendMainHTMLComponents();
        const headerEl = this.appEl.find('div.header');
        const bodyEl = this.appEl.find('div.body');
        headerEl.load(`${photoAddViewPath}`);
        bodyEl.load(`${photoListViewPath}`);
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
}