export interface Product {
  id: number;
  img: string;
  name: string;
  category: string;
  tag: string;
  desc: string;
  price: number;
  new: boolean;
}

export interface CartItem extends Product {
  size: string;
  qty: number;
}
