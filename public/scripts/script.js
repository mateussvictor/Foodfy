const cards = document.querySelectorAll('.recipe-card');
const recipeContents = document.querySelectorAll('.recipe-contents');

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener('click', () => {
    location.href = `/recipes/${i}`;
  });
}

for (info of recipeContents) {
  const hide = info.querySelector('.card-hide');
  const recipeList = info.querySelector('.recipe-steps');

  hide.addEventListener('click', () => {
    if (hide.innerHTML == 'hide') {
      hide.innerHTML = 'show';
    } else {
      hide.innerHTML = 'hide';
    }
    recipeList.classList.toggle('hide');
  });
};
