export type TransactionType = 'depósito' | 'transferência' | 'saque' | 'pagamento';

export class Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description?: string;

  constructor(
    id: string,
    type: TransactionType,
    amount: number,
    date: Date | string,
    description?: string
  ) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.date = new Date(date);
    this.description = description;
  }

  getFormattedAmount(): string {
    return (this.amount < 0 ? '- ' : '') +
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
        .format(Math.abs(this.amount));
  }

  getFormattedDate(): string {
    return this.date.toLocaleDateString('pt-BR');
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      amount: this.amount,
      date: this.date.toISOString(),
      description: this.description,
    };
  }

  static fromJSON(data: any): Transaction {
    return new Transaction(
      data.id,
      data.type,
      data.amount,
      new Date(data.date),
      data.description
    );
  }
}
