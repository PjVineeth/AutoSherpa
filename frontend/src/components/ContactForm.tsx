// src/components/ContactForm.tsx
import React, { useState } from 'react';

interface ContactFormProps {
  onSubmit: (data: {
    name: string;
    phone: string;
    licence: string;
    preferredTime: string;
    date: string;
  }) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licence: 'yes',
    preferredTime: '',
    date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow-md rounded">
      <div>
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Phone Number</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          type="tel"
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Do you have a driving license?</label>
        <select
          name="licence"
          value={formData.licence}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Preferred Time</label>
        <input
          name="preferredTime"
          value={formData.preferredTime}
          onChange={handleChange}
          type="time"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Preferred Date</label>
        <input
          name="date"
          value={formData.date}
          onChange={handleChange}
          type="date"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Book Test Drive
      </button>
    </form>
  );
};
