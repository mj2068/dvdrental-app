interface AddressRecord {
  id: number;
  address: string;
  address2?: string | null;
  city_id: number;
  district: string;
  last_update: Date;
  phone: string;
  postal_code: string;
}

export type { AddressRecord };
