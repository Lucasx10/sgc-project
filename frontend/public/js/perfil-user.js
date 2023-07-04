const DivMostraUser = document.querySelector("#mostra-user"); 
let nomedaImagem;

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
      fetch('http://18.231.150.50:3000/users/upload', {
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

const userId = localStorage.getItem('id'); 
consultaUser(userId);

async function consultaUser(id) {
  const response = await fetch(`http://18.231.150.50:3000/users/${id}`); 
  const user = await response.json();

  preencheTelaUser(user);
  console.log("aqui");
};

function preencheTelaUser(user) {
  const UserSelecionado = `
    <nav class="navbar navbar-expand-xl">
          <div class="container h-100">
            <a class="navbar-brand" href="/"></a>
            <div class="perfil container mt-2 d-flex  align-items-center">
              <div class="row justify-content-center">
                <h2 class="mt-2 text-center fw-bold mb-3">Configurações da Conta</h2>
                <form action="" class="ativo row" method="post" id="entrar" enctype="multipart/form-data">
                  <div class="center-image mb-3 text-center">
                  <img id="preview" src="../images/usuarios/${user.image}" alt=""/>
                  </div>
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
                    <label for="name" class="mb-1">Nome</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      class="form-control validate"
                      value="${user.name}"
                      placeholder="Insira seu nome"
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
                  placeholder="Número de celular"
                  />
                </div>

                  <div class="form-group col-6">
                    <label for="email" class="mb-1">E-mail</label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    class="form-control validate"
                    value="${user.email}"
                    placeholder="Insira seu e-mail"
                    />
                  </div>
                  <div class="form-group col-6 w-100">
                    <label for="endereco" class="mb-1 w-100">Endereço</label>
                    <input
                    id="endereco"
                    name="endereco"
                    type="endereco"
                    class="form-control validate"
                    placeholder="Rua, Nº, Bairro"
                    />
                  </div>
                  <div class="form-group col-6">
                    <label for="password2" class="mb-1">Redefinir senha</label>
                    <input
                    id="password2"
                    name="password2"
                    type="password"
                    class="form-control validate"
                    placeholder="Insira uma nova senha"
                    />
                  </div>
                  <div class="form-group col-6 ">
                    <label for="password" class="mb-1">Senha</label>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    class="form-control validate"
                    placeholder="Senha antiga"
                    />
                  </div>
                <div class="py-2 mt-3 text-center">
                  <button
                  type="submit"
                    class="submit-button-active submit btn btn-primary col-2 text-uppercase w-100"
                    >Atualizar dados
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

  const foto = nomedaImagem;
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const whatsapp = document.getElementById('whatsapp').value;
  const oldPassword = document.getElementById('password').value;
  const newPassword = document.getElementById('password2').value;

  const dadosAtualizados = {
    email,
    name,
    image: foto,
    whatsapp,
    oldPassword,
    newPassword
  };
  console.log(dadosAtualizados)
  fetch(`http://18.231.150.50:3000/users/update/${userId}`, {
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