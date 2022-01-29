const catalog_items = document.querySelector('.catalog__items')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCart = document.getElementById('template-cart').content
const templateFooter = document.getElementById('template-footer').content
const payments = document.querySelector('.payments')
const fragment = document.createDocumentFragment()
const container_form = document.querySelector('.container-form')
let carrito = {}

// Se dispara cuando el documento html a sido cargado
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('carrito')) {
        // JSON.parse(): convierte un string JSON a un objeto JS
        carrito = JSON.parse(localStorage.getItem('carrito'))
        showCart()
        paymentGateway()
    }
})

// Llama al método addCart()
catalog_items.addEventListener('click', e => {
    addCart(e)
})

// Click en los botones de acción dentro del carrito
items.addEventListener('click', e => {
    btnAction(e)
})

// Agrega el producto seleccionado al carrito
const addCart = e => {
    if(e.target.classList.contains('btn--info')) {
        // Envia todo el elemento padre al carrito
        setCart(e.target.parentElement)
        swal("Se agregó el producto satisfactoriamente!");
    }
    // Detiene cualquier otro evento que se pueda generar
    e.stopPropagation()
}

// Captura los elementos que fueron enviados por el método addCart()
const setCart = objecto => {
    const product = {
        id: objecto.querySelector('.btn--info').dataset.id,
        title: objecto.querySelector('.card__text').textContent,
        price: objecto.querySelector('.price__normal').textContent,
        amount: 1
    }
    // Comprueba si el objeto carrito tiene la propiedad específica
    if(carrito.hasOwnProperty(product.id)) {
        product.amount = carrito[product.id].amount + 1
    }
    // 
    carrito[product.id] = {...product}
    showCart()
}

// Muestra los productos en la tabla
const showCart = () => {
    items.innerHTML = ''
    // Accede al objeto carrito
    Object.values(carrito).forEach(product => {
        templateCart.querySelector('th').textContent = product.id
        templateCart.querySelectorAll('td')[0].textContent = product.title
        templateCart.querySelectorAll('td')[1].textContent = product.price
        templateCart.querySelectorAll('td')[2].textContent = product.amount
        templateCart.querySelector('.btn--info').dataset.id = product.id
        templateCart.querySelector('.btn--danger').dataset.id = product.id
        templateCart.querySelector('.subtotal').textContent = (product.amount * product.price).toFixed(3)
        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)
    showFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))
    paymentGateway()
}

// Muestra la parte de abajo (pie) del carrito
const showFooter = () => {
    footer.innerHTML = ''
    // Si el carrito no contiene elementos
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        // Hace que salga de la función
        return
    }

    // nCantidad = suma de todas las cantidades
    const nAmount = Object.values(carrito).reduce((acc, {amount}) => acc + amount, 0)
    const nPrice = Object.values(carrito).reduce((acc, {amount, price}) => acc + (amount * price), 0)
    
    templateFooter.querySelectorAll('td')[1].textContent = nAmount
    templateFooter.querySelector('span').textContent = nPrice.toFixed(3)
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnEmpty = document.getElementById('vaciar-carrito')
    btnEmpty.addEventListener('click', () => {
        carrito = {}
        showCart()
    })
}

// Botones de aumentar y disminuir cantidad
const btnAction = e => {
    // Acción aumentar
    if(e.target.classList.contains('btn--info')) {
        let product = carrito[e.target.dataset.id]
        product.amount++
        // carrito[e.target.dataset.id] = {...product}
        product = {...product}
        showCart()
    }

    // Acción disminuir
    if(e.target.classList.contains('btn--danger')) {
        let product = carrito[e.target.dataset.id]
        product.amount--
        if(product.amount === 0) {
            delete carrito[e.target.dataset.id]
        }
        showCart()
    }

    e.stopPropagation()
}

// Muestra pasarela de pagos
const paymentGateway = () => {
    if(Object.keys(carrito).length === 0) {
        payments.style.display = 'none'
    } else {
        payments.style.display = 'block'
    }
}

// Muestra ventana alert de compra exitosa
container_form.addEventListener('submit', e => {
    swal("Compra exitosa","vuelva pronto!", "success")
    carrito = {}
    showCart()
    clearFields()
    e.preventDefault()
})

// Limpia los inputs del formulario
clearFields = () => {
    document.getElementsByName('card-number')[0].value = ""
    document.getElementsByName('name-owner')[0].value = ""
    document.getElementsByName('date')[0].value = ""
    document.getElementsByName('code')[0].value = ""
}