// CarCardOptions.tsx
import React from "react";
import { Car } from "../types/Car";

interface Props {
  cars: Car[];
  hasMore?: boolean;
  onSelect: (id: string, text: string) => void;
}


const CarCardOptions: React.FC<Props> = ({ cars, onSelect }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {cars.map((car) => (
        <div
          key={car.id}
          className="border rounded-lg p-3 shadow-md cursor-pointer hover:shadow-xl transition"
          onClick={() => onSelect(car.id.toString(), `${car.make} ${car.model}`)}
        >
          <img
            src={"/placeholder-car.jpg"}
            alt={`${car.make} ${car.model}`}
            className="w-full h-40 object-cover rounded"
          />
          <div className="mt-2">
            <h3 className="text-lg font-semibold">{car.make} {car.model} ({car.variant})</h3>
            <p className="text-sm text-gray-600">Fuel: {car.fuel_type} | Mileage: {car.mileage}km</p>
            <p className="font-bold mt-1">Price: ₹{car.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarCardOptions;
