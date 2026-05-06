/**
 * Catálogo simulado para desarrollo (consulta precio).
 * Claves: código de barras EAN-13 u otros, y SKU interno de prenda.
 */
export const MOCK_PRODUCTS = [
    {
        barcode: '7501055901369',
        sku: 'REM-NEG-XL',
        name: 'Remera algodón negra',
        price: 12990,
        size: 'XL',
        color: 'Negro',
        category: 'Remeras',
    },
    {
        barcode: '7790897010428',
        sku: 'JEAN-AZ-32',
        name: 'Jean slim azul',
        price: 45990,
        size: '32',
        color: 'Azul índigo',
        category: 'Pantalones',
    },
    {
        barcode: '7798140260238',
        sku: 'POL-GR-L',
        name: 'Polar fleece gris',
        price: 34990,
        size: 'L',
        color: 'Gris melange',
        category: 'Abrigos',
    },
    {
        barcode: '7796280899125',
        sku: 'ZAP-BLA-40',
        name: 'Zapatilla urbana blanca',
        price: 59990,
        size: '40',
        color: 'Blanco',
        category: 'Calzado',
    },
    {
        barcode: '7790790978536',
        sku: 'GOR-RJA',
        name: 'Gorro tejido rayado',
        price: 8990,
        size: 'Único',
        color: 'Rojo / beige',
        category: 'Accesorios',
    },
];

function normalizeDigits(value) {
    return String(value).replace(/\D/g, '');
}

/**
 * Busca por código de barras exacto o por SKU (insensible a mayúsculas).
 */
export function findProductByCode(raw) {
    const trimmed = String(raw ?? '').trim();
    if (!trimmed) {
        return null;
    }

    const upperSku = trimmed.toUpperCase();
    const digits = normalizeDigits(trimmed);

    return (
        MOCK_PRODUCTS.find((p) => p.barcode === trimmed) ??
        MOCK_PRODUCTS.find((p) => p.sku.toUpperCase() === upperSku) ??
        MOCK_PRODUCTS.find((p) => normalizeDigits(p.barcode) === digits && digits.length > 0) ??
        null
    );
}
