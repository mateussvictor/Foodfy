const cards = document.querySelectorAll('.recipe-card')
const recipeContents = document.querySelectorAll('.recipe-contents')

for (info of recipeContents) {
  const hide = info.querySelector('.card-hide')
  const recipeList = info.querySelector('.recipe-steps')

  hide.addEventListener('click', () => {
    if (hide.innerHTML == 'hide') {
      hide.innerHTML = 'show'
    } else {
      hide.innerHTML = 'hide'
    }
    recipeList.classList.toggle('hide')
  })
}

function addIngredient() {

  const ingredients = document.querySelector("#ingredients-container")
  const fieldContainer = document.querySelectorAll(".ingredient")
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

  if (newField.children[0].value == "") return false

  newField.children[0].value = ""
  ingredients.appendChild(newField)
}

function addStep() {
  const steps = document.querySelector("#steps-container")
  const fieldContainer = document.querySelectorAll(".step")
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

  if (newField.children[0].value == "") return false
  
  newField.children[0].value = ""
  steps.appendChild(newField)
}

function confirmation() {
  const formDelete = document.querySelector("#form-delete")
  formDelete.addEventListener("submit", (event) => {
    const confirmation = confirm("Deseja apagar essa receita?")
    if(!confirmation) event.preventDefault()
  })
}

function paginate(selectedPage, totalPages) {
  let pages = [],
      oldPage

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

    const firstAndLastPage = currentPage == 1 || currentPage == totalPages
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

    if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push('...')
      }

      if(oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1)
      }

      pages.push(currentPage)

      oldPage = currentPage
    }
  }

  return pages
}

function createPagination(pagination) {
  const filter = pagination.dataset.filter
  const page = +pagination.dataset.page
  const total = +pagination.dataset.total

  const pages = paginate(page, total)

  let elements = ''

  for (let page of pages) {
    if(String(page).includes('...')) {
      elements += `<span>${page}</span>`
    } else {
      if(filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`

      } else {
        elements += `<a href="?page=${page}">${page}</a>`
      }
    }
  }

  pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')

if(pagination) {
  createPagination(pagination)
}

const photosUpload = {
  input: '',
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 5,
  files: [],

  handleFileInput(input) {
    const { files: fileList } = event.target
    photosUpload.input = event.target

    if(photosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      photosUpload.files.push(file)
      
      const reader = new FileReader()

      reader.onload= () => {
        const image = new Image()
        image.src = String(reader.result)
        const div = photosUpload.getContainer(image)
        photosUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file)
    })
  
    photosUpload.input.files = photosUpload.getAllFiles()
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = photosUpload
    const { files: fileList } = input

    if(fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach( item => {
      if(item.classList && item.classList.value == 'photo')
      photosDiv.push(item)
    })

    const totalPhotos = fileList.length + photosDiv.length
    if(totalPhotos > uploadLimit) {
      alert('Você atingiu o limite máximo de fotos')
      event.preventDefault()
      return true
    }
    return false
  },

  getAllFiles() {
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

    photosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },

  getContainer(image) {
    const div = document.createElement('div')
    div.classList.add('photo')

    div.onclick = photosUpload.removePhoto

    div.appendChild(image)

    div.appendChild(photosUpload.getRemoveButton())

    return div
  },

  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'
    return button
  },

  removePhoto(event) {
    const photoDiv = event.target.parentNode
    const photosArray = Array.from(photosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    photosUpload.files.splice(index, 1)
    photosUpload.input.files = photosUpload.getAllFiles()

    photoDiv.remove()
  },
  
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if(photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"')
      if(removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove()
  }
}

const avatarUpload = {
  input: '',
  preview: document.querySelector('#avatar-preview'),
  uploadLimit: 1,
  files: [],

  handleFileInput(input) {
    const { files: fileList } = event.target
    avatarUpload.input = event.target

    if(avatarUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      avatarUpload.files.push(file)
      
      const reader = new FileReader()

      reader.onload= () => {
        const image = new Image()
        image.src = String(reader.result)
        const div = avatarUpload.getContainer(image)
        avatarUpload.preview.appendChild(div)
      }

      reader.readAsDataURL(file)
    })
  
    avatarUpload.input.files = avatarUpload.getAllFiles()
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = avatarUpload
    const { files: fileList } = input

    if(fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    preview.childNodes.forEach( item => {
      if(item.classList && item.classList.value == 'photo')
      photosDiv.push(item)
    })

    const totalPhotos = fileList.length + photosDiv.length
    if(totalPhotos > uploadLimit) {
      alert('Envie somente uma foto.')
      event.preventDefault()
      return true
    }
    return false
  },

  getAllFiles() {
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

    avatarUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },

  getContainer(image) {
    const div = document.createElement('div')
    div.classList.add('photo')

    div.onclick = avatarUpload.removePhoto

    div.appendChild(image)

    div.appendChild(avatarUpload.getRemoveButton())

    return div
  },

  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'
    return button
  },

  removePhoto(event) {
    const photoDiv = event.target.parentNode
    const photosArray = Array.from(avatarUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    avatarUpload.files.splice(index, 1)
    avatarUpload.input.files = avatarUpload.getAllFiles()

    photoDiv.remove()
  },
  
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if(photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"')
      if(removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove()
  }
}

