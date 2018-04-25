class Photo {
    constructor() {
        this.baseUrl = `http://ec2-18-221-63-71.us-east-2.compute.amazonaws.com:9000/api/`;
        // this.baseUrl = 'http://localhost:9000/api/';
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
    addPhoto(data){
        const url = `${this.baseUrl}photos/`;
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('file', data.file);
        return $.post({
            url,
            data: formData,
            processData: false, // Don't process the files
            contentType: false
        })
        .then(response => response.data)
        .catch(err => err)
    }
}
export const model = new Photo();