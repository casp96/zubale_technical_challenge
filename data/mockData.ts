import { CATEGORIES, Category, MarketplaceItem } from '@/types/types';

// Original efficient data generation logic
// Original efficient data generation logic
const titles: Record<Category, string[]> = {
    electronics: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Air M2', 'Sony WH-1000XM5', 'iPad Air 5', 'Nintendo Switch OLED', 'Dell XPS 13', 'AirPods Pro'],
    clothing: ['Camiseta Algodón Premium', 'Jeans Slim Fit', 'Chamarra de Cuero', 'Vestido Floral Verano', 'Tenis Deportivos Running', 'Sudadera con Capucha', 'Traje Formal Azul'],
    home: ['Sofá 3 Plazas Gris', 'Lámpara de Pie Moderna', 'Juego de Sábanas King', 'Escritorio Minimalista', 'Silla Ergonómica', 'Cafetera Italiana', 'Set de Cuchillos Chef'],
    beauty: ['Serum Vitamina C', 'Crema Hidratante Facial', 'Kit de Maquillaje', 'Perfume Floral', 'Mascarilla Capilar', 'Aceite Esencial Lavanda'],
    toys: ['LEGO Star Wars', 'Muñeca Coleccionable', 'Juego de Mesa Familiar', 'Drone con Cámara', 'Rompecabezas 1000 Piezas', 'Peluche Gigante', 'Carro Control Remoto'],
    sports: ['Balón de Fútbol Pro', 'Tapete de Yoga Antideslizante', 'Mancuernas 5kg', 'Bicicleta de Montaña', 'Raqueta de Tenis', 'Reloj Deportivo GPS'],
    books: ['Hábitos Atómicos', 'El Principito', 'Cien Años de Soledad', 'Harry Potter Colección', 'Ciencia Ficción Clásica', 'Libro de Cocina Mexicana'],
    automotive: ['Kit de Limpieza Auto', 'Aceite Sintético Motor', 'Soporte Celular Auto', 'Aspiradora Portátil', 'Cubierta para Asientos', 'Cámara de Reversa'],
};

const locations = ['CDMX Store', 'Guadalajara Warehouse', 'Monterrey Hub', 'Puebla Center', 'Online Store', 'Envío Nacional', 'Tijuana Branch'];

const descriptions: Record<Category, string[]> = {
    electronics: [
        'Última tecnología con rendimiento excepcional y batería de larga duración.',
        'Diseño elegante y potente procesador para todas tus tareas diarias.',
        'Experiencia inmersiva con sonido de alta fidelidad y cancelación de ruido.',
    ],
    clothing: [
        'Confeccionado con materiales de alta calidad para máxima comodidad y estilo.',
        'Diseño moderno ideal para cualquier ocasión, casual o formal.',
        'Ajuste perfecto y durabilidad garantizada. Disponible en varios colores.',
    ],
    home: [
        'Dale un toque moderno a tu hogar con este diseño exclusivo y funcional.',
        'Materiales resistentes y acabados premium para tu comodidad.',
        'Ideal para optimizar espacios y decorar con estilo.',
    ],
    beauty: [
        'Fórmula avanzada para el cuidado de tu piel. Resultados visibles en semanas.',
        'Ingredientes naturales y libres de crueldad animal.',
        'Realza tu belleza natural con productos de alta gama.',
    ],
    toys: [
        'Diversión garantizada para niños y adultos. Fomenta la creatividad.',
        'Materiales seguros y no tóxicos. Ideal para regalo.',
        'Horas de entretenimiento con este increíble set de juego.',
    ],
    sports: [
        'Mejora tu rendimiento con equipo profesional de alta resistencia.',
        'Diseñado para atletas exigentes. Ligero y duradero.',
        'Ideal para entrenar en casa o en el gimnasio.',
    ],
    books: [
        'Una lectura fascinante que no podrás soltar. Best-seller internacional.',
        'Edición especial con tapa dura e ilustraciones exclusivas.',
        'Aprende nuevas habilidades y expande tu conocimiento.',
    ],
    automotive: [
        'Mantén tu vehículo en perfectas condiciones con este producto esencial.',
        'Accesorios prácticos para mejorar tu experiencia de conducción.',
        'Calidad certificada para el cuidado de tu auto.',
    ],
};

