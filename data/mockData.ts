import { CATEGORIES, Category, MarketplaceItem } from '@/types/types';

// Original efficient data generation logic
const titles: Record<Category, string[]> = {
    food_delivery: ['Barista Experto', 'Cocinero de Comida Rápida', 'Ayudante de Cocina', 'Mesero con Experiencia', 'Repartidor de Pizza', 'Gerente de Restaurante'],
    shopping: ['Personal Shopper', 'Asistente de Compras', 'Mystery Shopper', 'Empacador de Supermercado', 'Promotor de Ventas', 'Cajero con Experiencia'],
    warehouse: ['Operario de Almacén', 'Montacarguista Certificado', 'Clasificador de Paquetes', 'Mozo de Carga', 'Supervisor de Logística', 'Control de Inventarios'],
    cleaning: ['Limpieza de Oficinas', 'Personal de Limpieza Doméstica', 'Desinfección de Espacios', 'Jardinero', 'Limpieza de Ventanas', 'Mantenimiento General'],
    surveys: ['Encuestador de Campo', 'Evaluador de Productos', 'Cliente Incógnito', 'Auditor de Precios', 'Investigador de Mercado', 'Panelista de Opinion'],
    delivery: ['Repartidor en Moto', 'Conductor de Camioneta', 'Mensajero a Pie', 'Distribuidor de Paquetería', 'Repartidor de Farmacia', 'Logística de Última Milla'],
    driving: ['Chofer Privado', 'Conductor de Ruta Escolar', 'Valet Parking', 'Conductor de Transporte de Personal', 'Chofer Ejecutivo', 'Taxista'],
    tech: ['Soporte Técnico en Sitio', 'Instalador de Redes', 'Técnico de Reparación de PC', 'Help Desk Junior', 'Mantenimiento de Servidores', 'Cableado Estructurado'],
};

const locations = ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Mérida', 'Cancún', 'Querétaro', 'San Luis Potosí'];

const descriptions: Record<Category, string[]> = {
    food_delivery: [
        'Buscamos barista con pasión por el café de especialidad. Turnos rotativos.',
        'Únete a nuestro equipo de cocina. Experiencia en comida rápida necesaria.',
        'Restaurante de alta gama busca meseros con excelente actitud de servicio.',
    ],
    shopping: [
        'Ayuda a nuestros clientes a encontrar los mejores productos. Experiencia en ventas.',
        'Realiza compras para clientes ocupados. Se requiere vehículo propio.',
        'Evalúa la calidad del servicio en tiendas departamentales. Horario flexible.',
    ],
    warehouse: [
        'Carga y descarga de mercancía. Turno nocturno disponible con bono.',
        'Manejo de montacargas hombre sentado. Certificación vigente requerida.',
        'Organización y clasificación de paquetería para envíos nacionales.',
    ],
    cleaning: [
        'Limpieza profunda de oficinas corporativas. Lunes a Viernes.',
        'Servicio de limpieza residencial. Pago semanal puntual.',
        'Mantenimiento de áreas verdes y jardinería básica.',
    ],
    surveys: [
        'Realiza encuestas en zonas comerciales. Pago por encuesta completada.',
        'Prueba nuevos productos y comparte tu opinión detallada.',
        'Auditoría de precios en supermercados. Smartphone requerido.',
    ],
    delivery: [
        'Entrega de alimentos en motocicleta. Licencia vigente.',
        'Distribución de paquetes en zona local. Conocimiento de la ciudad.',
        'Mensajería urgente para corporativos. Rapidez y responsabilidad.',
    ],
    driving: [
        'Chofer privado para familia. Disponibilidad inmediata y referencias.',
        'Conductor para transporte escolar. Licencia tipo C.',
        'Valet parking para eventos exclusivos. Buena presentación.',
    ],
    tech: [
        'Soporte técnico presencial para oficinas. Conocimientos de Windows/Mac.',
        'Instalación de cableado estructurado y redes WiFi.',
        'Diagnóstico y reparación de equipos de cómputo. Medio tiempo.',
    ],
};

// Variable heights for items
function getRandomHeight(index: number): number {
    // Generate deterministic random heights based on index
    // Heights range from 150 to 280 approx
    const heights = [180, 220, 160, 240, 200, 280, 170, 250, 190, 210];
    return heights[index % heights.length];
}

// Optimization: Pre-calculate static data to avoid finding it repeatedly
const CACHED_CATEGORIES = CATEGORIES.map(c => c.key);
const CACHED_LOCATIONS_LENGTH = locations.length;
const BASE_PRICES = [150, 200, 300, 450, 600, 800, 1200, 1500, 2000, 2500];

// Generate simple deterministic item
function generateItem(index: number): MarketplaceItem {
    // Use bitwise operations for faster math where possible and deterministic pseudo-randomness
    const catIndex = index % 8; // 8 categories
    const category = CACHED_CATEGORIES[catIndex];

    const titleList = titles[category];
    const descList = descriptions[category];

    const title = titleList[index % titleList.length];
    const description = descList[index % descList.length];

    // Deterministic random numbers based on index
    const price = BASE_PRICES[index % 10] + (index % 50) * 10;
    const distance = ((index * 13) % 490) / 10 + 0.5; // 0.5 to 49.5 km similar to user request
    const rating = 3.5 + ((index * 7) % 15) / 10; // 3.5 to 4.9
    const reviews = 10 + (index * 23) % 500;
    // Use a reliable image service or placeholders if needed, unsplash/picsum is standard 
    // Optimization: use lower resolution for list
    const imageId = (index * 37) % 1000 + 10;

    const date = new Date();
    date.setDate(date.getDate() - (index % 30));

    return {
        id: `item-${index}`,
        title: `${title} ${index}`, // Make title unique for key extraction
        description,
        price,
        distance, // Number for filtering
        category,
        imageUrl: `https://picsum.photos/seed/${imageId}/200/300`, // Lower res for performance
        rating,
        reviewCount: reviews,
        location: locations[index % CACHED_LOCATIONS_LENGTH],
        postedAt: date.toISOString(),
        urgent: index % 19 === 0,
        featured: index % 29 === 0,
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

