const express = require('express');
const SongController = require('../controllers/song');
const md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
const md_upload = multipart({ uploadDir: './uploads/songs' });

const api = express.Router();

api.get('/get-song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/get-songs/:id?', md_auth.ensureAuth, SongController.getSongs);
api.post('/save-song', md_auth.ensureAuth, SongController.saveSong);
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = api;