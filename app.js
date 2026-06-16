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

  // Optional: Add to cart functionality
  document.querySelectorAll('.product button').forEach(button => {
    button.addEventListener('click', function() {
      const productName = this.parentElement.querySelector('h3').textContent;
      alert(`${productName} added to cart!`);
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
