// Domain vocabularies and data helpers shared by component, spec and app generators.
// Everything here must mirror the runtime logic of the generated components exactly
// (filtering, sorting, pagination, money formatting, order references), because the
// generator computes the expected values that the generated tests assert.

export const DOMAINS = [
  { key: 'product', entity: 'Product', plural: 'Products', idPrefix: 'PRD', categories: ['Lighting', 'Kitchen', 'Garden', 'Office', 'Outdoor'], adjectives: ['Brushed', 'Compact', 'Classic', 'Modular', 'Rustic', 'Smart', 'Vintage', 'Folding', 'Heavy', 'Slim'], nouns: ['Lamp', 'Kettle', 'Planter', 'Desk', 'Bench', 'Shelf', 'Clock', 'Stool', 'Lantern', 'Tray'] },
  { key: 'invoice', entity: 'Invoice', plural: 'Invoices', idPrefix: 'INV', categories: ['Draft', 'Sent', 'Paid', 'Overdue', 'Void'], adjectives: ['Quarterly', 'Monthly', 'Annual', 'Interim', 'Final', 'Partial', 'Recurring', 'Manual', 'Urgent', 'Deferred'], nouns: ['Retainer', 'License', 'Support', 'Hosting', 'Audit', 'Consulting', 'Training', 'Upgrade', 'Renewal', 'Setup'] },
  { key: 'ticket', entity: 'Ticket', plural: 'Tickets', idPrefix: 'TCK', categories: ['Bug', 'Feature', 'Question', 'Incident', 'Chore'], adjectives: ['Broken', 'Slow', 'Missing', 'Flaky', 'Duplicate', 'Stale', 'Hidden', 'Wrong', 'Blank', 'Stuck'], nouns: ['Login', 'Export', 'Search', 'Upload', 'Invoice', 'Report', 'Dashboard', 'Webhook', 'Sidebar', 'Payment'] },
  { key: 'shipment', entity: 'Shipment', plural: 'Shipments', idPrefix: 'SHP', categories: ['Pending', 'Packed', 'Transit', 'Delivered', 'Returned'], adjectives: ['Express', 'Fragile', 'Bulk', 'Priority', 'Frozen', 'Oversize', 'Insured', 'Local', 'Overseas', 'Standard'], nouns: ['Pallet', 'Parcel', 'Crate', 'Envelope', 'Container', 'Tube', 'Box', 'Drum', 'Bundle', 'Sack'] },
  { key: 'patient', entity: 'Patient', plural: 'Patients', idPrefix: 'PAT', categories: ['Admitted', 'Outpatient', 'Discharged', 'Referred', 'Waiting'], adjectives: ['Anna', 'Bruno', 'Chloe', 'Daan', 'Elise', 'Farid', 'Greta', 'Hugo', 'Ines', 'Jonas'], nouns: ['Peeters', 'Janssens', 'Maes', 'Jacobs', 'Mertens', 'Willems', 'Claes', 'Goossens', 'Wouters', 'Dubois'] },
  { key: 'booking', entity: 'Booking', plural: 'Bookings', idPrefix: 'BKG', categories: ['Hotel', 'Flight', 'Train', 'Car', 'Tour'], adjectives: ['Weekend', 'Business', 'Family', 'Solo', 'Group', 'Late', 'Early', 'Flexible', 'Budget', 'Premium'], nouns: ['Lisbon', 'Ghent', 'Krakow', 'Bergen', 'Porto', 'Seville', 'Tallinn', 'Bruges', 'Lyon', 'Turin'] },
  { key: 'employee', entity: 'Employee', plural: 'Employees', idPrefix: 'EMP', categories: ['Engineering', 'Sales', 'Finance', 'Support', 'Legal'], adjectives: ['Ada', 'Ben', 'Cleo', 'Dirk', 'Eva', 'Femke', 'Gert', 'Hanna', 'Ivo', 'Jade'], nouns: ['Smet', 'Lambert', 'Martin', 'Leroy', 'Hermans', 'Vermeulen', 'Michiels', 'Segers', 'Aerts', 'Pauwels'] },
  { key: 'asset', entity: 'Asset', plural: 'Assets', idPrefix: 'AST', categories: ['Laptop', 'Monitor', 'Phone', 'Tablet', 'Printer'], adjectives: ['Spare', 'Leased', 'Loaner', 'Retired', 'Assigned', 'Repaired', 'Refurbished', 'New', 'Shared', 'Reserved'], nouns: ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet'] },
  { key: 'campaign', entity: 'Campaign', plural: 'Campaigns', idPrefix: 'CMP', categories: ['Email', 'Social', 'Search', 'Display', 'Event'], adjectives: ['Spring', 'Summer', 'Autumn', 'Winter', 'Launch', 'Retargeting', 'Loyalty', 'Holiday', 'Clearance', 'Referral'], nouns: ['Promo', 'Teaser', 'Digest', 'Webinar', 'Giveaway', 'Survey', 'Newsletter', 'Contest', 'Bundle', 'Preview'] },
  { key: 'recipe', entity: 'Recipe', plural: 'Recipes', idPrefix: 'RCP', categories: ['Starter', 'Main', 'Dessert', 'Side', 'Drink'], adjectives: ['Smoky', 'Crispy', 'Spicy', 'Creamy', 'Roasted', 'Grilled', 'Zesty', 'Sweet', 'Savory', 'Herbed'], nouns: ['Risotto', 'Tart', 'Curry', 'Salad', 'Soup', 'Stew', 'Waffle', 'Gratin', 'Noodles', 'Sorbet'] },
  { key: 'contract', entity: 'Contract', plural: 'Contracts', idPrefix: 'CTR', categories: ['Signed', 'Review', 'Expired', 'Renewal', 'Draft'], adjectives: ['Master', 'Service', 'Supply', 'Lease', 'License', 'Framework', 'Pilot', 'Reseller', 'Hosting', 'Escrow'], nouns: ['Agreement', 'Addendum', 'Order', 'Annex', 'Schedule', 'Waiver', 'Notice', 'Charter', 'Mandate', 'Accord'] },
  { key: 'vehicle', entity: 'Vehicle', plural: 'Vehicles', idPrefix: 'VHC', categories: ['Van', 'Truck', 'Sedan', 'Bike', 'Scooter'], adjectives: ['Electric', 'Hybrid', 'Diesel', 'Compact', 'Cargo', 'Rental', 'Pool', 'Spare', 'Leased', 'Field'], nouns: ['Unit', 'Runner', 'Carrier', 'Mover', 'Hauler', 'Rover', 'Courier', 'Shuttle', 'Tender', 'Scout'] },
  { key: 'course', entity: 'Course', plural: 'Courses', idPrefix: 'CRS', categories: ['Beginner', 'Advanced', 'Workshop', 'Seminar', 'Online'], adjectives: ['Applied', 'Intro', 'Modern', 'Practical', 'Visual', 'Hands-on', 'Remote', 'Intensive', 'Evening', 'Weekend'], nouns: ['Statistics', 'Pottery', 'Chemistry', 'Design', 'Typing', 'Rhetoric', 'Botany', 'Welding', 'Spanish', 'Robotics'] },
  { key: 'listing', entity: 'Listing', plural: 'Listings', idPrefix: 'LST', categories: ['Apartment', 'House', 'Studio', 'Loft', 'Office'], adjectives: ['Sunny', 'Quiet', 'Central', 'Renovated', 'Spacious', 'Cozy', 'Modern', 'Historic', 'Furnished', 'Corner'], nouns: ['Flat', 'Duplex', 'Penthouse', 'Cottage', 'Villa', 'Terrace', 'Annex', 'Suite', 'Townhouse', 'Bungalow'] },
  { key: 'order', entity: 'Order', plural: 'Orders', idPrefix: 'ORD', categories: ['New', 'Paid', 'Shipped', 'Cancelled', 'Refunded'], adjectives: ['Gift', 'Bulk', 'Repeat', 'Rush', 'Preorder', 'Wholesale', 'Sample', 'Online', 'Phone', 'Store'], nouns: ['Basket', 'Bundle', 'Kit', 'Pack', 'Set', 'Box', 'Crate', 'Hamper', 'Case', 'Lot'] },
];

export const WORDS = ['alpha', 'amber', 'apex', 'atlas', 'aurora', 'birch', 'blaze', 'cedar', 'cobalt', 'comet', 'coral', 'delta', 'drift', 'ember', 'falcon', 'fern', 'flint', 'frost', 'garnet', 'glade', 'harbor', 'hazel', 'indigo', 'iris', 'jade', 'juniper', 'kestrel', 'lagoon', 'lark', 'lumen', 'maple', 'meadow', 'mesa', 'nectar', 'nova', 'oak', 'onyx', 'orbit', 'pebble', 'pine', 'prism', 'quartz', 'raven', 'reef', 'ridge', 'river', 'sable', 'sage', 'solstice', 'spruce', 'summit', 'tide', 'topaz', 'tundra', 'umber', 'vale', 'velvet', 'willow', 'zephyr', 'zinc'];

export const FIRST_NAMES = ['Lena', 'Marco', 'Noor', 'Oscar', 'Pia', 'Ruben', 'Sara', 'Tom', 'Uma', 'Victor', 'Wout', 'Yara', 'Zoe', 'Arne', 'Bea', 'Cas'];
export const LAST_NAMES = ['De Smet', 'Van Damme', 'Claessens', 'Hendrickx', 'Lemmens', 'Verhoeven', 'Desmet', 'Coppens', 'Michiels', 'Bogaert', 'Martens', 'Cools'];

export const PAGE_SIZE = 10;

export function pad(n, w = 4) {
  return String(n).padStart(w, '0');
}

/** Generate `count` rows with unique ids, names and amounts (cents). */
export function makeRows(rng, domain, count, offset = 0) {
  const usedAmounts = new Set();
  const rows = [];
  for (let i = 0; i < count; i++) {
    let amount;
    do {
      amount = rng.int(100, 999999);
    } while (usedAmounts.has(amount));
    usedAmounts.add(amount);
    rows.push({
      id: `${domain.idPrefix}-${pad(offset + i + 1)}`,
      name: `${rng.pick(domain.adjectives)} ${rng.pick(domain.nouns)}`,
      category: rng.pick(domain.categories),
      amount,
    });
  }
  return rows;
}

/** Mirrors DataTable filtering: case-insensitive substring over id, name, category. */
export function filterRows(rows, query) {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) => [r.id, r.name, r.category].some((v) => String(v).toLowerCase().includes(q)));
}

