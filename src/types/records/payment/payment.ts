import type { CustomerRecord } from '../customer/customer';
import type { RentalRecord } from '../rental';
import type { StaffRecord } from '../staff';

interface PaymentRecord {
  id: number;
  amount: number;
  customer_id: number;
  payment_date: Date;
  rental_id: number;
  staff_id: number;

  customer: CustomerRecord | null;
  staff: StaffRecord | null;
  rental?: RentalRecord | null;
}

export type { PaymentRecord };
