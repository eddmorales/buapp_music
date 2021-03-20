const express = require('express');
const AlbumController = require('../controllers/album');
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/albums' });

const api = express.Router();

api.get('/get-album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/get-albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.post('/save-album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;