const fs = require('fs');
const path = require('path');
const mongoosePagination = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getAlbum(req, res) {
    const albumId = req.params.id;

    Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!album) {
                res.status(404).send({ message: 'El album no existe' });
            } else {
                res.status(200).send({ album });
            }
        }
    });
}

function getAlbums(req, res) {
    const artistId = req.params.artist;
    let find;

    if (!artistId) {
        // Si no existe el id del artista, sacamos todos los albums
        find = Album.find({}).sort('title');
    } else {
        // Sacar los albums del artista buscado
        find = Album.find({ artist: artistId }).sort('year');
    }

    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!albums) {
                res.status(404).send({ message: 'Los albums no existen' });
            } else {
                res.status(200).send({ albums });
            }
        }
    });
}

function saveAlbum(req, res) {
    let album = new Album();

    let params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, storedAlbum) => {
        if (err) {
            res.status(500).send({ message: "Error en la petición" });
        } else {
            if (!storedAlbum) {
                res.status(404).send({ message: "No se ha podido guardar el album" });
            } else {
                res.status(200).send({ album: storedAlbum });
            }
        }
    });
}

function updateAlbum(req, res) {
    let albumId = req.params.id;
    let newData = req.body;

    Album.findByIdAndUpdate(albumId, newData, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Hay una error en la petición' });
        } else {
            if (!albumUpdated) {
                res.status(404).send({ message: 'No se pudo actualizar el album' });
            } else {
                res.status(200).send({ albumUpdated });
            }
        }
    });
}

function deleteAlbum(req, res) {
    let albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!albumDeleted) {
                res.status(404).send({ message: 'El album no se pudo eliminar' });
            } else {
                Song.find({ album: albumDeleted._id }).remove((err, songDeleted) => {
                    if (err) {
                        res.status(500).send({ message: 'Error en la petición' });
                    } else {
                        if (!songDeleted) {
                            res.status(404).send({ message: 'La canción no se pudo eliminar' });
                        } else {
                            res.status(200).send({ album: albumDeleted });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    let albumtId = req.params.id;
    let file_name = 'vacio';

    if (req.files) {
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumtId, { image: file_name }, (err, albumUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'No se ha podido actualizar la imagen' });
                } else {
                    if (!albumUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar el album' });
                    } else {
                        res.status(200).send({ album: albumUpdated });
                    }
                }
            });
        } else {
            res.status(200).send({ message: 'Extensión del archivo no valida' });
        }
    } else {
        res.status(200).send({ message: 'No se ha subido ninguna imagen' });
    }
}

function getImageFile(req, res) {
    let imageFile = req.params.imageFile;
    let path_file = `./uploads/albums/${imageFile}`;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'La imagen no existe' });
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}