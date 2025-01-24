const bodyArticulos = document.querySelector('#articulos tbody');
const form = document.getElementById('form_crear');

let categorias;

async function cargarCategorias() {
  try {
    const response = await fetch('http://localhost:3000/api/categoria');
    if (!response.ok) {
      throw new Error('Fallo http: ' + response.status);
    }

    categorias = await response.json();
    cargarArticulos();
  } catch (e) {
    console.error('Error en el fetch de categorias: ' + e);
  }
}

async function cargarArticulos() {
  try {
    const response = await fetch('http://localhost:3000/api/articulo');

    if (!response.ok) {
      throw new Error('Fallo http');
    }
    const articulos = await response.json();

    articulos.forEach(articulo => {
      renderArticulo(articulo);
    });
  } catch (e) {
    console.error('Error en el fetch: ' + e);
  }
}

function renderArticulo(articulo) {
  let categoriasSaved = [];
  if (localStorage.categorias) {
    categoriasSaved = JSON.parse(localStorage.categorias);
  }

  if (categoriasSaved.includes(articulo.id_categoria.toString())) {
    const tr = document.createElement('tr');
    let td = document.createElement('td');
    td.textContent = articulo.id;
    tr.append(td);

    td = document.createElement('td');
    /*Esto es para que se vea el nombre de la categoria y no el id*/
    td.textContent = categorias.filter(c => c.id == articulo.id_categoria)[0].nombre
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
}
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const articulo = {
    "id_categoria": form.id_categoria.value,
    "usuario": form.usuario.value,
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
    const response = await fetch('http://localhost:3000/api/articulo', options);
    if (!response.ok) {
      throw new Error('Fallo http en el crear: ' + response.status);
    }
    const articulo = await response.json();
    renderArticulo(articulo);
  } catch (e) {
    console.error('Error en el fetch de crear: ' + e);
  }
})

cargarCategorias();