const myModal = document.getElementById('modal')
const myInput = document.getElementById('add-category')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})