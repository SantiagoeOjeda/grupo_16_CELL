const path = require('path');
const fs = require('fs');

// Requiero la base de datos
const db = require('../database/models');
const sequelize = db.sequelize;
const Op = sequelize.Op;

module.exports = {
    listar:function(req,res){
        //recorro la base de datos "productos, y envio todos los productos a su ruta"
        db.Products.findAll()
            .then(producto =>{
                res.render('products',{
                 title: 'Productos',
                 css: 'products.css',
                 products: producto
                })
            })
            .catch(error =>{
                res.send(error)
            })
    },
    /*MUESTRO EL DETALLE DEL PRODUCTO*/
    detalle:function(req,res){
        //busco en la base de datos el id del producto seleccionado.
        db.Products.findOne({
            where: {
                     id : req.params.id
            },
            include : [
                {
                    association: 'trademark'
                }
            ]
    })
            .then(producto =>{
                res.render("detailProductos",{
                    title: "Detalle del producto",
                    css: "detalle.css",
                    producto: producto,
                    trademark: producto.trademark
                })
            })
            .catch(error =>{
                res.send(error)
            })
    },
    carrito: function(req, res) {
        res.render('cart', { 
            title: 'Carrito de compras',
            css: 'cart.css',
        });
    },
    show: function(req,res){
        db.Products.findAll({
            include: [
                {
                    association: 'trademark'
                }
            ]
        })
       .then(producto => {
           //MUESTRO productShow Y LE PASO CADA VALOR PARA PODER MANIPULARLO EN DICHO ARCHIVO
           res.render('vistaProducto', {
               title: "Ver / Editar Producto",
               css: 'vistaProducto.css',
               trademark: producto.trademark,
               producto: producto,
           })
       })
       .catch(error=>{
           res.send(error)
       })

    },
    crear: function(req,res){
        //guardo los nombres en subCategorias para despues mostrarlos y ordenar el nombre alfabeticamente.
        let trademark = db.Trademark.findAll({
            order: [
                ['name','ASC']
            ]
        })
        .then(trademark =>{
            res.render('cargaproducts',{
                title:"Cargar producto",
                css: "cargaproducto.css",
                trademark: trademark
            })
        })
        .catch(error =>{
            res.send(error)
        })
    },
    agregar: function(req,res){
        //si no hay errores, entra y crea el nuevo producto
            db.Products.create({
                name: req.body.name,
                model: req.body.model,
                price: Number(req.body.price),
                colors: req.body.colors,
                company: req.body.company,
                discount:  Number(req.body.discount),
                dualsim:  req.body.dualsim,
                capacidad:  Number(req.body.capacidad),
                image: (req.files[0])?req.files[0].filename:"default.png",
                id_trademark: req.body.trademark
            })
            //redirecciono a productos para mostrar todos los productos, incluyendo el nuevo.
            .then(()=>{
                return res.redirect('/products')
            })
            .catch(error =>{
                res.send(error)
            })
    },
    formulario:function(req, res){
        let producto = db.Products.findOne({
            where : {
                id: req.params.id
            },
            include : [
                {
                    association: 'trademark'
                }
            ]
        })
        let trademark = db.Trademark.findAll()
        Promise.all([producto,trademark])
        
         .then(([producto,trademark]) =>{
            res.render('productEdit',{
            title:'Editar producto',
            css:'editProduct.css',
            producto: producto,
            trademark: trademark
        })
    })

    },
    editar: function(req,res){
        //USO LA FUNCION PARA ACTUALIZAR DATOS.
        db.Products.update({
            //GUARDO LOS DATOS NUEVOS EN CADA VARIBLE ASIGNADA.
            price : Number(req.body.price),
            colors : req.body.colors,
            company : req.body.company,
            discount : Number(req.body.discount),
            capacidad: Number(req.body.capacidad)
        },
        {
            //DEPENDE DE LA ID SELECCIONADA, SE EDITAR CADA PRODUCTO.
            where: {
                id: req.params.id
            }
        })
            .then(() => {
                //REDIRECCIONO A LA LISTA DE PRODUCTOS.
                res.redirect('/products/detail/'+req.params.id)
            })
    },
    eliminar:function(req,res){
        /* LOGICA CON JSON
         let idProducto = req.params.id;
         dbProducts.forEach(producto =>{
             if(producto.id == idProducto){
                 let aEliminar = dbProducts.indexOf(producto)
                 dbProducts.splice(aEliminar,1)
             }
         })
         fs.writeFileSync(path.join(__dirname,'../data/products.json'),JSON.stringify(dbProducts))
         res.redirect('/products')*/
         db.Products.destroy({
             where:{
               id: req.params.id
             }
           })
           .then(() =>{
             res.redirect('/products/admin')
           
         })
     }
}