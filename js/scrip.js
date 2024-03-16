const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');

const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');

const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');

const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

let quantidade = [];

cartBtn.addEventListener('click', function() {
   addAoCarrinho();
   cartModal.style.display = 'flex'
   }
)

cartModal.addEventListener('click', function(event) {
   if (event.target === cartModal) {
      cartModal.style.display = 'none'
      }
   }
)

closeModalBtn.addEventListener('click', function() {
   cartModal.style.display = 'none'
   }
)

menu.addEventListener('click', function(event) {
   let parentButton = event.target.closest('.add-to-cart-btn')

   if (parentButton) {
      const name = parentButton.getAttribute('data-name')
      const price = parseFloat(parentButton.getAttribute('data-price'))

      addALista(name, price)
      }
   }
)

function addALista(name, price) {
   const existItem = quantidade.find(item => item.name === name)
   if (existItem) {
      existItem.quantity +=1;
   } else {
      quantidade.push ( {
      name,
      price,
      quantity: 1,
         }
      )
   }
   addAoCarrinho()
}

function addAoCarrinho() {
   cartItemsContainer.innerHTML = "";
   let total = 0;

   quantidade.forEach(item => {
      const cartItemElement = document.createElement('div');
      cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

      cartItemElement.innerHTML = `
      <div class='items-carrin'>
         <div>
            <p class='nome-produto'>${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p>R$ ${item.price.toFixed(2)}</p>
         </div>
         
         <button class= 'remover-produto' data-name='${item.name}'>
            Remover
         </button>      
      </div>
   `
   total += item.price * item.quantity;
   cartItemsContainer.appendChild(cartItemElement)
      }
   )

   cartTotal.textContent = "Total: " + total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
      }
   );
   cartCounter.innerHTML = quantidade.length;
}

cartItemsContainer.addEventListener('click', function(event) {
   if (event.target.classList.contains('remover-produto')) {
      const name = event.target.getAttribute('data-name')

      removerItem(name);
      }
   }
)

function removerItem(name) {
   const index = quantidade.findIndex(item => item.name === name);

   if (index !== -1) {
      const item = quantidade[index];
      if (item.quantity > 1) {
         item.quantity -= 1;
         addAoCarrinho();
         return;
      }
      quantidade.splice(index, 1);
      addAoCarrinho();
   }
}

addressInput.addEventListener('input', function(event) {
   let inputValue = event.target.value;
   if (inputValue !== "") {
      addressInput.classList.remove('border')
      addressWarn.style.display = 'none';
   } else {
      addressWarn.style.display = 'block';
      }
   }
)

checkoutBtn.addEventListener('click', function() {
   const isOpen = chekOpen();
   if (!isOpen) {
      Toastify ( {
         text: 'Ops, estamos Fechados!',
         duration: 3000,
         close: true,
         gravity: 'top',
         position: 'right',
         stopOnFocus: true,
         style: {
            background: '#ef4444'
               },
            }
      ).showToast();
      return;
      }

      if (quantidade.length === 0) return;
      if (addressInput.value === "") {
         addressWarn.style.display = 'block';
         addressInput.classList.add('border')
         return;
      }

      const cartItems = quantidade.map((item) => {
         return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
         )
      }).join("")
      
      const message = encodeURIComponent(cartItems)
      const phone = "5555555555"
   
      window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
   
      quantidade = [];
      addAoCarrinho();
   }
)

function chekOpen() {
   const data = new Date();
   const hora = data.getHours();
   return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById('date-span')
const isOpen = chekOpen();

if (isOpen) {
   spanItem.classList.remove('red');
   spanItem.classList.add('green');
} else {
   spanItem.classList.remove('green');
   spanItem.classList.add('red');
}