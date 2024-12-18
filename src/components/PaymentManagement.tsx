import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Payment, Consultant } from "../data/mockData";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface PaymentManagementProps {
  consultants: Consultant[];
}

export function PaymentManagement({ consultants }: PaymentManagementProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [newInvoiceAmount, setNewInvoiceAmount] = useState<{ [key: string]: number }>({});
  const [newInvoiceName, setNewInvoiceName] = useState<{ [key: string]: string }>({});

  const totalQuote = consultants.reduce((sum, consultant) => sum + consultant.quote, 0);
  const totalInvoiced = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = payments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const handleCreateInvoice = (consultant: Consultant) => {
    const amount = newInvoiceAmount[consultant.email];
    const invoiceName = newInvoiceName[consultant.email];

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!invoiceName?.trim()) {
      toast.error("Please enter an invoice name");
      return;
    }

    const totalInvoicedForConsultant = payments
      .filter(p => p.consultantEmail === consultant.email)
      .reduce((sum, payment) => sum + payment.amount, 0);

    if (totalInvoicedForConsultant + amount > consultant.quote) {
      toast.error(`Total invoiced amount cannot exceed the quote (${consultant.quote})`);
      return;
    }

    const newPayment: Payment = {
      consultantEmail: consultant.email,
      amount: amount,
      status: 'pending',
      invoiceDate: new Date().toISOString().split('T')[0],
      invoiceName: invoiceName,
    };
    setPayments(prev => [...prev, newPayment]);
    setNewInvoiceAmount(prev => ({ ...prev, [consultant.email]: 0 }));
    setNewInvoiceName(prev => ({ ...prev, [consultant.email]: '' }));
    toast.success(`Invoice "${invoiceName}" created for ${consultant.name}`);
  };

  const handleMarkAsPaid = (payment: Payment) => {
    setPayments(prev =>
      prev.map(p =>
        p.consultantEmail === payment.consultantEmail && p.invoiceDate === payment.invoiceDate
          ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    toast.success(`Payment marked as paid`);
  };

  const getRemainingQuote = (consultant: Consultant) => {
    const totalInvoiced = payments
      .filter(p => p.consultantEmail === consultant.email)
      .reduce((sum, payment) => sum + payment.amount, 0);
    return consultant.quote - totalInvoiced;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Quote</p>
              <p className="text-2xl font-bold">${totalQuote.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Invoiced</p>
              <p className="text-2xl font-bold">${totalInvoiced.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Consultant Payments</h3>
        {consultants.map((consultant) => {
          const consultantPayments = payments.filter(p => p.consultantEmail === consultant.email);
          const remainingQuote = getRemainingQuote(consultant);
          
          return (
            <Card key={consultant.email}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{consultant.name}</p>
                    <p className="text-sm text-gray-500">Quote: ${consultant.quote.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Remaining: ${remainingQuote.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Invoice Name"
                      className="w-48"
                      value={newInvoiceName[consultant.email] || ''}
                      onChange={(e) => setNewInvoiceName(prev => ({
                        ...prev,
                        [consultant.email]: e.target.value
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      className="w-32"
                      value={newInvoiceAmount[consultant.email] || ''}
                      onChange={(e) => setNewInvoiceAmount(prev => ({
                        ...prev,
                        [consultant.email]: parseFloat(e.target.value)
                      }))}
                    />
                    <Button
                      onClick={() => handleCreateInvoice(consultant)}
                      disabled={remainingQuote <= 0}
                    >
                      Create Invoice
                    </Button>
                  </div>
                </div>
                {consultantPayments.map((payment, index) => (
                  <div key={index} className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{payment.invoiceName}</p>
                      <p className="text-sm">Invoice Date: {payment.invoiceDate}</p>
                      <p className="text-sm">Amount: ${payment.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={payment.status === 'paid' ? 'secondary' : 'outline'}>
                        {payment.status === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                      {payment.status === 'pending' && (
                        <Button size="sm" onClick={() => handleMarkAsPaid(payment)}>
                          Mark as Paid
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}