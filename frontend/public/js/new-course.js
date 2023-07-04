const submitBtn = document.getElementById('criar-curso')
const submitBtnCategoria = document.getElementById('criar-categoria')
const modal = document.getElementById('modal');
const openModalButton = document.getElementById('add-category');
const closeModalButton = document.getElementsByClassName('close')[0];

let nomedaImagem;

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

  function previewImage(event) {
    var input = event.target;
    var preview = document.getElementById('preview');
    
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        preview.src = e.target.result;
       preview.classList += "w-25";
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


function submitForm(event) {
        event.preventDefault()
        const image = nomedaImagem;
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const ch = document.getElementById('ch').value;
        const categoriaId = document.getElementById('selectCategorias').value;

        const dto = { 
            name: name, 
            image: image,
            description: description,
            ch: ch,
            quantInscritos: 0, 
            date_start: new Date(),
            categoriaId: categoriaId
        };
        console.log(dto)
        sendToAPI(dto)
}
    

async function sendToAPI(dto){
    const respostaAPI = await fetch('http://18.231.150.50:3000/cursos/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
    .then(response =>{ 
      response.json();})
    .catch(error => {
      console.error('Erro:', error);
      
    });
}


function submitFormCategoria(event) {
  event.preventDefault();
  const nomeDaCategoria = document.getElementById('nameCategoria').value;

  const categoriaDto = {
    name: nomeDaCategoria
  };
  
  createCategoria(categoriaDto);
}


async function createCategoria(categoriaDto) {
    try {
      const response = await fetch('http://18.231.150.50:3000/categoria/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoriaDto)
      });
  
      if (response.ok) {
        modal.style.display = 'none'; // Fecha o modal
        window.location.reload(); // Atualiza a página
      } else {
        // Lidar com erros de resposta da API, se necessário
        console.error('Erro ao criar categoria:', response.status);
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
}

openModalButton.onclick = function() {
    modal.style.display = "block";
};

closeModalButton.onclick = function() {
    modal.style.display = 'none'; // Fecha o modal
};


submitBtnCategoria.addEventListener('click', submitFormCategoria)
submitBtn.addEventListener('click', submitForm)
