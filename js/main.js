// Load components
async function loadComponent(id, file) {
  try {
    const response = await fetch(`components/${file}`);
    let html = await response.text();
    // strip any live-server injection script
    html = html.replace(/<!-- Code injected by live-server -->([\s\S]*?)<\/script>/g, '');
    document.getElementById(id).innerHTML = html;
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
}

// Load all components
async function loadComponents() {
  await loadComponent('header', 'header.html');
  await loadComponent('slider', 'slider.html');
  await loadComponent('products', 'products.html');
  await loadComponent('services', 'services.html');
  await loadComponent('team', 'team.html');
  await loadComponent('contact', 'contact.html');
  await loadComponent('footer', 'footer.html');
  
  // small delay to let DOM settle
  return new Promise(resolve => setTimeout(resolve, 200));
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const dbg = document.createElement('div');
  // dbg.id = 'js-debug-status';
  // dbg.className = 'fixed bottom-2 right-2 bg-green-600 text-white px-3 py-1 text-xs rounded z-50';
  // dbg.textContent = 'JS initialized';
  // document.body.appendChild(dbg);

  await loadComponents();

  loadProducts();
  loadServices();

  initializeCart();
  initializeSlider();
  initializeModals();
  initializeSearch();
});

// Load products from JSON
async function loadProducts() {
  try {
    // const response = await fetch('data/products.json');
    const response = await fetch('https://sheetdb.io/api/v1/avbq665hl1sc6');

    const products = await response.json();
    console.log("products",products);
    
    displayProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Display products in grid
function displayProducts(products, filter = 'all') {
  const productGrid = document.getElementById('product-grid');
  if (!productGrid) return;

  const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
  
  productGrid.innerHTML = filteredProducts.map(product => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow product-card" data-id="${product.id}">
      <div class="relative overflow-hidden">
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-contain hover:scale-105 transition-transform">
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
        <p class="text-gray-600 text-sm mb-3">${product.description}</p>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-xl font-bold text-blue-600">₹${product.discountPrice || product.price}</span>
            ${product.discountPrice ? `<span class="text-sm text-gray-500 line-through">₹${product.price}</span>` : ''}
          </div>
          ${product.rating ? `
            <div class="flex items-center">
              <div class="flex text-yellow-400">
                ${Array.from({length: 5}, (_, i) => 
                  `<svg class="w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>`
                ).join('')}
              </div>
              <span class="text-sm text-gray-600 ml-1">(${product.rating})</span>
            </div>
          ` : ''}
        </div>
        <div class="flex space-x-2">
          <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium add-to-cart-btn">Add to Cart</button>
          <button class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded text-sm font-medium enquiry-btn">Enquiry</button>
        </div>
      </div>
    </div>
  `).join('');

  // card click behaviour
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('add-to-cart-btn') && !e.target.classList.contains('enquiry-btn')) {
        const productId = parseInt(card.dataset.id);
        console.log("clicked product id", productId);
        const product = products.find(p => p.id == productId);
        if (product) openProductModal(product);
      }
    });
  });

  // attach add/enquiry events
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = e.target.closest('.product-card');
      const productId = parseInt(card.dataset.id);
      const product = products.find(p => p.id == productId);
      if (product) addToCart(product);
    });
  });
  document.querySelectorAll('.enquiry-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = e.target.closest('.product-card');
      const productId = parseInt(card.dataset.id);
      const product = products.find(p => p.id == productId);
      if (product) openProductModal(product);
    });
  });
}

// Category filtering

// Event delegation for category buttons continues...
// Desktop category buttons
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('category-btn')) {

    document.querySelectorAll('.category-btn').forEach(btn =>
      btn.classList.remove('bg-blue-100', 'text-blue-600')
    );

    e.target.classList.add('bg-blue-100', 'text-blue-600');

    const category = e.target.dataset.category;

    filterProducts(category);
  }
});


// Mobile dropdown filter
document.addEventListener("change", function (e) {
  if (e.target.id === "mobile-category") {

    const category = e.target.value;

    filterProducts(category);

  }
});


// Filter products
async function filterProducts(category) {
  try {
const response = await fetch('https://sheetdb.io/api/v1/avbq665hl1sc6');

    // const products = await response.json();
    // const response = await fetch('data/products.json');

    const products = await response.json();

    displayProducts(products, category);

  } catch (error) {

    console.error('Error filtering products:', error);

  }
}
// Scroll to services when request button clicked

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('request-service-btn')) {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
});

// Search functionality
let allProducts = [];

async function initializeSearch() {
  try {
    const response = await fetch('data/products.json');
    allProducts = await response.json();
  } catch (err) {
    console.error('Search load error', err);
    return;
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      if (term.length > 0) {
        const filtered = allProducts.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        );
        displayProducts(filtered);
      } else {
        displayProducts(allProducts);
      }
    });
  }

}

// Load services from JSON
async function loadServices() {
  try {
    const response = await fetch('data/services.json');
    const services = await response.json();
    displayServices(services);
    populateServiceSelect(services);
  } catch (error) {
    console.error('Error loading services:', error);
  }
}

// Display services in sections
function displayServices(services) {
  const indoorContainer = document.getElementById('indoor-services');
  const repairContainer = document.getElementById('repair-services');

  if (!indoorContainer || !repairContainer) return;

  const indoorServices = services.filter(s => s.category === 'indoor');
  const repairServices = services.filter(s => s.category === 'repair');

  indoorContainer.innerHTML = indoorServices.map(service => `
    <div class="service-card bg-gray-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
      <img src="assets/icons/${service.icon}" class="w-12 h-12 mx-auto mb-4 text-blue-600" alt="${service.name}">
      <h4 class="text-lg font-medium mb-2">${service.name}</h4>
      <p class="text-gray-600 text-sm mb-3">${service.description}</p>
    </div>
  `).join('');

  repairContainer.innerHTML = repairServices.map(service => `
    <div class="service-card bg-gray-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
      <img src="assets/icons/${service.icon}" class="w-12 h-12 mx-auto mb-4 text-blue-600" alt="${service.name}">
      <h4 class="text-lg font-medium mb-2">${service.name}</h4>
      <p class="text-gray-600 text-sm mb-3">${service.description}</p>
    </div>
  `).join('');
}

// Populate service type select
function populateServiceSelect(services) {
  const serviceSelect = document.getElementById('service-type');
  if (serviceSelect) {
    serviceSelect.innerHTML = '<option value="">Select Service</option>' + services.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
  }
}

      // <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded request-service-btn" data-service="${service.name}">Request Service</button>
