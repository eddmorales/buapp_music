const express = require('express');
const ArtistController = require('../controllers/artist');
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/artists' });

const api = express.Router();

api.get('/get-artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/get-artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.post('/save-artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/delete-artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;