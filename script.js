// Cocktail data
const cocktailCategories = {
    "Directos": [
        {
            name: "Sea Breeze",
            image: "seabrezz.jpg",
            description: "Vodka, jugo de arándano y pomelo. Refrescante y ligero."
        },
        {
            name: "Tequila Sunrise",
            image: "tequilasunrise.jpg",
            description: "Tequila, jugo de naranja y granadina. Color y sabor vibrante."
        },
        {
            name: "Blue Lagoon",
            image: "Blue lagon.jpg",
            description: "Vodka, curaçao azul y soda de limón. Tropical e intenso."
        },
        {
            name: "Gin Tonic",
            image: "gintonic.jpg",
            description: "Gin premium con tónica y limón. Clásico y elegante."
        }
    ],
    "Shakeados": [
        {
            name: "Cosmopolitan",
            image: "cosmo.jpg",
            description: "Vodka, Cointreau, lima y arándano. Glamour puro."
        },
        {
            name: "Strawberry Margarita",
            image: "strawberry.jpg",
            description: "Tequila, fresa, licor de naranja y limón. Dulce y rosa."
        },
        {
            name: "Pisco Sour",
            image: "Pisco sour.jpg",
            description: "Pisco, limón, azúcar y clara de huevo. Perfectamente equilibrado."
        }
    ],
    "Licuados": [
        {
            name: "Piña Colada",
            image: "piñacolada.jpg",
            description: "Ron, piña y crema de coco. Dulce y tropical."
        },
        {
            name: "Frozen Daiquiri",
            image: "daiquiri.jpg",
            description: "Ron, limón, azúcar y frutas. Fresco y frappé."
        },
        {
            name: "Miami Vice",
            image: "miami.jpg",
            description: "Mitad Piña Colada, mitad Strawberry Daiquiri. Un clásico tropical a capas."
        }
    ],
    "Sin Alcohol": [
        {
            name: "Shirley Temple",
            image: "shirley.jpg",
            description: "Ginger ale, granadina y cereza. Dulce y divertido."
        },
        {
            name: "Sunset Punch",
            image: "sunrise.jpg",
            description: "Jugo de naranja, granadina y soda. Colorido y tropical."
        },
        {
            name: "Virgin Mojito",
            image: "mojito.jpg",
            description: "Menta, lima, azúcar y soda. Refrescante y aromático."
        }
    ]
};

// State management
let selectedCocktails = [];
let expandedCategories = {};

// DOM elements
const categoriesContainer = document.getElementById('cocktail-categories');
const clientNameInput = document.getElementById('client-name');
const eventDateInput = document.getElementById('event-date');
const selectedListContainer = document.getElementById('selected-list');
const whatsappBtn = document.getElementById('whatsapp-btn');

// Initialize the app
function init() {
    // Expandir todas las categorías por defecto
    Object.keys(cocktailCategories).forEach(category => {
        expandedCategories[category] = true;
    });
    
    renderCategories();
    updateSelectedList();
    updateWhatsAppButton();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.min = today;
    
    // Event listeners
    clientNameInput.addEventListener('input', updateWhatsAppButton);
    eventDateInput.addEventListener('change', updateWhatsAppButton);
    whatsappBtn.addEventListener('click', sendWhatsAppMessage);
}

// Render cocktail categories
function renderCategories() {
    categoriesContainer.innerHTML = '';
    
    Object.entries(cocktailCategories).forEach(([category, cocktails]) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        
        categorySection.innerHTML = `
            <div class="category-header" onclick="toggleCategory('${category}')">
                <h2 class="category-title">${category}</h2>
                <span class="category-arrow ${expandedCategories[category] ? 'expanded' : ''}">▼</span>
            </div>
            <div class="cocktail-grid ${expandedCategories[category] ? 'expanded' : ''}" id="grid-${category}">
                ${cocktails.map(cocktail => createCocktailCard(cocktail)).join('')}
            </div>
        `;
        
        categoriesContainer.appendChild(categorySection);
    });
}

// Create cocktail card HTML
function createCocktailCard(cocktail) {
    const isSelected = selectedCocktails.includes(cocktail.name);
    
    return `
        <div class="cocktail-card ${isSelected ? 'selected' : ''}" onclick="toggleCocktailSelection('${cocktail.name}')">
            <img src="${cocktail.image}" alt="${cocktail.name}" class="cocktail-image">
            <div class="cocktail-content">
                <h3 class="cocktail-name">${cocktail.name}</h3>
                <p class="cocktail-description">${cocktail.description}</p>
                <div class="cocktail-selector">
                    <div class="cocktail-checkbox ${isSelected ? 'checked' : ''}"></div>
                    <span class="cocktail-selector-text">Seleccionar</span>
                </div>
            </div>
        </div>
    `;
}

// Toggle category expansion
function toggleCategory(category) {
    expandedCategories[category] = !expandedCategories[category];
    
    const arrow = document.querySelector(`[onclick="toggleCategory('${category}')"] .category-arrow`);
    const grid = document.getElementById(`grid-${category}`);
    
    if (expandedCategories[category]) {
        arrow.classList.add('expanded');
        grid.classList.add('expanded');
    } else {
        arrow.classList.remove('expanded');
        grid.classList.remove('expanded');
    }
}

// Toggle cocktail selection
function toggleCocktailSelection(cocktailName) {
    const index = selectedCocktails.indexOf(cocktailName);
    
    if (index > -1) {
        selectedCocktails.splice(index, 1);
    } else {
        selectedCocktails.push(cocktailName);
    }
    
    renderCategories();
    updateSelectedList();
    updateWhatsAppButton();
}

// Update selected cocktails list
function updateSelectedList() {
    if (selectedCocktails.length === 0) {
        selectedListContainer.innerHTML = '<p style="color: #666; font-style: italic;">Ningún cóctel seleccionado</p>';
        return;
    }
    
    selectedListContainer.innerHTML = selectedCocktails
        .map(cocktail => `<span class="selected-item">${cocktail}</span>`)
        .join('');
}

// Update WhatsApp button state
function updateWhatsAppButton() {
    const hasName = clientNameInput.value.trim().length > 0;
    const hasDate = eventDateInput.value.length > 0;
    const hasCocktails = selectedCocktails.length > 0;
    
    whatsappBtn.disabled = !(hasName && hasDate && hasCocktails);
}

// Send WhatsApp message
function sendWhatsAppMessage() {
    const clientName = clientNameInput.value.trim();
    const eventDate = new Date(eventDateInput.value).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const message = `¡Hola! Soy ${clientName} Me gustaría coordinar los siguientes pasos para confirmar la experiencia con Sambar, cuidando cada detalle del servicio solicitado.

📅 Fecha del evento: ${eventDate}
🍸 Cócteles seleccionados:
${selectedCocktails.map(cocktail => `• ${cocktail}`).join('\n')}

¡Espero su respuesta para coordinar los detalles!`;

    const phone = "51901139911"; // Número de Perú con código de país
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
}

// Make functions globally available
window.toggleCategory = toggleCategory;
window.toggleCocktailSelection = toggleCocktailSelection;

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded
    init();
}

// Fallback initialization after a short delay
setTimeout(() => {
    if (categoriesContainer && categoriesContainer.innerHTML.includes('Cargando cócteles...')) {
        console.log('Ejecutando inicialización de respaldo...');
        init();
    }
}, 1000);