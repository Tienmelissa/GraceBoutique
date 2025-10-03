// ======== GESTION DU PANIER ========
let cart = JSON.parse(localStorage.getItem("graceBoutiqueCart")) || {};
// Mettre à jour le compteur du panier
function updateCartCount() {
  const cartCountElem = document.getElementById("cart-count");
  const totalQty = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
  if (cartCountElem) cartCountElem.textContent = totalQty;
}

// Ajouter un produit au panier
function addToCart(productId, productName, productPrice, productImage, qtyInputId) {
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
    };
  }

  localStorage.setItem("graceBoutiqueCart", JSON.stringify(cart));
  updateCartCount();

  // Animation de confirmation
  const button = qtyInput.parentElement.querySelector(".add-to-cart");
  const originalText = button.textContent;
  button.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon> Ajouté !';
  button.style.backgroundColor = "#27ae60";

  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.backgroundColor = "#f2b807";
  }, 1500);

  qtyInput.value = 1;
}

// Supprimer un produit du panier
function removeFromCart(productId) {
  delete cart[productId];
  localStorage.setItem("graceBoutiqueCart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

// Modifier la quantité d'un produit
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

// Modifier la quantité depuis l'input
function updateQuantityFromInput(productId, newQuantity) {
  const qty = parseInt(newQuantity);
  
  if (isNaN(qty) || qty < 1) {
    // Si la quantité est invalide, remettre l'ancienne valeur
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

// Fonction utilitaire pour générer une couleur
function getColorFromId(id) {
  const colors = ['B8941F', 'D4A006', 'C8963C', 'E6B800', 'F2C94C'];
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

// Afficher le contenu du panier
function displayCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalContainer = document.getElementById("cart-total");

  if (!cartItemsContainer) {
    console.warn("⚠️ Container cart-items non trouvé");
    return;
  }

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
    
    // Créer l'image avec gestion d'erreur JavaScript
    const imageContainer = document.createElement("div");
    imageContainer.className = "cart-item-image";
    
    const img = document.createElement("img");
    // Utiliser la vraie image du produit ou fallback
    const imageUrl = item.image || `https://via.placeholder.com/90x90/${getColorFromId(item.id)}/ffffff?text=${encodeURIComponent(item.name.substring(0, 3))}`;
    
    img.src = imageUrl;
    img.alt = item.name;
    img.style.width = "90px";
    img.style.height = "90px";
    img.style.borderRadius = "8px";
    img.style.objectFit = "cover";
    
    // Gestion d'erreur avec JavaScript - fallback vers placeholder coloré
    img.onerror = function() {
      // Créer un div de remplacement
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
      
      // Remplacer l'image par le div
      this.parentNode.replaceChild(fallbackDiv, this);
    };
    
    imageContainer.appendChild(img);
    
    // Créer le reste du contenu
    const itemInfo = document.createElement("div");
    itemInfo.className = "cart-item-info";
    itemInfo.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.price.toLocaleString()} FCFA × ${item.qty} = ${itemTotal.toLocaleString()} FCFA</p>
    `;
    
    const itemControls = document.createElement("div");
    itemControls.className = "cart-item-controls";
    itemControls.innerHTML = `
      <button onclick="updateQuantity('${item.id}', -1)" class="qty-btn minus-btn" title="Diminuer la quantité">
        <span class="icon-fallback">−</span>
      </button>
      <input type="number" class="quantity-input" value="${item.qty}" min="1" max="99" 
             onchange="updateQuantityFromInput('${item.id}', this.value)" 
             onblur="updateQuantityFromInput('${item.id}', this.value)"
             title="Quantité">
      <button onclick="updateQuantity('${item.id}', 1)" class="qty-btn plus-btn" title="Augmenter la quantité">
        <span class="icon-fallback">+</span>
      </button>
      <button onclick="removeFromCart('${item.id}')" class="remove-btn" title="Supprimer l'article">
        <span class="icon-fallback">×</span>
      </button>
    `;
    
    // Assembler l'élément
    cartItem.appendChild(imageContainer);
    cartItem.appendChild(itemInfo);
    cartItem.appendChild(itemControls);
    
    cartItemsContainer.appendChild(cartItem);
  });

  if (cartTotalContainer) {
    cartTotalContainer.innerHTML = `<strong>Total: ${total.toLocaleString()} FCFA</strong>`;
  }
}

// Générer le message de commande pour WhatsApp
function generateOrderMessage() {
  if (Object.keys(cart).length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  let message = "🛍️ *Nouvelle commande Grâce-Boutique*\n\n";
  let total = 0;

  Object.values(cart).forEach((item) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    message += `• ${item.name}\n  Quantité: ${
      item.qty
    }\n  Prix unitaire: ${item.price.toLocaleString()} FCFA\n  Sous-total: ${itemTotal.toLocaleString()} FCFA\n\n`;
  });

  message += ` *Total: ${total.toLocaleString()} FCFA*\n\n`;
  message +=
    "Je souhaite passer cette commande. Merci de me confirmer la disponibilité et les modalités de livraison.";

  const phone = "22667340582";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
}

// Lier les boutons "Ajouter au panier" (une seule fois)
function bindCartButtons() {
  // Supprimer les anciens événements pour éviter la duplication
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  // Ajouter les nouveaux événements
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = parseInt(btn.getAttribute("data-price"));
      const image = btn.getAttribute("data-image");
      const qtyId = btn.getAttribute("data-qty");
      addToCart(id, name, price, image, qtyId);
    });
  });
}

// Bouton panier dans la navigation
function initCartNavigation() {
  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      // Détecter si on est dans le dossier pages/ ou à la racine
      const isInPagesFolder = window.location.pathname.includes('/pages/');
      window.location.href = isInPagesFolder ? "commande.html" : "pages/commande.html";
    });
  }
}