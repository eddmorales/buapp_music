const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/buappmusic', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("La base de datos esta corriendo correctamente");

        app.listen(port, function() {
            console.log(`Servidor api rest escuchando en http://localhost:${port}`);
        })
    }
});