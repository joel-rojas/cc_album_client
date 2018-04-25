class Photo {
    constructor() {
        this.baseUrl = `http://ec2-18-221-63-71.us-east-2.compute.amazonaws.com:9000/api/`;
        this.photoList = [];
    }
    getPhotoList() {
        const url = `${this.baseUrl}photos/`;
        return $.get({
            url
        })
        .then(response => response.data)
        .catch(err => err);
    }
    addPhoto(options){}
}
export const model = new Photo();