let cart = [];

function initializeCart() {
  // Load cart from localStorage
  const savedCart = localStorage.getItem('electronics-cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }

  // Cart button
  document.addEventListener('click', (e) => {
    if (e.target.closest('#cart-btn')) {
      openCartModal();
    }
  });
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartCount();
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  saveCart();
  openCartModal(); // Refresh modal
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

function saveCart() {
  localStorage.setItem('electronics-cart', JSON.stringify(cart));
}

function openCartModal() {
  const modal = document.getElementById('cart-modal');
  const content = document.getElementById('cart-content');

  if (!modal || !content) return;

  if (cart.length === 0) {
    content.innerHTML = `
      <p class="text-center text-gray-500 py-8">Your cart is empty</p>
    `;
  } else {
    content.innerHTML = `
      <div class="space-y-4 mb-6">
        ${cart.map(item => `
          <div class="flex items-center space-x-4 border-b pb-4">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
            <div class="flex-1">
              <h4 class="font-medium">${item.name}</h4>
              <p class="text-sm text-gray-600">₹${item.discountPrice || item.price}</p>
              <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
            </div>
            <button class="text-red-500 hover:text-red-700 remove-from-cart" data-id="${item.id}">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        `).join('')}
      </div>
      <form id="cart-enquiry-form" class="space-y-4">
        <h4 class="font-semibold">Customer Information</h4>
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" id="cart-name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Phone Number</label>
          <input type="tel" id="cart-phone" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        </div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium">Send Enquiry via WhatsApp</button>
      </form>
    `;

    // Add remove event listeners
    document.querySelectorAll('.remove-from-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.currentTarget.dataset.id);
        removeFromCart(productId);
      });
    });

    // Cart enquiry form
    document.getElementById('cart-enquiry-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cart-name').value;
      const phone = document.getElementById('cart-phone').value;

      const message = `Customer Enquiry\n\nName: ${name}\nPhone: ${phone}\n\nInterested Products:\n${cart.map(item => `- ${item.name}`).join('\n')}`;

      const token = "8511835760:AAHDVi_nc2zSx77EL4O0_vXmiB_jQPbqOO8";
      const chatId = "1032367589";

      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      });

      modal.classList.add('hidden');
    });
  }

  modal.classList.remove('hidden');
}