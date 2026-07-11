let prevButton = document.getElementById('prev');
let nextButton = document.getElementById('next');
let container = document.querySelector('.container');
let items = container.querySelectorAll('.list .item');
let indicator = document.querySelector('.indicators');
let dots = indicator.querySelectorAll('ul li');
let number = indicator.querySelector('.number'); // Seleciona o elemento que exibe o número do carrossel
let list = container.querySelector('.list');
let active = 0;
let firstPosition = 0;
let lastPosition = items.length - 1;

// Função para atualizar o carrossel
function updateCarousel() {
    // Atualiza o item ativo
    let itemOld = container.querySelector('.list .item.active');
    itemOld.classList.remove('active');
    items[active].classList.add('active');
    
    // Atualiza o indicador ativo
    let dotsOld = indicator.querySelector('ul li.active');
    dotsOld.classList.remove('active');
    dots[active].classList.add('active');
    
    // Atualiza o número
    number.innerHTML = '0' + (active + 1);
}

// Navegação para o próximo item
nextButton.onclick = () => {
    list.style.setProperty('--calculation', '1'); // Ajusta a transição para a direita
    active = active + 1 > lastPosition ? firstPosition : active + 1;
    updateCarousel();
}

// Navegação para o item anterior
prevButton.onclick = () => {
    list.style.setProperty('--calculation', '-1'); // Ajusta a transição para a esquerda
    active = active - 1 < firstPosition ? lastPosition : active - 1;
    updateCarousel();
}

// Inicializa o carrossel com o item e indicador corretos
updateCarousel();
