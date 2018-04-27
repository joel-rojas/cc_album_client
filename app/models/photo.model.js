/**
 * @class This is the Photo model class. It defines public methods to be called in Photo controller. 
 * Those public nethods performs API calls to the server by using the API endpoint URL.
 */
class Photo {
    /**
     * @constructor Inits the API base endpoint and a public property to save all photo list items
     */
    constructor() {
        this.baseUrl = `http://ec2-18-221-63-71.us-east-2.compute.amazonaws.com:9000/api/`;
        // this.baseUrl = 'http://localhost:9000/api/';
        this.photoList = [];
    }
    /**
     * This method performs a API call in order to get a list of photos from server endpoint.
     */
    getPhotoList() {
        const url = `${this.baseUrl}photos/`;
        return $.get({
            url
        })
        .then(response => response.data)
        .catch(err => err);
    }
    /**
     * This method processes a API call in order to save a new uploaded photo to DB server and AWS S3 service.
     * @param {Object} data - Data object to use in the API call 
     */
    addPhoto(data){
        const url = `${this.baseUrl}photos/`;
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('file', data.file);
        return $.ajax({
            url,
            enctype: 'multipart/form-data',
            method: 'POST',
            dataType: 'json',
            data: formData,
            processData: false,
            contentType: false,
            success(res){}
        })
        .then(response => response.data)
        .catch(err => err)
    }
}
export const model = new Photo();