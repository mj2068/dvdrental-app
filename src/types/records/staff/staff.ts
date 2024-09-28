import type { AddressRecord } from '../address';

interface StaffRecord {
  active: boolean;
  address_id: number;
  email: string;
  first_name: string;
  last_name: string;
  id: number;
  last_update: Date;
  password: string;
  store_id: number;
  username: string;

  full_name: string;

  address: AddressRecord | null;
}

export type { StaffRecord };
