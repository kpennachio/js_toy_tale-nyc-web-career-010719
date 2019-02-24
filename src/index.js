const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const newToyForm = document.querySelector('.add-toy-form')
const collection = document.querySelector("#toy-collection")

let addToy = false
let allToys = []


addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})

document.addEventListener("DOMContentLoaded", () => {

  // render all toys and add to local variable
  fetch("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then(toys => renderAllToys(toys))

  // add event listener to form
  newToyForm.addEventListener("submit", addNewToy)

  // add event listener to toy collection
  collection.addEventListener("click", (e) => {
    if (e.target.className == "like-btn") {
      addLike(e)
    }
  })

}) //end of DOM load


function addLike(e) {
  let toy = allToys.find(toy => toy.id == e.target.dataset.id)

  toy.likes++

  let data = {
    "name": toy.name,
    "image": toy.image,
    "likes": toy.likes
  }

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accepts": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(updatedToy => {
    // update the local variable
    console.log(updatedToy)
    let updatedToys = allToys.map(toy => {
      return  (toy.id == updatedToy.id) ? updatedToy : toy
    })
    console.log(updatedToys)
    // update the DOM
    collection.innerHTML = ""
    renderAllToys(updatedToys)

  })
}


function renderAllToys(toys) {
  toys.forEach(toy => renderToy(toy))
  allToys = toys
}

function renderToy(toy) {
  collection.innerHTML += `<div class="card">
  <h2>${toy.name}</h2>
  <img src=${toy.image} class="toy-avatar" />
  <p>${toy.likes} Likes </p>
  <button data-id="${toy.id}" class="like-btn">Like <3</button>
</div>`
}

function addNewToy(e) {
  e.preventDefault()

  let nameValue = toyForm.querySelector("[name='name']").value
  let imageValue = toyForm.querySelector("[name='image']").value
  let data = {
    "name": nameValue,
    "image": imageValue,
    "likes": 0
  }
  // send a post request to server to add a new toy
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accepts": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(resp => resp.json())
    .then(newToy => {
      // add a new toy to the local variable
      allToys.push(newToy)
      // add a new toy to the DOM
      renderAllToys(allToys)
      newToyForm.reset()
    })
}
