import type { CustomerRecord } from '../customer/customer';
import type { StaffRecord } from '../staff';
import type { PaymentRecord } from '../payment';
import type { InventoryRecord } from '../inventory';

interface RentalRecord {
  id: number;
  customer_id: number;
  inventory_id: number;
  last_update: Date;
  rental_date: Date;
  return_date: Date;
  staff_id: number;

  staff: StaffRecord | null;
  customer: CustomerRecord | null;
  inventory: InventoryRecord | null;

  payments: PaymentRecord[];
}

export type { RentalRecord };
