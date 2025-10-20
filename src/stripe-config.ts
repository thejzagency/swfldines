export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1S6H5oGMtBdGqLf3O3L2mvrY',
    name: 'Spotlight Restaurant Placement',
    description: 'Homepage spotlight placement in SW Florida Dines for maximum visibility',
    mode: 'subscription',
    price: 99.00,
    currency: 'usd'
  },
  {
    priceId: 'price_1S6H4zGMtBdGqLf3yIbZ572d',
    name: 'Premium Restaurant Listing',
    description: 'Premium placement in SW Florida Dines with enhanced features',
    mode: 'subscription',
    price: 59.00,
    currency: 'usd'
  },
  {
    priceId: 'price_1S6H4HGMtBdGqLf3YTPzUtzF',
    name: 'Featured Restaurant Listing',
    description: 'SW Florida Dines Featured Listing',
    mode: 'subscription',
    price: 29.00,
    currency: 'usd'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}