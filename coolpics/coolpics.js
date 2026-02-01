const menuText = document.querySelector('.menu-text');
const nav = document.querySelector('nav');

menuText.addEventListener('click', function() {
    nav.classList.toggle('show');
});

const gallery = document.querySelector('.gallery');

const modal = document.createElement('dialog');
modal.innerHTML = `
    <img src="" alt="">
    <button class="close-viewer">X</button>
`;
document.body.appendChild(modal);

const modalImage = modal.querySelector('img');
const closeButton = modal.querySelector('.close-viewer');

// Event listener for opening the modal
gallery.addEventListener('click', openModal);

function openModal(e) {
    const img = e.target;
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    const full = src.replace('-sm', '-full');
    modalImage.src = full;
    modalImage.alt = alt;
    modal.showModal();
}

// Close modal on button click
closeButton.addEventListener('click', () => {
    modal.close();
});

// Close modal if clicking outside the image
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close();
    }
});