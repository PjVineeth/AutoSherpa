import { useState } from "react";

interface ChatStep {
  id: number;
  message: string;
  options?: string[];
}

const steps: ChatStep[] = [
  { id: 1, message: "Hi! 👋 What are you looking for?", options: ["Browse All", "Filter by Brand", "Filter by Price", "Filter by Fuel"] },
  { id: 2, message: "Choose a brand:", options: ["Honda", "Kia", "Tata", "Maruti"] },
  { id: 3, message: "Select a price range:", options: ["Below ₹5L", "₹5L–₹10L", "Above ₹10L"] },
  { id: 4, message: "Select a fuel type:", options: ["Petrol", "Diesel", "Electric", "CNG"] }
];


const ChatBot = ({ onFilter }: { onFilter: (filter: any) => void }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const handleOption = (option: string) => {
  if (option === "Browse All") {
    onFilter({});
    setStepIndex(0); // reset chatbot
    return;
  }

  if (option.startsWith("Filter by")) {
    setStepIndex(stepIndex + 1);
    return;
  }

  const currentStep = steps[stepIndex];

  // Brand
  if (currentStep.message.includes("brand")) {
    onFilter({ brand: option });
    setStepIndex(0);
    return;
  }

  // Fuel
  if (currentStep.message.includes("fuel")) {
    onFilter({ fuel: option });
    setStepIndex(0);
    return;
  }

  // Price
  if (currentStep.message.includes("price")) {
    if (option === "Below ₹5L") onFilter({ price: "below5" });
    if (option === "₹5L–₹10L") onFilter({ price: "5to10" });
    if (option === "Above ₹10L") onFilter({ price: "10plus" });
    setStepIndex(0);
    return;
  }

  onFilter({ value: option });
  setStepIndex(0);
};



  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <p className="text-gray-800 mb-2 font-semibold">{steps[stepIndex].message}</p>
      <div className="flex flex-wrap gap-2">
        {steps[stepIndex].options?.map((opt) => (
          <button
            key={opt}
            onClick={() => handleOption(opt)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatBot;
