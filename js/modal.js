function initializeModals() {
    // Close modals when clicking outside or on close button
    document.addEventListener('click', (e) => {
        const modals = ['product-modal', 'cart-modal', 'service-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            const closeBtn = document.getElementById(`close-${modalId}`);
            if (modal && (e.target === modal || e.target === closeBtn || closeBtn?.contains(e.target))) {
                modal.classList.add('hidden');
            }
        });
    });

    // Service request buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('request-service-btn') && !e.target.closest('.slide')) {
            const serviceName = e.target.getAttribute('data-service');
            openServiceModal(serviceName);
        }
    });

    // Service form submission
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'service-form') {
            e.preventDefault();
            const name = document.getElementById('service-name').value;
            const phone = document.getElementById('service-phone').value;
            const serviceType = document.getElementById('service-type').value;
            const address = document.getElementById('service-address').value;
            const problem = document.getElementById('service-problem').value;
            const message = `Service Request\n\nName: ${name}\nPhone: ${phone}\nService: ${serviceType}\nAddress: ${address}\nProblem: ${problem}`;
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

            document.getElementById('service-modal').classList.add('hidden');
            e.target.reset();
        }
    });
}

function openServiceModal(serviceName) {
    const modal = document.getElementById('service-modal');
    if (modal) {
        modal.classList.remove('hidden');
        const select = document.getElementById('service-type');
        if (select && serviceName) {
            select.value = serviceName;
        }
    }
}

function openProductModal(product) {
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('product-modal-content');

    if (!modal || !content) return;

    content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-contain rounded-lg">
      </div>
      <div>
        <h4 class="text-xl font-semibold mb-2">${product.name}</h4>
        <p class="text-gray-600 mb-4">${product.description}</p>
        <div class="flex items-center space-x-2 mb-4">
          <span class="text-2xl font-bold text-blue-600">₹${product.discountPrice || product.price}</span>
          ${product.discountPrice ? `<span class="text-lg text-gray-500 line-through">₹${product.price}</span>` : ''}
        </div>
        ${product.rating ? `
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400">
              ${Array.from({ length: 5 }, (_, i) =>
        `<svg class="w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>`
    ).join('')}
            </div>
            <span class="text-sm text-gray-600 ml-2">(${product.rating})</span>
          </div>
        ` : ''}
        <form id="product-enquiry-form" class="space-y-4">
          <h5 class="font-semibold">Send Enquiry</h5>
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input type="text" id="product-name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Phone Number</label>
            <input type="tel" id="product-phone" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email (Optional)</label>
            <input type="email" id="product-email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium">Send Enquiry</button>
        </form>
      </div>
    </div>
  `;

    // Product enquiry form
    setTimeout(() => {
        const form = document.getElementById('product-enquiry-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('product-name').value;
                const phone = document.getElementById('product-phone').value;
                const email = document.getElementById('product-email').value;

                const message = `Customer Enquiry\n\nName: ${name}\nPhone: ${phone}\n${email ? `Email: ${email}\n` : ''}\nInterested Product:\n${product.name}`;

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
    }, 100);

    modal.classList.remove('hidden');
}

function openServiceModal() {
    const modal = document.getElementById('service-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}