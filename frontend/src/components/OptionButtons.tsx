import React from 'react';

interface Option { id: string; text: string; }
interface Props { options: Option[]; onSelect: (id: string, text: string) => void; }

export const OptionButtons: React.FC<Props> = ({ options, onSelect }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => (
      <button  key={opt.id} onClick={() => onSelect(opt.id, opt.text)} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
        {opt.text}
      </button>
    ))}
  </div>
);