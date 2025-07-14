import { useState } from "react";
import axios from "axios";

interface Props {
  car: string;
  show: boolean;
  onClose: () => void;
}

const TestDriveModal: React.FC<Props> = ({ car, show, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    try {
      // @ts-ignore
      const API_URL = process.env.REACT_APP_API_URL || '';
      await axios.post(`${API_URL}/test-drive`, {
        name,
        phone,
        date,
        car,
      });
      alert("Test drive booked successfully!");
      onClose();
    } catch (err) {
      alert("Failed to book test drive.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Book Test Drive</h2>
        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-3 border px-3 py-2 rounded" />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mb-3 border px-3 py-2 rounded" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mb-3 border px-3 py-2 rounded" />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default TestDriveModal;
