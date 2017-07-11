export class ReviewReq {
  cus_id: string;
  service_id: string;
  order_id: string;
  comment: string;
  overall_rating: string;
  executive_rating: string;
  serviceman_rating: string;
  quality_rating: string;
}

export class Review {
  _id: string;
  created_at: string;
  comment: string;
  overall_rating: string;
  executive_rating: string;
  serviceman_rating: string;
  quality_rating: string;
  service_id: string;
  service_location: string;
  cust_id: string;
  cust_name: string;
  cust_photo: string;
}