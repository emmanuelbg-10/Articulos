const bodyArticulos = document.querySelector('#articulos tbody');
const form = document.getElementById('form_crear');

let categorias = [];
let articulos = [];


async function cargarCategorias() {
  try {
    const response = await fetch('http://localhost:3000/api/categoria'); 
    if (!response.ok) {
      throw new Error('Fallo http: ' + response.status);
    }

    categorias = await response.json();
    cargarCategoriasAlmacenadas();
    //cargarArticulos();
  } catch (e) {
    console.error('Error en el fetch de categorias: ' + e);
  }
}

async function cargarCategoriasAlmacenadas() {
  let categoriasSaved = [];
  if (localStorage.categorias) {
    categoriasSaved = JSON.parse(localStorage.categorias);
  }

  for (let i=0; i<categoriasSaved.length; i++) {
    await cargarArticulosPorCategoria(categoriasSaved[i]);
  }

  articulos.forEach(articulo => {
    renderArticulo(articulo);
  });
}
cargarCategorias();

async function cargarArticulosPorCategoria(categoriaId) {
  try {
    const response = await fetch(`http://localhost:3000/api/categoria/${categoriaId}/articulo`);
    if (!response.ok) {
      throw new Error(`Fallo http al obtener artículos de la categoría ${categoriaId}: ` + response.status);
    }

    const articulosNuevos = await response.json();
    articulosNuevos.forEach(a => articulos.push(a));
  } catch (e) {
    console.error(`Error en el fetch de artículos para la categoría ${categoriaId}: ` + e);
  }
}

function renderArticulo(articulo) {

    const tr = document.createElement('tr');
    let td = document.createElement('td');
    td.textContent = articulo.id;
    tr.append(td);

    td = document.createElement('td');
    /*Esto es para que se vea el nombre de la categoria y no el id*/
    td.textContent = categorias.filter(c => c.id==articulo.id_categoria)[0].nombre
    tr.append(td);

    td = document.createElement('td');
    td.textContent = articulo.usuario;
    tr.append(td);

    td = document.createElement('td');
    td.textContent = articulo.fecha;
    tr.append(td);

    td = document.createElement('td');
    td.textContent = articulo.titulo;
    tr.append(td);

    bodyArticulos.append(tr);
  
}
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const articulo = {
    "usuario": localStorage.user,
    "password": sessionStorage.password,
    "titulo": form.titulo.value,
    "cuerpo": form.cuerpo.value
  }

  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(articulo)
  }
  console.log(options);
  try {
    const response = await fetch('http://localhost:3000/api/categoria/'+form.id_categoria.value+'/articulo_secure'  , options);
    if (!response.ok) {
      throw new Error('Fallo http en el crear: ' + response.status);
    }
    const articulo = await response.json();
    renderArticulo(articulo);
  } catch (e) {
    console.error('Error en el fetch de crear: ' + e);
  }
})