const divTableBody = document.getElementById('table-curso-body');
const closeModalButton = document.getElementsByClassName('close')[0];
const excluir = document.getElementById('excluir');

async function consultaCursos() {
    const responseCursos = await fetch("http://localhost:3000/cursos");
    const cursos = await responseCursos.json();

    const responseCategorias = await fetch("http://localhost:3000/categoria");
    const categorias = await responseCategorias.json();
  
    createTableCourse(cursos, categorias)
}

function createTableCourse(cursos, categorias) {
  
    cursos.forEach(curso => {
      const categoria = categorias.find((categoria) => categoria.id === curso.categoriaId);

      const novoLinhaHTML = `
        <tr>
            <td>${curso.name}</td>
            <td style="text-align: center;">${curso.quantInscritos}</td>
            <td style="text-align: center;">${categoria.name}</td>
            <td>
            <i style="color: green"  onClick="alterar(${curso.id})"  class="fa-solid fa-pen-to-square" style="padding-left: 15px"></i>
            <i style="color: red" onClick="confirmarExclusao(${curso.id})" class="delete-category fa-solid fa-trash-can"></i>
            </td>
        </tr>
      `
      divTableBody.innerHTML = divTableBody.innerHTML + novoLinhaHTML;
    });
}

function confirmarExclusao(id){
    openModalComIdExcluir('confirma-exclusao',id);
}

function openModalComIdExcluir(modalId, id) {
    excluir.innerHTML = ""
    const modal = document.getElementById(modalId);
    const htmlModal = `
    <button type="button" onClick=deletarCursoById(${id}) class="btn btn-danger">Excluir</button>
    `
    excluir.innerHTML = excluir.innerHTML + htmlModal;
    modal.style.display = 'block';
}

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

  async function deletarCursoById(id) {
    console.log(id)
    try {
      const response = await fetch(`http://localhost:3000/cursos/delete/${id}`, { method: 'DELETE' ,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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

async function alterar(categoriaId){
    window.location.href = "/cursos-edit?id=" + categoriaId;
}

consultaCursos();
