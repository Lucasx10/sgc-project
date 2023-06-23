const DivMostraUser = document.querySelector("#mostra-user"); 

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
}

const userId = localStorage.getItem('id'); 
consultaUser(userId);

async function consultaUser(id) {
  const response = await fetch(`http://localhost:3000/users/${id}`); 
  const user = await response.json();

  preencheTelaUser(user);
  console.log("aqui");
};

function preencheTelaUser(user) {
  const UserSelecionado = `
    <nav class="navbar navbar-expand-xl">
          <div class="container h-100">
            <a class="navbar-brand" href="/"></a>
            <div class="tools-account container mt-5 d-flex  align-items-center">
              <div class="row justify-content-center">
                <h2 class="mt-3 text-center fw-bold mb-5">Configurações da Conta</h2>
                <form action="" class="ativo row" method="post" id="entrar" enctype="multipart/form-data">
                  <img id="preview" src="${user.image}" alt=""/>
                  <div class="form-group col-6">
                    <div>
                      <label for="image" class="mb-1">Atualizar Foto</label>
                      <input type="file" class="form-control" id="formFile" onchange="previewImage(event)"
                        name="file"
                        accept="image/*"
                      />

                    </div>
                  </div>
              
                  <div class="form-group col-6">
                    <label for="email" class="mb-1">E-mail</label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    class="form-control validate"
                    value="${user.email}"
                    />
                  </div>
                  <div class="form-group col-6">
                    <label for="name" class="mb-1">Nome</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      class="form-control validate"
                      value="${user.name}"
                    />
                  </div>
                  <div class="form-group col-6">
                    <label for="whatsapp" class="mb-1">Celular</label>
                    <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    class="form-control validate"
                    value="${user.whatsapp}"
                    />
                  </div>
                  <div class="form-group col-6">
                    <label for="password" class="mb-1">Senha</label>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    class="form-control validate"
                    />
                </div>
                <div class="form-group col-6">
                  <label for="password2" class="mb-1">Redefinir senha</label>
                  <input
                  id="password2"
                  name="password2"
                  type="password"
                  class="form-control validate"
                  />
                </div>
                <div class="d-flex w-100 justify-content-center">
                  <button
                  type="submit"
                    class="submit-button-active btn btn-primary text-uppercase mt-3 me-4 w-50"
                    >Atualizar dados
                  </button><button
                  type="submit"
                  class="submit-button-active btn btn-primary text-uppercase mt-3 w-50"
                  >Deletar conta
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        </div>
  `
  DivMostraUser.innerHTML = UserSelecionado;

  // Obtém uma referência para o formulário
  const form = document.getElementById('entrar');

  // Adiciona um listener para o evento de envio do formulário
  form.addEventListener('submit', atualizarDados);
}


function atualizarDados(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const whatsapp = document.getElementById('whatsapp').value;
  const oldPassword = document.getElementById('password').value;
  const newPassword = document.getElementById('password2').value;

  const dadosAtualizados = {
    email,
    name,
    whatsapp,
    oldPassword,
    newPassword
  };
  console.log(dadosAtualizados)
  fetch(`http://localhost:3000/users/update/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dadosAtualizados),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Dados atualizados:', data);
      //location.reload()
    })
    .catch(error => {
      console.error('Erro ao atualizar os dados:', error);
    });
}