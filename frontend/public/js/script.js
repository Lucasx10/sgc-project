const btns = document.querySelectorAll('.btns-login button')
const allInputs = document.querySelectorAll('.ct-input input')
const inputsCriarConta = document.querySelectorAll('#criar .ct-input input')
const alertas = document.querySelectorAll('.alert')
const submitBtn = document.querySelector('#submit-conta')
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

submitBtn.addEventListener('click', submitForm)