const divTableBody = document.getElementById('table-body');
const closeModalButton = document.getElementsByClassName('close')[0];
const criarCategoria = document.getElementById('modal');
const excluir = document.getElementById('excluir');


closeModalButton.addEventListener('click', closeModal);
consultaCategorias();


document.getElementById('add-category').addEventListener('click', function () {
    openModal('modal');
});

function confirmarExclusao(id){
    openModalComIdExcluir('confirma-exclusao',id);
}

async function alterar(categoriaId){
    const categoria = await findCategoriaById(categoriaId)
    openModalComIdAlterar('editar',categoria);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

function openModalComIdExcluir(modalId, id) {
    excluir.innerHTML = ""
    const modal = document.getElementById(modalId);
    const htmlModal = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
    <button type="button" onClick=deletarCategoria(${id}) class="btn btn-danger">Excluir</button>
    `
    excluir.innerHTML = excluir.innerHTML + htmlModal;
    modal.style.display = 'block';
}

function openModalComIdAlterar(modalId, categoria) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    const editNameInput = document.getElementById('alterandoName');
    editNameInput.value = categoria.name;

    submitBtnUpdateCategoria.addEventListener('click', () => {
        submitEditCategoria(categoria.id);
    });
    
}
  
  // Function to close the modal
  function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      modal.style.display = 'none';
    });
  }

  const closeButton = document.querySelectorAll('.close');
  closeButton.forEach((button) => {
    button.addEventListener('click', closeModal);
  });
  


const submitBtnCategoria = document.getElementById('criar-categoria')
const submitBtnUpdateCategoria = document.getElementById('alterar-categoria')

async function consultaCategorias() {
  const responseCategorias = await fetch("http://localhost:3000/categoria");
  const categorias = await responseCategorias.json();

  createTable (categorias);
}


function createTable(categorias) {
  
    categorias.forEach(categoria => {
      const novoLinhaHTML = `
        <tr>
            <td>${categoria.name}</td>
            <td>
            <i style="color: green"  onClick="alterar(${categoria.id})"  class="fa-solid fa-pen-to-square" style="padding-left: 15px" data-bs-toggle="modal" data-bs-target="#editar"></i>
            <i style="color: red" onClick="confirmarExclusao(${categoria.id})" class="delete-category fa-solid fa-trash-can" data-bs-toggle="modal" data-bs-target="#confirma-exclusao"></i>
            </td>
        </tr>
      `
      divTableBody.innerHTML = divTableBody.innerHTML + novoLinhaHTML;
    });
}


async function createCategoria(categoriaDto) {
    try {
        const response = await fetch('http://localhost:3000/categoria/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
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

async function atualizarCategoria(id, categoriaDto) {
     try {
       const response = await fetch(`http://localhost:3000/categoria/update/${id}`, { method: 'PUT',
       headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(categoriaDto)},
       );
       if (response.ok) {
         modal.style.display = 'none';
         location.reload()
       } else {
        const errorResponse = await response.json(); // Captura a resposta como um objeto JSON
        const errorMessage = errorResponse.error; // Obtém a mensagem de erro
  
        console.error('Erro ao atualizar item:', errorMessage);
       }
     } catch (error) {
       console.error('Erro ao fazer requisição', error);
     }
}

async function deletarCategoria(id) {
     try {
       const response = await fetch(`http://localhost:3000/categoria/delete/${id}`, { method: 'DELETE',
       headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        } });
       if (response.ok) {
         location.reload()
       } else {
        const errorResponse = await response.json(); // Captura a resposta como um objeto JSON
        const errorMessage = errorResponse.error; // Obtém a mensagem de erro
        console.error(errorMessage);
       }
     } catch (error) {
       console.error('Erro ao fazer requisição', error);
     }
}

async function logout() {
  try {
    const response = await fetch("http://localhost:3000/users/logout");
    if (response.ok) {
      // Redirect the user to the login page or any other page
      window.location.href = '/login';
    } else {
      console.error('Error during logout');
    }
  } catch (error) {
    console.error('Error during logout', error);
  }
}


async function findCategoriaById(id) {
    const categoriaObject = await fetch(`http://localhost:3000/categoria/${id}`);
    const categoria = await categoriaObject.json();
    return categoria;
}

function submitFormCategoria(event) {
    event.preventDefault();
    const nomeDaCategoria = document.getElementById('nameCategoria').value;
  
    const categoriaDto = {
      name: nomeDaCategoria
    };
    
    createCategoria(categoriaDto);

    nomeDaCategoria.value = '';
}

function submitEditCategoria(categoriaId) {
    event.preventDefault();
    const nomeDaCategoria = document.getElementById('alterandoName').value;
  
    const categoriaDto = {
      name: nomeDaCategoria
    };
    
    atualizarCategoria(categoriaId, categoriaDto);

}



submitBtnCategoria.addEventListener('click', submitFormCategoria)
