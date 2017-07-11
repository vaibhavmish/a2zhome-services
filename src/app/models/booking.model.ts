import { Service } from './service.model';

export class BookingRequest {
  user_id: string;
  service_id: string;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  service_name: string;
  location: string;
  number: string;
}

export class RescheduleBookingRequest {
  order_id: string; // order-id
  scheduled_date: string;
  scheduled_time: string;
}

export class BookingOrdersResponse {
  _id: string;
  order_id: string;
  user_id: string;
  service_id: string;
  service_name: string;
  scheduled_date: string;
  scheduled_time: string;
  reason: string;
  address: string;
  transaction_id: string;
  status: string;
  cost: Array<CostOption>;
  reviewed: boolean;
}

export class CostOption {
  category: string;
  amount: number;
}

export class Personal {
  user_id: string;
  fullName: string;
  location: string;
  phone: string;
  address: string;
  email: string;
}

export class Schedule {
  scheduleDate: string;
  scheduleTime: string;
}