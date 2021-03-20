const fs = require('fs');
const path = require('path');
const mongoosePagination = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');


function getArtist(req, res) {
    let artistId = req.params.id;

    Artist.findById(artistId, (err, artistFinded) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!artistFinded) {
                res.status(404).send({ message: 'Artista no encontrado' });
            } else {
                res.status(201).send({ artist: artistFinded });
            }
        }
    });
}

function getArtists(req, res) {
    let page;
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = 1;
    }

    const itemsPerPage = 4;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!artists) {
                res.status(404).send({ message: 'No hay artistas que mostrar' });
            } else {
                res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });
}

function saveArtist(req, res) {
    let artist = new Artist();
    let params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    if (artist.name != '' && artist.description != '') {
        artist.save((err, artistStored) => {
            if (err) {
                res.status(500).send({ message: 'No se pudo realizar la petición' });
            } else {
                if (!artistStored) {
                    res.status(400).send({ message: 'No se pudo guardar el nuevo artista' });
                } else {
                    res.status(200).send({ artist: artistStored });
                }
            }
        });
    } else {
        res.status(200).send({ message: 'Por favor llena todos los campos' });
    }
}

function updateArtist(req, res) {
    let artistId = req.params.id;
    let update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Hubo un error en la petición' });
        } else {
            if (!artistUpdated) {
                res.status(200).send({ message: 'No se ha podido actualizar el artista' });
            } else {
                res.status(200).send({ artist: artistUpdated });
            }
        }
    });
}

function deleteArtist(req, res) {
    let artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición de eliminar un artista' });
        } else {
            if (!artistDeleted) {
                res.status(400).send({ message: 'No se pudo eliminar el artista' });
            } else {
                Album.find({ artist: artistDeleted._id }).remove((err, albumDeleted) => {
                    if (err) {
                        res.status(500).send({ message: 'Error en la petición de eliminar album' });
                    } else {
                        if (!albumDeleted) {
                            res.status(400).send({ message: 'No se pudo eliminar el album' });
                        } else {
                            Song.find({ album: albumDeleted._id }).remove((err, songDeleted) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error en la petición de eliminar una canción' });
                                } else {
                                    if (!songDeleted) {
                                        res.status(400).send({ message: 'No se pudo eliminar la canción' });
                                    } else {
                                        res.status(200).send({ artis: artistDeleted });
                                    }
                                }
                            })
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    let artistId = req.params.id;
    let file_name = 'vacio';

    if (req.files) {
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'No se ha podido actualizar la imagen' });
                } else {
                    res.status(200).send({ artist: artistUpdated });
                }
            });
        }
    } else {
        res.status(200).send({ message: 'No se ha subido ninguna imagen' });
    }
}

function getImageFile(req, res) {
    let imageFile = req.params.imageFile;
    let path_file = `./uploads/artists/${imageFile}`;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'La imagen no existe' });
        }
    });
}

module.exports = {
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};