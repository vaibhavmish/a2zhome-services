export class Service {
  _id: string;
  name: string;
  icon: string;
  description: string;
  includeInPackage: boolean;
  enabled;
  boolean;
  used: number;
  price: Array<PriceOption>;
  locations: Array<string>;
  selected: boolean;
  service_code: string;
}

export class PriceOption {
  option: string;
  amount: string;
}
