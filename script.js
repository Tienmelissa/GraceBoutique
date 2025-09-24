// ======== GRÂCE-BOUTIQUE - SCRIPT PRINCIPAL ========

// ======== VARIABLES GLOBALES ========
let products = {};
let cart = JSON.parse(localStorage.getItem("graceBoutiqueCart")) || {};

// ======== FONCTIONS UTILITAIRES ========
// Fonction pour obtenir le bon chemin selon le contexte
function getDataPath(filename) {
  const isInPagesFolder = window.location.pathname.includes('/pages/');
  return isInPagesFolder ? `../data/${filename}` : `data/${filename}`;
}

// Fonction pour obtenir le bon chemin d'image selon le contexte
function getImagePath(imagePath) {
  const isInPagesFolder = window.location.pathname.includes('/pages/');
  return isInPagesFolder ? `../${imagePath}` : imagePath;
}

function getColorFromId(id) {
  const colors = ['B8941F', 'D4A006', 'C8963C', 'E6B800', 'F2C94C'];
  const index = id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

// ======== GESTION DES PRODUITS ========
async function loadProducts() {
  try {
    const response = await fetch(getDataPath("products.json"));
    products = await response.json();
  } catch (error) {
    console.error("Erreur lors du chargement des produits:", error);
  }
}

// ======== GESTION DES AVIS CLIENTS ========
async function loadReviews() {
  try {
    const response = await fetch(getDataPath("reviews.json"));
    const data = await response.json();
    const reviewsContainer = document.getElementById("reviews-container");
    
    if (reviewsContainer && data.reviews) {
      reviewsContainer.innerHTML = data.reviews.map(review => {
        const stars = "⭐".repeat(review.rating);
        return `
          <div class="review-card">
            <div class="review-header">
              <img src="${getImagePath(review.photo)}" alt="${review.name}" class="reviewer-photo">
              <div class="reviewer-info">
                <h4>${review.name}</h4>
                <div class="stars">${stars}</div>
              </div>
            </div>
            <p class="review-text">"${review.text}"</p>
          </div>
        `;
      }).join('');
    }
  } catch (error) {
    console.error("Erreur lors du chargement des avis:", error);
  }
}

// ======== GESTION DU PANIER ========
function updateCartCount() {
  const cartCountElem = document.getElementById("cart-count");
  const totalQty = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
  if (cartCountElem) cartCountElem.textContent = totalQty;
}

function addToCart(productId, productName, productPrice, productImage, qtyInputId, isReservation = false) {
  const qtyInput = document.getElementById(qtyInputId);
  const qty = parseInt(qtyInput.value);

  if (isNaN(qty) || qty <= 0) {
    alert("Veuillez entrer une quantité valide.");
    return;
  }

  if (cart[productId]) {
    cart[productId].qty += qty;
  } else {
    cart[productId] = {
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      qty: qty,
      isReservation: isReservation
    };
  }

  localStorage.setItem("graceBoutiqueCart", JSON.stringify(cart));
  updateCartCount();

  // Animation de confirmation
  const button = qtyInput.parentElement.querySelector(".add-to-cart, .reserve-btn");
  const originalText = button.innerHTML;
  const confirmText = isReservation ? 
    '<span class="btn-icon">📋</span> Réservé !' : 
    '<span class="btn-icon">✓</span> Ajouté !';
  
  button.innerHTML = confirmText;
  button.style.backgroundColor = "#27ae60";

  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.backgroundColor = isReservation ? "#e67e22" : "#f2b807";
  }, 1500);

  qtyInput.value = 1;
}

