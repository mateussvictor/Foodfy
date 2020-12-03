const currentPage = location.pathname
const menuItems = document.querySelectorAll('.nav-item')

for(item of menuItems) {
  if(currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active')
  }
}

const cards = document.querySelectorAll('.recipe-card')
const recipeContents = document.querySelectorAll('.recipe-contents')

for (info of recipeContents) {
  const hide = info.querySelector('.card-hide')
  const recipeList = info.querySelector('.recipe-steps')

  hide.addEventListener('click', () => {
    if (hide.innerHTML == 'esconder') {
      hide.innerHTML = 'mostrar'
    } else {
      hide.innerHTML = 'esconder'
    }
    recipeList.classList.toggle('hide')
  })
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

const Validate = {
  apply(input, func) {
    Validate.clearError(input)

    let results = Validate[func](input.value)
    input.value = results.value

    if(results.error)
      Validate.displayError(input, results.error)
  },

  displayError(input, error) {
    const div = document.createElement('p')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)
    
  },

  clearError(input) {
    const errorDiv = input.parentNode.querySelector('.error')
    if(errorDiv)
      errorDiv.remove()
  },

  isEmail(value) {
    let error = null
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      
    if(!value.match(mailFormat))
      error = 'Email inválido'

    return {
      error,
      value
    }
  }
}

const ImageGallery = {
  highlight: document.querySelector('.img-container .highlight > img'),
  previews: document.querySelectorAll('.gallery-preview img'),
  
  setImage(e) {
    const { target } = e
    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
    target.classList.add('active')

    ImageGallery.highlight.src = target.src
    Lightbox.image.src = target.src
  }
}

const Lightbox = {
  target: document.querySelector('.highlight .lightbox-target'),
  image: document.querySelector('.highlight .lightbox-target img'),
  closeButton: document.querySelector('.lightbox-target a.lightbox-close'),

  open() {
    Lightbox.target.style.opacity = 1
    Lightbox.target.style.top = 0
    Lightbox.target.style.bottom = 0
    Lightbox.closeButton.style.top = 0
  },
  close() {
    Lightbox.target.style.opacity = 0
    Lightbox.target.style.top = "-100%"
    Lightbox.target.style.bottom = 'initial'
    Lightbox.closeButton.style.top = "-80px"
  }
}

const addFields = {
  input: "",
  parent: "",
  container: "",

  add(event) {
    addFields.input = event.target
    addFields.parent = addFields.input.parentElement
    addFields.container = addFields.parent.querySelector('.field-container').lastElementChild

    const newField = addFields.container.cloneNode(true)

    if (newField.children[0].value === '') return

    newField.children[0].value = ''
    addFields.parent.querySelector('.field-container').appendChild(newField)
  },
  remove(event) {
    addFields.input = event.target
    addFields.parent = addFields.input.parentElement.parentElement

    console.log(addFields.parent.parentElement.children)
    

    if (addFields.parent.parentElement.children.length > 1) {
      if (addFields.parent.querySelector('input').value == "") {
        addFields.parent.parentElement.removeChild(addFields.parent)
      } else {
        addFields.parent.parentElement.removeChild(addFields.parent)
      }
    }
  }
}


function confirmDelete(formDelete) {
  formDelete.addEventListener('submit', event => {
    const totalRecipes = document.querySelector('.total-recipes')
    const confirmation = confirm('Tem certeza que deseja deletar? Essa operação não poderá ser desfeita!')
    if (!confirmation) event.preventDefault()

    
    if (totalRecipes) {
      const total = +totalRecipes.dataset.total
      if (total) {
        event.preventDefault()
        alert('Não é possivel deletar chefs que possuem receitas!')
      }
    }
  })
}

const formDelete = document.querySelector('#form-delete')
if (formDelete) confirmDelete(formDelete)

const usersFormDelete = document.querySelectorAll('.form-delete')
usersFormDelete.forEach(form => confirmDelete(form))