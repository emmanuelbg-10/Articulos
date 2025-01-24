const divCategories = document.getElementById('categorias')

fetch('http://localhost:3000/api/categoria')
  .then(res => res.json())
  .then(categories => categories.forEach(c => {
    renderInputCategory(c);
  }));

function renderInputCategory(category) {
  let checked = '';
  console.log(category.id.toString());
  if (localStorage.categorias) {
    const categoriasChecked = JSON.parse(localStorage.categorias);

    checked = categoriasChecked.includes(category.id.toString()) ? 'checked' : '';
  }

  divCategories.insertAdjacentHTML('beforeend', `
    <p>
      <input type="checkbox" name="categories[]" id="op${category.id}" value="${category.id}" ${checked}
      <label for="op${category.id}">${category.nombre}</label>
    </p>
    `)
}

const actualizar = document.querySelector('[name = actualizar]');
actualizar.addEventListener("click", () => {
  const categorias = document.querySelectorAll('div input');
  const categoriasChecked = Array.from(categorias)
    .filter(categoria => categoria.checked)  // Filtra solo las categorías que están seleccionadas
    .map(categoria => categoria.value);  // Mapea solo los valores de las categorías seleccionadas

  localStorage.setItem('categorias', JSON.stringify(categoriasChecked));  // Usamos setItem para almacenar en localStorage
})