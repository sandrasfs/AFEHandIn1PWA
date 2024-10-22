
export interface CreditCard {
    card_number: number
    csc_code: number
    cardholder_name: string
    expiration_date_month: number
    expiration_date_year: number
    uid?: string
    issuer: string
  }

export interface Transaction {
  credit_card: CreditCard;
  amount: number;
  comment: string;
  date: number;
  currency: string;
  uid?: string;
}

export const CURRENCIES = [
  'CAD',
  'EUR',
  'KYD',
  'MWK',
  'NAD',
  'USD',
]