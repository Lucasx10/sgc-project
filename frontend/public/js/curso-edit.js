const submitBtnUpdateCurso = document.getElementById('alterar-curso')
let nomedaImagem;

async function getID(){
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    const curso = await findCursoById(id);
    preencheEdit(curso)
}

function previewImage(event) {
  var input = event.target;
  var preview = document.getElementById('preview');
  
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    
    reader.onload = function(e) {
      preview.src = e.target.result;
    //  preview.classList += "w-25";
    };
    
    reader.readAsDataURL(input.files[0]);
  }

  const fileInput = event.target; // Campo de entrada de arquivo
  const file = fileInput.files[0]; // Obtém o arquivo selecionado
  const fileName = file.name; // Obtém o nome do arquivo
  nomedaImagem = fileName

  // Verifica se um arquivo foi selecionado
  if (file) {
    const formData = new FormData(); // Cria um objeto FormData
    formData.append('image', file, fileName); // Adiciona o arquivo ao FormData com o nome original

    // Faz a requisição para enviar o arquivo para o servidor
    fetch('http://18.231.150.50:3000/cursos/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response.ok) {
          console.log('Imagem enviada com sucesso');
        } else {
          console.error('Erro ao enviar imagem:', response.status);
        }
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
  }
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
    
    


    submitBtnUpdateCurso.addEventListener('click', () => {
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
    const image = nomedaImagem;
    const data_start = new Date();
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
    
    try {
      const response = await fetch(`http://18.231.150.50:3000/cursos/update/${id}`, { method: 'PUT',
      headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${sessionStorage.getItem('token')}`
       },
       body: JSON.stringify(cursoDto)},
      );
      if (response.ok) {
        location.reload()
      } else {
        const errorResponse = await response.json(); // Captura a resposta como um objeto JSON
        const errorMessage = errorResponse.error; // Obtém a mensagem de erro
        window.alert(errorMessage);
      }
    } catch (error) {
      console.error('Erro ao fazer requisição', error);
    }
}

getID()
categorias()