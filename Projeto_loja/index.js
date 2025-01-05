let contador = 0;

function anuncio() {
    let tag = document.getElementById('anuncio');

    // Lógica para alternar os textos dependendo do contador
    if (contador === 0) {
        tag.innerHTML = 'Produtos importados';
    } else if (contador === 1) {
        tag.innerHTML = 'Preços imperdíveis';
    } else if (contador === 2) {
        tag.innerHTML = 'Compre agora';
    }

    // Incrementar o contador e resetar após o ciclo completo
    contador = (contador + 1) % 3;  // Isso vai manter o contador entre 0, 1 e 2
}

// Chama a função "anuncio" após 4 segundos (4000 milissegundos) e depois a cada 3 segundos (3000 milissegundos)
setTimeout(function () {
    anuncio(); // Primeira execução após 4 segundos
    setInterval(anuncio, 3000); // Subsequentemente, a cada 3 segundos
}, 4000);

let indice = 0; // Definindo o índice global fora da função para manter seu valor entre as chamadas

const imagens = [
    "img/marron_foto1.jpg",
    "img/marron_foto2.jpg"
];

function troca_imagen1() {
    const img = document.getElementById('primeira'); // Acessando a imagem pelo ID
    img.src = imagens[indice]; // Atualizando a fonte da imagem com base no índice

    indice = (indice + 1) % imagens.length; // Incrementa o índice e reinicia ao atingir o final do array
}
setInterval(troca_imagen1, 2000);

function validarFormulario(event) {
    event.preventDefault();  // Impede o envio do formulário até que a validação seja feita

    // Resetando mensagens de erro
    document.getElementById("nomeError").textContent = '';
    document.getElementById("emailError").textContent = '';

    // Pegando os valores do formulário
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let dataAniversario = document.getElementById("dataAniversario").value;

    let valid = true;

    // Validando o nome
    if (nome.trim() === '') {
        document.getElementById("nomeError").textContent = "O nome é obrigatório.";
        valid = false;
    }

    // Validando o email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Por favor, insira um email válido.";
        valid = false;
    }

    // Se todas as validações forem bem-sucedidas, o formulário pode ser enviado
    if (valid) {
        alert("Cadastro realizado com sucesso!");
        document.getElementById("cadastroForm").reset();  // Reseta o formulário
    } else {
        alert("Por favor, corrija os erros no formulário.");
    }
}

// Adicionando o evento de validação ao formulário
document.getElementById("cadastroForm").addEventListener("submit", validarFormulario);

const modeToggle = document.getElementById('mode-toggle');
const body = document.body;

modeToggle.addEventListener('click', () => {
    // Alterna entre modos claro e escuro
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        modeToggle.textContent = 'nightlight'; // Muda para ícone de lua (noite)
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        modeToggle.textContent = 'wb_sunny'; // Muda para ícone de sol (dia)
    }
});