function removeFromCart(productId) {
  delete cart[productId];
  localStorage.setItem("graceBoutiqueCart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

function updateQuantity(productId, change) {
  if (cart[productId]) {
    cart[productId].qty += change;
    if (cart[productId].qty <= 0) {
      removeFromCart(productId);
      return;
    }
    localStorage.setItem("graceBoutiqueCart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
  }
}

function updateQuantityFromInput(productId, newQuantity) {
  const qty = parseInt(newQuantity);
  
  if (isNaN(qty) || qty < 1) {
    displayCart();
    return;
  }
  
  if (cart[productId]) {
    cart[productId].qty = qty;
    localStorage.setItem("graceBoutiqueCart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
  }
}

function displayCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (Object.keys(cart).length === 0) {
    cartItemsContainer.innerHTML =
      '<p style="text-align: center; color: #666; padding: 40px;">Votre panier est vide</p>';
    if (cartTotalContainer) cartTotalContainer.textContent = "0 FCFA";
    return;
  }

  Object.values(cart).forEach((item) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    
    // Créer l'image avec gestion d'erreur
    const imageContainer = document.createElement("div");
    imageContainer.className = "cart-item-image";
    
    const img = document.createElement("img");
    const imageUrl = item.image ? getImagePath(item.image) : `https://via.placeholder.com/90x90/${getColorFromId(item.id)}/ffffff?text=${encodeURIComponent(item.name.substring(0, 3))}`;
    
    img.src = imageUrl;
    img.alt = item.name;
    img.style.width = "90px";
    img.style.height = "90px";
    img.style.borderRadius = "8px";
    img.style.objectFit = "cover";
    
    img.onerror = function() {
      const fallbackDiv = document.createElement("div");
      fallbackDiv.style.width = "90px";
      fallbackDiv.style.height = "90px";
      fallbackDiv.style.backgroundColor = `#${getColorFromId(item.id)}`;
      fallbackDiv.style.color = "white";
      fallbackDiv.style.display = "flex";
      fallbackDiv.style.alignItems = "center";
      fallbackDiv.style.justifyContent = "center";
      fallbackDiv.style.fontSize = "16px";
      fallbackDiv.style.fontWeight = "bold";
      fallbackDiv.style.borderRadius = "8px";
      fallbackDiv.textContent = item.name.substring(0, 3).toUpperCase();
      
      this.parentNode.replaceChild(fallbackDiv, this);
    };
    
    imageContainer.appendChild(img);
    
    const itemInfo = document.createElement("div");
    itemInfo.className = "cart-item-info";
    const reservationBadge = item.isReservation ? ' <span style="background: #e67e22; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">RÉSERVATION</span>' : '';
    itemInfo.innerHTML = `
      <h4>${item.name}${reservationBadge}</h4>
      <p>${item.price.toLocaleString()} FCFA × ${item.qty} = ${itemTotal.toLocaleString()} FCFA</p>
    `;
    
    const itemControls = document.createElement("div");
    itemControls.className = "cart-item-controls";
    itemControls.innerHTML = `
      <button onclick="updateQuantity('${item.id}', -1)" class="qty-btn minus-btn" title="Diminuer la quantité">
        <span class="btn-icon">−</span>
      </button>
      <input type="number" class="quantity-input" value="${item.qty}" min="1" max="99" 
             onchange="updateQuantityFromInput('${item.id}', this.value)" 
             onblur="updateQuantityFromInput('${item.id}', this.value)"
             title="Quantité">
      <button onclick="updateQuantity('${item.id}', 1)" class="qty-btn plus-btn" title="Augmenter la quantité">
        <span class="btn-icon">+</span>
      </button>
      <button onclick="removeFromCart('${item.id}')" class="remove-btn" title="Supprimer l'article">
        <span class="btn-icon">×</span>
      </button>
    `;
    
    cartItem.appendChild(imageContainer);
    cartItem.appendChild(itemInfo);
    cartItem.appendChild(itemControls);
    
    cartItemsContainer.appendChild(cartItem);
  });

  if (cartTotalContainer) {
    cartTotalContainer.innerHTML = `<strong>Total: ${total.toLocaleString()} FCFA</strong>`;
  }
}

function generateOrderMessage() {
  if (Object.keys(cart).length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  let message = "🛍️ *Nouvelle commande Grâce-Boutique*\n\n";
  let total = 0;
  let hasReservations = false;

  Object.values(cart).forEach((item) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    
    // Vérifier si c'est une réservation
    const isReservation = item.isReservation || false;
    const statusText = isReservation ? " (RÉSERVATION)" : "";
    
    if (isReservation) hasReservations = true;
    
    message += `• ${item.name}${statusText}\n  Quantité: ${
      item.qty
    }\n  Prix unitaire: ${item.price.toLocaleString()} FCFA\n  Sous-total: ${itemTotal.toLocaleString()} FCFA\n\n`;
  });

  message += ` *Total: ${total.toLocaleString()} FCFA*\n\n`;
  
  if (hasReservations) {
    message += "⚠️ *Note: Cette commande contient des articles en réservation.*\n\n";
  }
  
  message +=
    "Je souhaite passer cette commande. Merci de me confirmer la disponibilité et les modalités de livraison.";

  const phone = "22667340582";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
}

function bindCartButtons() {
  // Gérer les boutons "Ajouter au panier"
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = parseInt(btn.getAttribute("data-price"));
      const image = btn.getAttribute("data-image");
      const qtyId = btn.getAttribute("data-qty");
      addToCart(id, name, price, image, qtyId, false);
    });
  });

  // Gérer les boutons "Réserver"
  document.querySelectorAll(".reserve-btn").forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  document.querySelectorAll(".reserve-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = parseInt(btn.getAttribute("data-price"));
      const image = btn.getAttribute("data-image");
      const qtyId = btn.getAttribute("data-qty");
      addToCart(id, name, price, image, qtyId, true);
    });
  });
}

