const divTableBody = document.getElementById('table-body');
const openModalButton = document.getElementById('add-category');

const closeModalButton = document.getElementsByClassName('close')[0];

const submitBtnCategoria = document.getElementById('criar-categoria')

async function consultaCategorias() {
  const responseCategorias = await fetch("http://localhost:3000/categoria");
  const categorias = await responseCategorias.json();

  createTable   (categorias);
}


function createTable(categorias) {
  
    categorias.forEach(categoria => {
      const novoLinhaHTML = `
        <tr>
            <td>${categoria.name}</td>
            <td>
            <i style="color: green"  class="fa-solid fa-pen-to-square" style="padding-left: 15px"></i>
            <i style="color: red" onclick="deletarCategoria(${categoria.id})" class="fa-solid fa-trash-can"></i>
            </td>
        </tr>
      `
  
      divTableBody.innerHTML = divTableBody.innerHTML + novoLinhaHTML;
    });
}

async function deletarCategoria(id) {
    console.log("fui chamado")
     try {
       const response = await fetch(`http://localhost:3000/categoria/delete/${id}`, { method: 'DELETE' });
       if (response.ok) {
         location.reload()
       } else {
         console.error('Erro ao deletar item');
       }
     } catch (error) {
       console.error('Erro ao fazer requisição', error);
     }
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
      const response = await fetch('http://localhost:3000/categoria/create', {
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
    modal.style.display = 'none';
};

submitBtnCategoria.addEventListener('click', submitFormCategoria)

consultaCategorias();