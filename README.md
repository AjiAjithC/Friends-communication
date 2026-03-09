# Friends Communication Electronics Store

A modern, responsive electronics product showcase website built with HTML, Tailwind CSS, and Vanilla JavaScript.

## Features

- Responsive design for mobile and desktop
- Product showcase with category filtering
- Shopping cart functionality
- WhatsApp enquiry integration
- Service request forms
- Hero slider with auto-play
- Modal popups for products and cart
- Clean, modern UI inspired by Amazon/Flipkart

## Project Structure

```
/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Custom styles
├── js/
│   ├── main.js         # Main application logic
│   ├── cart.js         # Cart functionality
│   ├── slider.js       # Hero slider
│   └── modal.js        # Modal management
├── data/
│   └── products.json   # Product data
└── components/
    ├── header.html     # Header and navigation
    ├── slider.html     # Hero slider
    ├── products.html   # Product listing
    ├── services.html   # Service requests
    ├── team.html       # Team section
    └── contact.html    # Contact information
```

## How to Run

1. Clone or download the project
2. Open `index.html` in a web browser
3. For a better experience, serve the files using a local server:
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve .`
   - PHP: `php -S localhost:8000`

## Technologies Used

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript (ES6+)
- JSON for data storage

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Features Overview

### Product Showcase
- Dynamic loading from JSON
- Category filtering (TV, Speakers, Mobile, etc.)
- Product cards with hover effects
- Rating display (when available)

### Cart System
- Add/remove products
- Persistent storage (localStorage)
- Cart count badge
- Enquiry form with WhatsApp integration

### Enquiry System
- Product-specific enquiries
- Cart enquiries
- Service requests
- WhatsApp message generation

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions

## Customization

### Adding Products
Edit `data/products.json` to add new products:

```json
{
  "id": 11,
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "discountPrice": 89.99,
  "rating": 4.5,
  "image": "path/to/image.jpg",
  "category": "Category"
}
```

### Styling
Modify `css/style.css` for custom styles or update Tailwind classes in HTML files.

### WhatsApp Integration
Update phone number in JavaScript files (search for `919994643491`).

## License

This project is for demonstration purposes.