// ======== GESTION DES CARTES PRODUITS ========
function setupProductCards() {
  document.querySelectorAll('.product').forEach(product => {
    const description = product.querySelector('.description');
    if (description) {
      const fullText = description.textContent;
      const maxLength = 120;
      
      if (fullText.length > maxLength) {
        const truncatedText = fullText.substring(0, maxLength) + '...';
        description.textContent = truncatedText;
        description.classList.add('expandable');
        
        // Créer la structure de retournement
        setupFlipCard(product, fullText);
        
        // Événement de clic pour retourner
        description.addEventListener('click', (e) => {
          e.stopPropagation();
          product.classList.add('flipped');
        });
        
        // Événement de survol pour retourner automatiquement
        product.addEventListener('mouseenter', () => {
          product.classList.add('flipped');
        });
        
        // Événement pour revenir quand la souris quitte
        product.addEventListener('mouseleave', () => {
          product.classList.remove('flipped');
        });
      }
    }
  });
}

function setupFlipCard(productElement, fullDescription) {
  if (!productElement.querySelector('.product-inner')) {
    const content = productElement.innerHTML;
    productElement.innerHTML = `
      <div class="product-inner">
        <div class="product-front">
          ${content}
        </div>
        <div class="product-back">
          <div class="full-description">${fullDescription}</div>
          <button class="back-to-front" onclick="event.stopPropagation(); this.closest('.product').classList.remove('flipped');">← Retour</button>
        </div>
      </div>
    `;
  }
}

// ======== GESTION DU THÈME ========
function initTheme() {
  const savedTheme = localStorage.getItem('graceTheme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeButton(currentTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('graceTheme', newTheme);
  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const icon = themeBtn.querySelector('ion-icon');
    if (icon) {
      icon.setAttribute('name', theme === 'dark' ? 'sunny-outline' : 'moon-outline');
    }
    themeBtn.title = theme === 'dark' ? 'Mode clair' : 'Mode sombre';
  }
}

// ======== MENU BURGER ========
function initBurgerMenu() {
  const burgerMenu = document.getElementById('burger-menu');
  const navMenu = document.getElementById('nav-menu');
  
  if (burgerMenu && navMenu) {
    burgerMenu.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      const icon = burgerMenu.querySelector('ion-icon');
      if (navMenu.classList.contains('active')) {
        icon.setAttribute('name', 'close-outline');
      } else {
        icon.setAttribute('name', 'menu-outline');
      }
    });
    
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = burgerMenu.querySelector('ion-icon');
        icon.setAttribute('name', 'menu-outline');
      });
    });
    
    document.addEventListener('click', function(event) {
      if (!burgerMenu.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('active');
        const icon = burgerMenu.querySelector('ion-icon');
        icon.setAttribute('name', 'menu-outline');
      }
    });
  }
}

// ======== NAVIGATION ========
function initCartNavigation() {
  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      const isInPagesFolder = window.location.pathname.includes('/pages/');
      window.location.href = isInPagesFolder ? "commande.html" : "pages/commande.html";
    });
  }
}

function initWhatsAppContact() {
  const whatsappBtn = document.getElementById("whatsapp-contact");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const phone = "22667340582";
      const text = encodeURIComponent(
        "Bonjour, je souhaite obtenir des informations sur vos produits."
      );
      const url = `https://wa.me/${phone}?text=${text}`;
      window.open(url, "_blank");
    });
  }
}

// ======== COMMENTAIRES CLIENTS ========
function initCommentForm() {
  const commentForm = document.getElementById("comment-form");
  if (commentForm) {
    commentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const nom = this.nom.value.trim();
      const commentaire = this.commentaire.value.trim();
      if (!nom || !commentaire) return;

      const li = document.createElement("li");
      li.textContent = `${nom} : ${commentaire}`;
      const list = document.getElementById("comment-list");
      if (list) list.appendChild(li);

      this.reset();
      alert("Merci pour votre retour !");
    });
  }
}

// ======== INITIALISATION ========
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialiser le thème en premier
    initTheme();
    
    // Initialiser la navigation
    initBurgerMenu();
    initWhatsAppContact();
    initCartNavigation();
    
    // Charger les données
    await loadProducts();
    await loadReviews();
    
    // Initialiser le panier
    updateCartCount();
    
    // Si on est sur la page commande, afficher le panier
    if (window.location.pathname.includes("commande.html")) {
      displayCart();
    }
    
    // Initialiser les formulaires
    initCommentForm();
    
    // Bouton de changement de thème
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Configurer les cartes produits après un délai
    setTimeout(() => {
      setupProductCards();
      bindCartButtons();
    }, 500);
    
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
  }
});