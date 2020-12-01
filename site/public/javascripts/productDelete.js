window.addEventListener('load', function(){
    console.log('esta conectado')

    let deleteProduct = document.querySelectorAll('#eliminar');
    

    for(let i = 0; i < deleteProduct.length; i++) {
    deleteProduct[i].addEventListener('click',function(e){
        let conf = confirm('¿Estás seguro que deseas eliminar este producto?')
        if(!conf){
            e.preventDefault()
            Swal.fire({
                icon:'info',
                title: 'Excelente',
                text: 'Su producto no ha sido eliminado',
                timer:2000
            })
        } else{
          Swal.fire({
              icon : "success",
              title : 'Bien!',
              text: 'Su producto ha sido eliminado correctamente',
              timer : 3000
          })
        }
    })
}
})