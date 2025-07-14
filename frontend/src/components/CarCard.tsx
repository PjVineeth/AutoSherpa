// src/components/CarCard.tsx
import React from 'react';
import { Car } from '../types/Car';

interface CarCardProps {
  car: Car;
  onSelect: (id: string, name: string) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onSelect }) => {
  const imageName = `${car.make}-${car.model}`.toLowerCase().replace(/\s+/g, '-') + '.png';
  const imagePath = `/images/cars/${imageName}`;

  return (
    <div
      className="w-80 bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
      onClick={() => onSelect(car.id.toString(), `${car.make} ${car.model}`)}
    >
      <img
        src={imagePath}
        alt={car.model}
        className="w-full h-40 object-cover rounded-md mb-3"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/cars/default.png';
        }}
      />
      <h3 className="text-lg font-semibold mb-1">
        {car.make} {car.model} {car.variant}
      </h3>
      <p className="text-sm text-gray-600">Year: {car.manufacturing_year}</p>
      <p className="text-sm text-gray-600">Fuel: {car.fuel_type} | Transmission: {car.transmission}</p>
      <p className="text-sm text-gray-600">Mileage: {car.mileage} km | Engine: {car.cc} CC</p>
      <p className="text-sm text-gray-600">Color: {car.color}</p>
      <p className="text-md font-bold text-blue-700 mt-2">₹{car.price}</p>
    </div>
  );
};
