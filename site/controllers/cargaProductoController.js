const path = require('path');

module.exports = {
    index: function(req, res){
        res.render('cargaProducts', { title: 'Carga de productos' });
    }
}