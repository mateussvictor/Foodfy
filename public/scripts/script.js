const modalOverLay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.recipe-card');

for (let card of cards) {
  
  card.addEventListener('click', () => {
    const showImg = card.getAttribute('id');
    const title = card.querySelector('.recipe-title').innerHTML;
    const author = card.querySelector('.author').innerHTML;

    modalOverLay.classList.add('active');
    modalOverLay.querySelector('img').src = `${showImg}`;
    modalOverLay.querySelector('.modal-title').innerHTML = title;
    modalOverLay.querySelector('.recipe-author').innerHTML = author;
  });
}

document.querySelector('.close-modal').addEventListener('click', () => {
  modalOverLay.classList.remove('active');
  modalOverLay.querySelector('img').src = '';
});
