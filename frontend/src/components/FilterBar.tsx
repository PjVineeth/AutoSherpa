interface FilterBarProps {
  filters: {
    brand: string;
    fuel: string;
    price: string;
  };
  setFilters: (filters: any) => void;
}

const FilterBar = ({ filters, setFilters }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <select
        className="p-2 rounded border"
        value={filters.brand}
        onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
      >
        <option value="">All Brands</option>
        <option value="Honda">Honda</option>
        <option value="Kia">Kia</option>
        <option value="Maruti">Maruti</option>
        <option value="Tata">Tata</option>
      </select>
      <select
        className="p-2 rounded border"
        value={filters.fuel}
        onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
      >
        <option value="">All Fuels</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="Electric">Electric</option>
        <option value="CNG">CNG</option>
      </select>
      <select
        className="p-2 rounded border"
        value={filters.price}
        onChange={(e) => setFilters({ ...filters, price: e.target.value })}
      >
        <option value="">Any Price</option>
        <option value="below5">Below ₹5L</option>
        <option value="5to10">₹5L – ₹10L</option>
        <option value="10plus">Above ₹10L</option>
      </select>
    </div>
  );
};

export default FilterBar;
