import type { AddressRecord } from '@/types/records/address';
import type { PaymentRecord } from '../payment';
import type { RentalRecord } from '../rental';

interface CustomerRecord {
  id: number;
  active: number;
  activebool: boolean;
  address_id: number;
  create_date: Date;
  email: string;
  last_name: string;
  first_name: string;
  full_name: string;
  last_update: Date;
  store_id: number;

  address?: AddressRecord | null;
  payments?: PaymentRecord[] | null;
  rentals?: RentalRecord[] | null;
}

export type { CustomerRecord };
