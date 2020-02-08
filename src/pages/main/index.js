var popup = document.querySelector(".modal-window");
var button = document.querySelector(".contacts__button-window");
var close = document.querySelector(".modal-window__button-close");

function toggleModal() {
  popup.classList.toggle("modal-window_show");
}

button.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

