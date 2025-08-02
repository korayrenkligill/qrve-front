import { BusinessType } from "@/Enums/BusinessTypes";

export function getBusinessTypeImage(type: BusinessType): string {
  const imageMap: { [key: number]: string } = {
    0: "/backgrounds/restaurant.jpg",
    1: "/backgrounds/Cafes.jpg",
    2: "/backgrounds/bakery.jpg",
    3: "/backgrounds/bar.jpg",
    4: "/backgrounds/coffeeshop.jpg",
    5: "/backgrounds/icecream.jpg",
    6: "/backgrounds/foodtruck.jpg",
    7: "/backgrounds/pub.jpg",
    8: "/backgrounds/hotel.jpg",
    9: "/backgrounds/beachclub.jpg",
    10: "/backgrounds/club.jpg",
  };

  return imageMap[type] || "/images/businessTypes/default.jpg";
}
