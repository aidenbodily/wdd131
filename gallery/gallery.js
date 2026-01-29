// sum(3,5);

// function sum (n1, n2) {
//     console.log(n1 + n2);
// }

// let add = function(num1, num2) {
//     console.log(num1 + num2);
// }

// add(5,5); 

// let addIt = (no1, no2) => console.log(no1 + no2);

// addIt(7, 8);

const gallery = document.querySelector('.gallery');
const modal = document.querySelector('dialog');
const modalImage = modal.querySelector('img');
const closeButton = modal.querySelector('.close-viewer');

// Event listener for opening the modal
gallery.addEventListener('click', openModal);

function openModal(e) {
    const img = e.target;
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    const full = src.replace("sm", "full");
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
          