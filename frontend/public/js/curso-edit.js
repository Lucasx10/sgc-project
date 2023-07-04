const submitBtnUpdateCategoria = document.getElementById('alterar-curso')

async function getID(){
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    console.log("hello")
    const curso = await findCursoById(id);
    console.log("curso.id")
    preencheEdit(curso)
}

async function preencheEdit(curso) {
    const categoriaCurso = await findCategoriaById(curso.categoriaId)

    const previewImageInput = document.getElementById('preview');
    previewImageInput.src = `/images/cards/${curso.image}`;

    const editNameInput = document.getElementById('name');
    editNameInput.value = curso.name;

    const descriptionInput = document.getElementById('description');
    descriptionInput.value = curso.description;

    const chInput = document.getElementById('ch');
    chInput.value = curso.ch;

    //Fazer a opção Categoria ser selecionada
    const selectCategoriasInput = document.getElementById('selectCategorias');
    selectCategoriasInput.value = categoriaCurso.id;
    
    


    submitBtnUpdateCategoria.addEventListener('click', () => {
        submitEditCurso(curso.id);
    });
}

function categorias(){
    fetch('http://18.231.150.50:3000/categoria')
  .then(response => response.json())
  .then(data => {
    // Obtém o elemento select do HTML
    const selectElement = document.getElementById('selectCategorias');

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione a categoria';

    // Adiciona a opção "Selecione a categoria" ao início do select
    selectElement.appendChild(defaultOption);

    // Itera sobre os dados das categorias e cria as opções do select
    data.forEach(categoria => {
      // Cria uma nova opção
      const optionElement = document.createElement('option');
      
      // Define o valor e o texto da opção como o nome da categoria
      optionElement.value = categoria.id;
      optionElement.textContent = categoria.name;

      // Adiciona a opção ao elemento select
      selectElement.appendChild(optionElement);
    });
  })
  .catch(error => {
    console.error('Ocorreu um erro ao obter as categorias:', error);
  });
}

async function findCategoriaById(id) {
    const categoriaObject = await fetch(`http://18.231.150.50:3000/categoria/${id}`);
    const categoria = await categoriaObject.json();
    return categoria;
}


async function findCursoById(id) {
    const cursoResponse= await fetch(`http://18.231.150.50:3000/cursos/page/${id}`);
    const curso = await cursoResponse.json();
    return curso;
}

function submitEditCurso(cursoId) {
    event.preventDefault();
    const editNameInput = document.getElementById('name').value;
    const descriptionInput = document.getElementById('description').value;
    const chInput = document.getElementById('ch').value;
    const image = "logica.png";
    const data_start = "20/07/2023";
    const categoriaId = document.getElementById('selectCategorias').value;
    
    //Revisar os campos de imagem e data
    const cursoDto = {
      name: editNameInput,
      image: image,
      description: descriptionInput,
      ch: chInput,
      date_start: data_start,
      categoriaId: categoriaId
    };
    
    atualizarCurso(cursoId, cursoDto);

}

async function atualizarCurso(id, cursoDto) {
    console.log("chegou-aqui")
    try {
      const response = await fetch(`http://18.231.150.50:3000/cursos/update/${id}`, { method: 'PUT',
      headers: {
       'Content-Type': 'application/json'
       },
       body: JSON.stringify(cursoDto)},
      );
      if (response.ok) {
        location.reload()
      } else {
        console.error('Erro ao atualizar item');
      }
    } catch (error) {
      console.error('Erro ao fazer requisição', error);
    }
}

getID()
categorias()