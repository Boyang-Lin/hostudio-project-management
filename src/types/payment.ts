export interface Payment {
  consultantEmail: string;
  amount: number;
  status: 'pending' | 'paid';
  invoiceDate: string;
  paidDate?: string;
  invoiceName: string;
}