/** Mirrors DataTable sorting (numbers numerically, strings by code unit order). */
export function sortRows(rows, key, dir) {
  const out = rows.slice();
  out.sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    const c = typeof av === 'number' && typeof bv === 'number' ? av - bv : av < bv ? -1 : av > bv ? 1 : 0;
    return dir === 'asc' ? c : -c;
  });
  return out;
}

/** Mirrors formatMoney in shared-ui. */
export function formatMoney(cents) {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}$${whole}.${String(abs % 100).padStart(2, '0')}`;
}

/** Mirrors orderReference in shared-ui (djb2 -> base36). */
export function orderReference(seed) {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  }
  return `REF-${h.toString(36).toUpperCase().padStart(7, '0')}`;
}

/** "Showing a-b of n" footer text, mirroring DataTable. */
export function showingText(total, page, pageSize = PAGE_SIZE) {
  if (total === 0) return 'No results';
  const start = page * pageSize + 1;
  const end = Math.min(total, (page + 1) * pageSize);
  return `Showing ${start}-${end} of ${total}`;
}

/** Pick a filter query that matches a meaningful subset of rows. */
export function pickQuery(rng, rows, domain) {
  const kind = rng.int(0, 4);
  if (kind === 0) return rng.pick(domain.categories).toLowerCase();
  if (kind === 1) return rng.pick(domain.adjectives).slice(0, rng.int(3, 5));
  if (kind === 2) return rng.pick(domain.nouns).toLowerCase().slice(0, rng.int(3, 6));
  if (kind === 3) return rng.pick(rows).id;
  return `${domain.idPrefix}-00${rng.int(0, 1)}`.toLowerCase();
}

export function words(rng, n) {
  return Array.from({ length: n }, () => rng.pick(WORDS)).join(' ');
}

export function personName(rng) {
  return `${rng.pick(FIRST_NAMES)} ${rng.pick(LAST_NAMES)}`;
}

export function emailFor(name, rng) {
  return `${name.toLowerCase().replace(/[^a-z]+/g, '.')}${rng.int(1, 99)}@example.com`;
}

export function kebab(s) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-|-$/g, '');
}

export function tsString(s) {
  return `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

/** Compact one-row-per-line TS literal for fixtures (keeps bytes ~ proportional to rows). */
export function rowsLiteral(rows, indent = '  ') {
  return `[\n${rows
    .map((r) => `${indent}  { id: ${tsString(r.id)}, name: ${tsString(r.name)}, category: ${tsString(r.category)}, amount: ${r.amount} },`)
    .join('\n')}\n${indent}]`;
}
