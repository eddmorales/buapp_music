const fs = require('fs');
const path = require('path');
const mongoosePagination = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getSong(req, res) {
    let songId = req.params.id;

    Song.findById(songId).populate({ path: 'album' }).exec((err, song) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!song) {
                res.status(404).send({ message: 'La canción no existe' });
            } else {
                res.status(200).send({ song });
            }
        }
    });
}

function getSongs(req, res) {
    let albumId = req.params.id;
    let finded;

    if (!albumId) {
        finded = Song.find({}).sort('number');
    } else {
        finded = Song.find({ album: albumId }).sort('number');
    }

    finded.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!songs) {
                res.status(404).send({ message: 'No hay canciones' });
            } else {
                res.status(200).send({ songs });
            }
        }
    });

}

function saveSong(req, res) {
    let song = new Song();

    let params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songSaved) => {
        if (err) {
            res.status(500).send({ message: 'Ha ocurrido un error en la petición' });
        } else {
            if (!songSaved) {
                res.status(404).send({ message: 'La canción no se ha guardado' });
            } else {
                res.status(200).send({ song: songSaved });
            }
        }
    });
}

function updateSong(req, res) {
    let songId = req.params.id;
    let newData = req.body;

    Song.findByIdAndUpdate(songId, newData, (err, songUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Ha ocurrido un error en la petición' });
        } else {
            if (!songUpdated) {
                res.status(404).send({ message: 'La canción no se ha actualizado' });
            } else {
                res.status(200).send({ song: songUpdated });
            }
        }
    });
}

function deleteSong(req, res) {
    let songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Ha ocurrido un error en la petición' });
        } else {
            if (!songDeleted) {
                res.status(404).send({ message: 'La canción no se ha borrado' });
            } else {
                res.status(200).send({ song: songDeleted });
            }
        }
    });
}

function uploadFile(req, res) {
    let songId = req.params.id;
    let file_name = 'vacio';

    if (req.files) {
        let file_path = req.files.file.path;
        let file_split = file_path.split('\\');
        file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if (file_ext == 'mp3' || file_ext == 'ogg') {
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'No se ha podido actualizar la imagen' });
                } else {
                    if (!songUpdated) {
                        res.status(404).send({ message: 'No se ha popido subir el archivo' });
                    } else {
                        res.status(200).send({ song: songUpdated });
                    }
                }
            });
        } else {
            res.status(200).send({ message: 'Extensión del archivo no valida' });
        }
    } else {
        res.status(200).send({ message: 'No se ha subido ningpun archivo' });
    }
}

function getSongFile(req, res) {
    let songFile = req.params.songFile;
    let path_file = `./uploads/songs/${songFile}`;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'El archivo de audio no existe' });
        }
    });
}

module.exports = {
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};