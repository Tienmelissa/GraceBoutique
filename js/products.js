// ======== GESTION DES PRODUITS ========
let products = {};

// Fonction utilitaire pour obtenir le bon chemin selon le contexte
function getDataPath(filename) {
  // Si on est dans le dossier pages/, remonter d'un niveau
  const isInPagesFolder = window.location.pathname.includes('/pages/');
  return isInPagesFolder ? `../data/${filename}` : `data/${filename}`;
}

// Charger les produits depuis le fichier JSON
async function loadProducts() {
  try {
    const response = await fetch(getDataPath("products.json"));
    products = await response.json();
  } catch (error) {
    console.error("Erreur lors du chargement des produits:", error);
  }
}

// ======== GESTION DES CARTES PRODUITS ========
function setupProductCards() {
  document.querySelectorAll('.product').forEach(product => {
    const description = product.querySelector('.description');
    if (description) {
      const fullText = description.textContent;
      const maxLength = 120; // Nombre de caractères avant troncature
      
      if (fullText.length > maxLength) {
        const truncatedText = fullText.substring(0, maxLength);
        description.textContent = truncatedText;
        description.classList.add('expandable');
        
        // Ajouter l'événement de clic pour retourner la carte
        description.addEventListener('click', (e) => {
          e.stopPropagation();
          flipCard(product, fullText);
        });
      }
    }
  });
}

function flipCard(productElement, fullDescription) {
  // Créer la structure de retournement si elle n'existe pas
  if (!productElement.querySelector('.product-inner')) {
    const content = productElement.innerHTML;
    productElement.innerHTML = `
      <div class="product-inner">
        <div class="product-front">
          ${content}
        </div>
        <div class="product-back">
          <div class="full-description">${fullDescription}</div>
          <button class="back-to-front">← Retour</button>
        </div>
      </div>
    `;
    
    // Ajouter l'événement pour revenir
    const backBtn = productElement.querySelector('.back-to-front');
    backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      productElement.classList.remove('flipped');
    });
  }
  
  // Retourner la carte
  productElement.classList.add('flipped');
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
              <img src="${review.photo}" alt="${review.name}" class="reviewer-photo">
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
    console.error("❌ Erreur lors du chargement des avis:", error);
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