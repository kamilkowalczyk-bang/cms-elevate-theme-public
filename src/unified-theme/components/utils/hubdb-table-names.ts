/**
 * Keep these immutable HubDB table names identical across HubSpot accounts.
 * Using names (instead of numeric IDs) improves code portability between portals.
 */
export const HUBDB_TABLE_NAMES = {
  serviceCard: 'services',
  logoGrid: 'companies',
  contactCard: 'contact_cards',
  officeCard: 'offices',
} as const;

