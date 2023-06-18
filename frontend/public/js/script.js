const btns = document.querySelectorAll('.btns-login button')
const allInputs = document.querySelectorAll('.ct-input input')
const inputsCriarConta = document.querySelectorAll('#criar .ct-input input')
const alertas = document.querySelectorAll('.alert')
const submitBtn = document.querySelector('#submit-conta')
const submitBtnLogin = document.querySelector('#logado')
const inputSenhaRpt = document.querySelector('#senharpt')
const termosInput = document.querySelector('#termos')
const btnDarkmode = document.querySelector('.lightdarkmode')
let inputField

//A senha deve possuir, ao menos, 10 caracteres. Letras maiusculas e minusculas (obrigatorio), caracteres especiais (@:;<.>/*-+_+(*%¨&*()||\'"!@#$$%"), e umnumero, 
const regex = {
    usuario: /^\w{5,}/,
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    senha: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    senharpt: undefined
}

allInputs.forEach((item) => {
item.addEventListener('keydown', (k) => {
    if (k.keyCode === 32) {
        k.preventDefault()
    }
})
})

function changeForm(i){

    for (let form of document.forms) form.classList.remove('ativo')
    for (let btn of btns) btn.classList.remove('ativo')

    document.forms[i].classList.add('ativo')
    btns[i].classList.add('ativo')

}

btns.forEach((item, index) => {

    item.addEventListener('click', () => {
        changeForm(index)
    })

})


function contemClasse(classe) {
    return inputField.classList.contains(classe);
}

function eliminarClasse(classe) {
    inputField.classList.remove(classe);
}    


function validateInput(input, index) {

    const { value, id } = input;
    inputField = input.parentElement;

    if (contemClasse('invalido')) eliminarClasse('invalido');
    if (contemClasse('valido')) eliminarClasse('valido');

    if (regex[id]) {
        if (!(value).match(regex[id])) {
            alertas[index].style.display = 'block';
            inputField.classList.add('invalido');
        } else {
            alertas[index].style.display = 'none';
            inputField.classList.add('valido');
        }
    }

    if (id === 'senha') {
        regex.senharpt = new RegExp('^' + value + '$');
        validateInput(inputSenhaRpt, 3)
    }
}

inputsCriarConta.forEach((input, index) => 
input.addEventListener('change', (event) => validateInput(event.target, index))
)

function submitForm(event) {
    inputsCriarConta.forEach((input,index) => validateInput(input, index));

    const arrayInputs = Array.from(inputsCriarConta)

    function isInvalid(element) {
        return element.parentElement.classList.contains('invalido')
    }

    if (arrayInputs.some(isInvalid) || !termosInput.checked) {
        event.preventDefault()
    }else{
        event.preventDefault()
        const name = document.getElementById('usuario').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('senha').value;

        const dto = { 
            name: name, 
            email: email,
            password: password
        };

        sendToAPI(dto)
    }
    
}

function submitLoginForm(event) {
    event.preventDefault();
  
    const email = document.getElementById('usuario-entrar').value;
    const password = document.getElementById('senha-entrar').value;
  
    const dto = {
      email: email,
      password: password
    };
    console.log(dto)
    sendLoginRequest(dto);
}

async function sendLoginRequest(dto) {
    const response = await fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
  
    if (response.ok) {
      // Autenticação bem-sucedida, redirecionar o usuário para a página de perfil
      console.log('Autenticação bem-sucedida');
      
        // Extrair o token da resposta
        const { token } = await response.json();
  
        // Armazenar o token no Local Storage
        localStorage.setItem('token', token);

        // Decodificar o token manualmente para obter o ID do usuário
        const tokenParts = token.split('.');
        const payloadBase64 = tokenParts[1];
        const payload = atob(payloadBase64);
        const { id } = JSON.parse(payload);
  
        // Chamar a função para obter os dados do usuário
        getUserData(id);
    } else {
      // Autenticação falhou, exibir uma mensagem de erro ou executar outras ações
      console.error('Falha na autenticação');
    }
}

async function getUserData(id) {
    const token = localStorage.getItem('token'); // Obtenha o token armazenado no Local Storage
  
    const response = await fetch(`http://localhost:3000/users/login/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Inclua o token no cabeçalho da requisição
      }
    });
  
    if (response.ok) {
      // Os dados do usuário estão na resposta
      const userData = await response.json();
      console.log(userData);
      
      // Use os dados do usuário para preencher a página ou executar outras ações necessárias
      // ...
    } else {
      // Se a chamada falhar, pode ser necessário lidar com o erro adequadamente
      console.error('Falha ao obter os dados do usuário');
    }
}
  

async function sendToAPI(dto){
    const respostaAPI = await fetch('http://localhost:3000/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
    .then(response =>{ 
      response.json();
      window.location.reload(); // Atualiza a página
    })
    .catch(error => {
      console.error('Erro:', error);
      
    });
}

async function consultaUser(id) {
    const response = await fetch(`http://localhost:3000/cursos/page/${id}`);
    const curso = await response.json();
    preencheTelaCurso(curso);
    console.log(curso);
}

submitBtnLogin.addEventListener('click', submitLoginForm);
submitBtn.addEventListener('click', submitForm)
