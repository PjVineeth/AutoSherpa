// src/components/ChatInterface.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { OptionButtons } from './OptionButtons';
import { ContactForm } from './ContactForm';
import { Car } from '../types/Car';
import { chatWorkflow, ChatStep, UserData } from './chatWorkflow';
import { CarCard } from './CarCard';

export function ChatInterface() {
  const [messages, setMessages] = useState<{ id: string; type: 'bot' | 'user'; content: string }[]>([]);
  const [step, setStep] = useState<ChatStep>('welcome');
  const [userData, setUserData] = useState<UserData>({});
  const [showForm, setShowForm] = useState(false);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [carPage, setCarPage] = useState<number>(1);
  const [input, setInput] = useState('');

  // Use environment variable for API URL, fallback to localhost
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    axios.get<string[]>(`${API_URL}/brands`)
      .then((r) => setBrands(r.data))
      .catch((e) => console.error("Error fetching brands:", e));

    const init = chatWorkflow.welcome.message;
    const text = typeof init === 'function' ? init(userData) : init;
    setMessages([{ id: Date.now().toString(), type: 'bot', content: text }]);
  }, []);

  const addBot = (text: string) =>
    setMessages((m) => [...m, { id: Date.now().toString(), type: 'bot', content: text }]);

  const addUser = (text: string) =>
    setMessages((m) => [...m, { id: Date.now().toString(), type: 'user', content: text }]);

  const loadCarsByBrand = async (brand: string, page = 1) => {
    const response = await axios.get<Car[]>(
      `${API_URL}/cars-by-brand?brand=${encodeURIComponent(brand)}&page=${page}`
    );
    setAllCars(response.data);
    setCarPage(page);
  };

  const handleOption = async (id: string, text: string) => {
    addUser(text);

    if (step === 'welcome') {
      setUserData((d) => ({ ...d, budget: id }));
      const cfg = chatWorkflow.SelectBudget;
      const msg = typeof cfg.message === 'function' ? cfg.message(userData) : cfg.message;
      setStep('SelectBudget');
      return addBot(msg);
    }

    if (step === 'SelectBudget') {
      setUserData((d) => ({ ...d, type: id }));
      const cfg = chatWorkflow.ShowBrands;
      const msg = typeof cfg.message === 'function' ? cfg.message(userData) : cfg.message;
      setStep('ShowBrands');
      return addBot(msg);
    }

    if (step === 'ShowBrands') {
      setSelectedBrand(id);
      setUserData((d) => ({ ...d, brand: id }));
      await loadCarsByBrand(id, 1);
      setStep('ShowCars');
      const msg = `Here are some ${id} cars. Select one to view details:`;
      return addBot(msg);
    }

    if (step === 'ShowCars') {
      const selectedCar = allCars.find((c) => c.id.toString() === id);
      setUserData((d) => ({
        ...d,
        selectedCarId: id,
        selectedCarName: selectedCar ? `${selectedCar.make} ${selectedCar.model}` : '',
      }));
      const cfg = chatWorkflow.ShowDetails;
      const msg = typeof cfg.message === 'function' ? cfg.message(userData) : cfg.message;
      setStep('ShowDetails');
      return addBot(msg);
    }

    if (step === 'ShowDetails') {
      if (id === 'yes') {
        const cfg = chatWorkflow.ScheduleTestDrive;
        const msg = typeof cfg.message === 'function' ? cfg.message(userData) : cfg.message;
        setStep('ScheduleTestDrive');
        addBot(msg);
        setTimeout(() => setShowForm(true), 300);
        return;
      } else {
        setStep('ShowCars');
        await loadCarsByBrand(selectedBrand!, carPage);
        return addBot(`Here are more ${selectedBrand} cars. Select one to view details:`);
      }
    }

    if (step === 'test_drive_location') {
      setUserData((d) => ({ ...d, location: id }));
      setStep('completed');
      const msg = typeof chatWorkflow.completed.message === 'function'
        ? chatWorkflow.completed.message({ ...userData, location: id })
        : chatWorkflow.completed.message;
      return addBot(msg);
    }

    const cfg = chatWorkflow[step];
    const next = cfg.nextStep?.(id) ?? step;
    if (next === 'contact_form') return setShowForm(true);

    setStep(next);
    const nextCfg = chatWorkflow[next];
    const msg = typeof nextCfg.message === 'function' ? nextCfg.message(userData) : nextCfg.message;
    addBot(msg);
  };

  const handleFormSubmit = async (data: any) => {
    setShowForm(false);
    setUserData((prev) => ({
      ...prev,
      name: data.name,
      phone: data.phone,
      time: data.time || 'To be confirmed',
    }));

    await axios.post(`${API_URL}/test-drive`, {
      ...data,
      carId: userData.selectedCarId,
    });

    const locMsg = chatWorkflow.test_drive_location.message as string;
    setStep('test_drive_location');
    addBot(locMsg);
  };

  let options: { id: string; text: string }[] = [];

  if (step === 'ShowBrands') {
    options = brands.map((b) => ({ id: b, text: b }));
  } else if (step === 'test_drive_location') {
    options = [
      { id: 'Showroom - MG Road', text: 'MG Road Showroom' },
      { id: 'Showroom - Indiranagar', text: 'Indiranagar Showroom' },
      { id: 'custom', text: 'Other Location' },
    ];
  } else {
    options = chatWorkflow[step].options || [];
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto border rounded-lg overflow-hidden shadow-xl animate-fade-in">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold">Chat with our AI Assistant</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-gray-50 space-y-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {(showForm || step === 'ScheduleTestDrive') && (
          <ContactForm onSubmit={handleFormSubmit} />
        )}

        {!showForm && (
          <>
            {step === 'ShowCars' ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {allCars.map((car) => (
                  <CarCard key={car.id} car={car} onSelect={handleOption} />
                ))}
              </div>
            ) : (
              options.length > 0 && <OptionButtons options={options} onSelect={handleOption} />
            )}
          </>
        )}

        {step === 'ShowCars' && (
          <div className="flex justify-between items-center py-2">
            <button
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
              onClick={() => loadCarsByBrand(selectedBrand!, carPage - 1)}
              disabled={carPage <= 1}
            >
              Previous
            </button>
            <span className="text-sm">Page {carPage}</span>
            <button
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
              onClick={() => loadCarsByBrand(selectedBrand!, carPage + 1)}
              disabled={allCars.length < 5}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {step === 'completed' && (
        <div className="border-t p-3 text-center bg-green-100 text-green-900">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            🎉 Thank You! Start New Conversation
          </button>
        </div>
      )}

    </div>
  );
}

export default ChatInterface;
