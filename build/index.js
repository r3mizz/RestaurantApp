import { menuArray } from "./data/data.js";
const paymentForm = document.getElementById("payment-form")

let cartArray = []

document.addEventListener("click", function(e){
    if(e.target.dataset.add){
        handleAddClick(parseInt(e.target.dataset.add, 10))
    
    }
    if(e.target.dataset.remove){
        handleRemoveClick(parseInt(e.target.dataset.remove, 10))
    
    }
    if(e.target.id === "complete-order"){
        document.getElementById("payment-modal").classList.remove("hidden")
    }
})

paymentForm.addEventListener("submit", function(e){
    e.preventDefault()
    console.log("clicked !")
    document.getElementById("payment-modal").classList.add("hidden")

    document.getElementById("cart").innerHTML = `
                                                    <div>
                                                        <h2 class="text-4xl text-green-400 text-center rounded-full font-bold">Thanks for your order !</h2>
                                                    </div>`
    document.getElementById("payment").classList.remove("hidden")
    cartArray = []
    localStorage.clear()
    setTimeout((function(){  
        renderCart()
      }),1500)
})

function saveCart(){
    localStorage.setItem("myCart", JSON.stringify(cartArray))
}

function retrieveCart(){
    const cartFromLocalStorage = JSON.parse(localStorage.getItem("myCart"))
    if ( cartFromLocalStorage ){
        cartArray = cartFromLocalStorage
    }
}


function handleRemoveClick(itemId){
   const targetCartObj = cartArray.filter(function(obj){
        return obj.id === itemId
   })[0]

   if ( targetCartObj.quantity === 1 ) {
        /* REMOVE OBJECT FROM cartArray */
        let index = cartArray.findIndex(item => item.id === itemId)
        cartArray.splice(index, 1)
   } else {
        /* DECREASE QUANTITY */
        targetCartObj.quantity --
   }

    saveCart()
    renderCart()
}

function handleAddClick(itemId){
    if ( cartArray.find(item => item.id === itemId) ){
        /* INCREMENT QTY */
        const targetCartObj = cartArray.filter(function(obj){
            return obj.id === itemId
        })[0]
        targetCartObj.quantity ++
    } else {
        /* CREER OBJ AVEC QTY=1 */
        const targetMenuObj = menuArray.filter(function(obj){
            return obj.id === itemId
        })[0]
        cartArray.push(
            {
                name: targetMenuObj.name,
                id: targetMenuObj.id,
                price: targetMenuObj.price,
                quantity: 1
            }
        )
    }
    saveCart()
    renderCart()

}

function getMenuHtml(){
    let htmlString = ''
    menuArray.forEach(element => {
        htmlString += `
            <div id="menu-item" class="flex flex-row items-center justify-around border-b-2 border-gray-300 border-solid">
                <p id="emoji" class="text-5xl">${element.emoji}</p>
                <div id="descritpion" class="p-4 w-[400px]">
                    <p class="text-lg font-bold">${element.name}</p>
                    <p class="text-xs text-gray-500">${element.ingredients}</p>
                    <p>$${element.price}</p>
                </div>
                <button data-add="${element.id}" class="px-2 border-2 border-gray-500 border-solid rounded-full justify-self-end hover:bg-red-300">+</button>
            </div>`
    });
    return htmlString
}

function getCartHtml(){
    let htmlString = ''
    cartArray.forEach(element => {
        
    let itemPrice = element.price * element.quantity
    htmlString += ` <div class="flex flex-row items-center justify-start gap-2">
                        <p id="item-name" class="font-semibold text-md">${element.quantity} x ${element.name}</p>
                        <button data-remove="${element.id}" id="remove-btn" class="text-xs text-gray-300 hover:text-red-300">remove</button>
                        <p id="item-price" class="ml-auto">$${itemPrice}</p>
                    </div>`
        
    });
    return htmlString
}

function getCartPrice(){
    let totalPrice = 0
    cartArray.forEach(element =>{
        totalPrice += (element.price * element.quantity)
    })
    return totalPrice
}


function renderMenu(){
    document.getElementById("menu-display").innerHTML = getMenuHtml()
}

function renderCart(){
    if (cartArray.length > 0){
        let price = getCartPrice()
        if ( price > 0 ){
            document.getElementById("payment").classList.remove("hidden")
            document.getElementById("cart").innerHTML = getCartHtml()
            document.getElementById("total-price").innerText = `$${price}`
        }
    } else {
        document.getElementById("payment").classList.add("hidden")
    }
}

function initApp(){
    retrieveCart()
    renderMenu()
    renderCart()
}

initApp()

