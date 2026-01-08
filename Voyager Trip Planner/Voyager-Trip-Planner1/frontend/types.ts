
export enum TravelerType {
  BUDGET = 'Budget',
  POOR = 'Poor',
  LUXURY = 'Luxury'
}

export interface PlannerFormData {
  budget: number;
  location: string;
  people: number;
  days: number;
  travelerType: TravelerType;
}

export interface Hotel {
  name: string;
  pricePerNight: number;
  rating: number;
  description: string;
  address: string;
  amenities: string[];
  bookingLink?: string;
}

export interface Activity {
  name: string;
  cost: number;
  type: 'Indoor' | 'Outdoor';
  description: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  isOutdoorFriendly: boolean;
}

export interface BudgetBreakdown {
  stay: number;
  food: number;
  activities: number;
  perPersonPerDay: number;
}

export interface PlannerResults {
  weather: WeatherData;
  hotels: Hotel[];
  activities: Activity[];
  foodSuggestions: string[];
  totalEstimatedCost: number;
  budgetBreakdown: BudgetBreakdown;
  groundingUrls?: { title: string; uri: string }[];
}
