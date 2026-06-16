// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productName, price) {
  const existingItem = cart.find(item => item.name === productName);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: parseFloat(price),
      quantity: 1
    });
  }
  
  saveCart();
  updateCartBadge();
  alert(`${productName} added to cart!`);
}

// Remove item from cart
function removeFromCart(productName) {
  cart = cart.filter(item => item.name !== productName);
  saveCart();
  displayCart();
  updateCartBadge();
}

// Update item quantity
function updateQuantity(productName, quantity) {
  const item = cart.find(item => item.name === productName);
  if (item) {
    item.quantity = parseInt(quantity);
    if (item.quantity <= 0) {
      removeFromCart(productName);
    } else {
      saveCart();
      displayCart();
      updateCartBadge();
    }
  }
}

// Display cart items
function displayCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  const emptyCartDiv = document.getElementById('emptyCart');
  const cartContent = document.getElementById('cartContent');
  
  if (cart.length === 0) {
    if (cartContent) cartContent.style.display = 'none';
    if (emptyCartDiv) emptyCartDiv.style.display = 'block';
    return;
  }
  
  if (cartContent) cartContent.style.display = 'block';
  if (emptyCartDiv) emptyCartDiv.style.display = 'none';
  
  let cartHTML = '';
  cart.forEach(item => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    cartHTML += `
      <div class="cart-item">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>Price: $${item.price.toFixed(2)}</p>
        </div>
        <div class="item-quantity">
          <label>Quantity:</label>
          <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity('${item.name}', this.value)">
        </div>
        <div class="item-total">
          <p>Subtotal: $${itemTotal}</p>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
      </div>
    `;
  });
  
  if (cartItemsDiv) {
    cartItemsDiv.innerHTML = cartHTML;
  }
  
  updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  
  const totalItemsSpan = document.getElementById('totalItems');
  const totalPriceSpan = document.getElementById('totalPrice');
  
  if (totalItemsSpan) totalItemsSpan.textContent = totalItems;
  if (totalPriceSpan) totalPriceSpan.textContent = totalPrice;
}

// Update cart badge in navigation
function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  let badge = document.getElementById('cartBadge');
  
  if (totalItems > 0) {
    if (!badge) {
      const cartLink = document.querySelector('nav a[href="cart.html"]');
      if (cartLink) {
        badge = document.createElement('span');
        badge.id = 'cartBadge';
        badge.className = 'cart-badge';
        cartLink.appendChild(badge);
      }
    }
    if (badge) badge.textContent = totalItems;
  } else {
    if (badge) badge.remove();
  }
}

// Load HTML sections dynamically
async function loadSection(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}: ${response.status}`);
    }
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error('Error loading section:', error);
  }
}

// Set active navigation link
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Set active navigation
  setActiveNav();
  
  // Update cart badge on page load
  updateCartBadge();
  
  // Display cart if on cart page
  if (window.location.pathname.includes('cart.html')) {
    displayCart();
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        alert('Thank you for your purchase! This is a demo checkout.');
        cart = [];
        saveCart();
        displayCart();
        updateCartBadge();
      });
    }
    
    // Continue shopping button
    const continueShoppingBtn = document.getElementById('continueShopping');
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', function() {
        window.location.href = 'shop.html';
      });
    }
    
    // Shop now button (empty cart)
    const shopNowBtn = document.getElementById('shopNow');
    if (shopNowBtn) {
      shopNowBtn.addEventListener('click', function() {
        window.location.href = 'shop.html';
      });
    }
  }
  
  // Add smooth scroll behavior
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // Allow normal navigation for different pages
      if (href !== '#') {
        return;
      }
      e.preventDefault();
    });
  });

  // Add to cart functionality
  document.querySelectorAll('.product button').forEach(button => {
    button.addEventListener('click', function() {
      const productCard = this.parentElement;
      const productName = productCard.querySelector('h3').textContent;
      const priceText = productCard.querySelector('p:nth-of-type(2)').textContent;
      const price = priceText.replace('$', '').replace(',', '');
      
      addToCart(productName, price);
    });
  });

  // Optional: Handle form submission
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
      form.reset();
    });
  }
});
