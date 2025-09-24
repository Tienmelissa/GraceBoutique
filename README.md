# 🛍️ Grâce-Boutique

### Navigation

- **Accueil** (`index.html`) : Présentation et avis clients
- **Accessoires Homme** (`pages/hommes.html`) : Catalogue bijoux masculins
- **Accessoires Femme** (`pages/femmes.html`) : Catalogue bijoux féminins
- **Bibles** (`pages/bibles.html`) : Livres et carnets spirituels
- **Panier** (`pages/commande.html`) : Gestion des commandes

### Fonctionnement du Panier

1. Sélectionner la quantité désirée
2. Cliquer sur "Ajouter au panier"
3. Aller sur la page panier pour finaliser
4. Cliquer sur "Commander via WhatsApp"

## 🎨 Personnalisation

### Modifier les Couleurs

Éditer les variables CSS dans `styles.css` :

```css
:root {
  --primary-color: rgb(184, 148, 31); /* Couleur principale */
  --accent-gold: rgb(184, 148, 31); /* Couleur accent */
  --bg-color: #fefefe; /* Arrière-plan */
}
```

### Changer le Thème Sombre

```css
[data-theme="dark"] {
  --primary-color: rgb(184, 148, 31);
  --bg-color: #1a1a1a;
  --text-color: #d4d4d4;
}
```

## 📦 Ajouter du Contenu

### 🆕 Ajouter un Nouveau Produit

**Étape 1 :** Ouvrir le fichier `data/products.json`

**Étape 2 :** Choisir la catégorie (`hommes`, `femmes`, ou `bibles`)

**Étape 3 :** Ajouter le nouveau produit avec un ID numérique :

```json
{
  "hommes": [
    // ... produits existants ...
    {
      "id": 8, // ⚡ ID numérique (suivant logique)
      "name": "Nom du Nouveau Produit",
      "image": "assets/nouveau-produit.jpg",
      "description": "Description courte du produit",
      "price": 2500, // Prix en FCFA
      "available": true, // true = disponible, false = rupture
      "category": "hommes" // Catégorie correspondante
    }
  ]
}
```

**Étape 4 :** Ajouter l'image dans le dossier `assets/`

### 📋 Règles pour les IDs

- **Hommes** : Utiliser des numéros à partir de 8 (1-7 déjà pris)
- **Femmes** : Utiliser des numéros à partir de 16 (1-15 déjà pris)
- **Bibles** : Utiliser des numéros à partir de 6 (1-5 déjà pris)

### 💡 Exemple Complet

```json
{
  "femmes": [
    // ... produits existants ...
    {
      "id": 16,
      "name": "Bague Espoir-Or",
      "image": "assets/bague-espoir-or.jpg",
      "description": "Bague avec inscription Espoir en finition dorée",
      "price": 1200,
      "available": true,
      "category": "femmes"
    }
  ]
}
```

### Ajouter des Avis Clients

Éditer `reviews.json` :

```json
{
  "reviews": [
    {
      "id": 7,
      "name": "Nouveau Client",
      "photo": "URL_photo",
      "rating": 5,
      "text": "Excellent service !"
    }
  ]
}
```

## 🛠️ Configuration Avancée

### Modifier les Informations de Contact

Dans chaque fichier HTML, modifier :

```html
<a href="mailto:votre-email@exemple.com" id="email-contact">
  <a href="https://wa.me/VOTRE_NUMERO" id="whatsapp-contact"></a
></a>
```

### Personnaliser le Message WhatsApp

Dans `script.js`, modifier la fonction `generateOrderMessage()` :

```javascript
const message = `Bonjour ! Je souhaite commander :\n\n${orderDetails}\n\nTotal: ${total} FCFA\n\nMerci !`;
```

## Structure du Projet

```
grace-boutique/
├── 📄 index.html                    # Page d'accueil (SEULE à la racine)
├── 📄 README.md                     # Documentation principale
├── 📄 STRUCTURE-PROJET.md           # Guide de structure
│
├── � cpages/                        # Toutes les autres pages
│   ├── hommes.html                  # Accessoires homme
│   ├── femmes.html                  # Accessoires femme
│   ├── bibles.html                  # Bibles et carnets
│   └── commande.html                # Page panier
│
├── 📁 css/                          # Styles
│   └── styles.css                   # CSS principal
│
├── 📁 js/                           # Scripts JavaScript
│   └── script.js                    # JavaScript principal
│
├── 📁 data/                         # Données JSON
│   ├── products.json                # 📊 Catalogue produits
│   └── reviews.json                 # 💬 Avis clients
│
├── 📁 assets/                       # Images et médias
│   ├── homme1.jpg → homme7.jpg      # Images accessoires hommes
│   ├── femme1.jpg → femme15.jpg     # Images accessoires femmes
│   └── bible1.jpg → bible5.jpg      # Images bibles
│
└── 📁 docs/                         # Documentation
    └── GUIDE-UTILISATION.md         # Guide utilisateur
```

**Grâce-Boutique** - Site e-commerce moderne et responsive 🛍️✨
"# GraceBoutique" 