// Technical specs templates
const techSpecs: Record<Category, Record<string, string>> = {
    electronics: { 'Procesador': 'Octa-Core', 'Memoria': '8GB RAM', 'Almacenamiento': '256GB', 'Garantía': '1 Año' },
    clothing: { 'Material': '100% Algodón', 'Talla': 'M, L, XL', 'Cuidados': 'Lavado a mano', 'Origen': 'Hecho en México' },
    home: { 'Dimensiones': '120x60x75 cm', 'Material': 'Madera de Roble', 'Estilo': 'Nórdico', 'Peso': '15kg' },
    beauty: { 'Contenido': '50ml', 'Tipo de Piel': 'Todo tipo', 'Ingredientes': 'Vitamina C, Ácido Hialurónico', 'SPF': '30+' },
    toys: { 'Edad Recomendada': '8+ años', 'Piezas': '500+', 'Material': 'Plástico ABS', 'Baterías': 'No requiere' },
    sports: { 'Material': 'Acero/Neopreno', 'Peso': '5kg', 'Color': 'Negro Mate', 'Uso': 'Profesional' },
    books: { 'Autor': 'Varios', 'Editorial': 'Penguin Random House', 'Páginas': '350', 'Idioma': 'Español' },
    automotive: { 'Compatibilidad': 'Universal', 'Material': 'Polímero', 'Instalación': 'Fácil', 'Color': 'Negro' },
};

// Variable heights for items
function getRandomHeight(index: number): number {
    // Determine heights for masonry
    const heights = [200, 260, 180, 240, 220, 280, 190, 250, 210, 230];
    return heights[index % heights.length];
}

// Optimization: Pre-calculate static data to avoid finding it repeatedly
const CACHED_CATEGORIES = CATEGORIES.map(c => c.key);
const CACHED_LOCATIONS_LENGTH = locations.length;
const BASE_PRICES = [299, 499, 899, 1200, 2500, 5000, 8500, 12000, 15000, 25000];

// Generate simple deterministic item
function generateItem(index: number): MarketplaceItem {
    const catIndex = index % 8; // 8 categories
    const category = CACHED_CATEGORIES[catIndex];

    const titleList = titles[category];
    const descList = descriptions[category];

    const title = titleList[index % titleList.length];
    const description = descList[index % descList.length];

    const price = BASE_PRICES[index % 10] + (index % 50) * 50;
    const distance = ((index * 13) % 490) / 10 + 0.5;
    const rating = 3.8 + ((index * 7) % 13) / 10;
    const reviews = 15 + (index * 23) % 800;
    // Map categories to unsplash topics for better relevance if possible, or just random
    // Using simple deterministic seed for picsum to get different images
    const imageId = (index * 37) % 200 + 10;

    const date = new Date();
    date.setDate(date.getDate() - (index % 30));

    // Determine sub-variation for tech specs to make them look slightly diverse
    const specs = { ...techSpecs[category] };
    if (category === 'clothing') specs['Color'] = ['Rojo', 'Azul', 'Negro', 'Blanco'][index % 4];
    if (category === 'electronics') specs['Modelo'] = `XT-${2000 + (index % 100)}`;

    return {
        id: `prod-${index}`,
        title: `${title} ${String.fromCharCode(65 + (index % 26))}`, // Variant suffix
        description,
        price,
        distance,
        category,
        imageUrl: `https://picsum.photos/seed/${category}${imageId}/300/400`, // Seed categorized
        rating,
        reviewCount: reviews,
        location: locations[index % CACHED_LOCATIONS_LENGTH],
        postedAt: date.toISOString(),
        urgent: index % 19 === 0, // "Oferta Flash" maybe?
        featured: index % 29 === 0,
        technicalDetails: specs,
    };
}

let cachedItems: MarketplaceItem[] | null = null;

export function generateMockData(count: number = 10000): MarketplaceItem[] {
    if (cachedItems && cachedItems.length === count) {
        return cachedItems;
    }

    console.log('Generating items...');
    // Use a simple loop for maximum performance with large arrays
    const items = new Array(count);
    for (let i = 0; i < count; i++) {
        items[i] = generateItem(i);
    }

    cachedItems = items;
    console.log('Items generated');
    return items;
}

export function getItemsPage(page: number, pageSize: number = 50): MarketplaceItem[] {
    const allItems = generateMockData();
    const start = page * pageSize;
    const end = start + pageSize;
    return allItems.slice(start, end);
}

export function getItemById(id: string): MarketplaceItem | undefined {
    const allItems = generateMockData();
    return allItems.find(item => item.id === id);
}

export { getRandomHeight };

