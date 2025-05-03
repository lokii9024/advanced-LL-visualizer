import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, ArrowDown } from 'lucide-react';
import { ListType } from '../types';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onAdd: () => void;
  onRemove: (position: number) => void;
  onInsert: (position: number, value: number) => void;
  onTypeChange: (type: ListType) => void;
  listType: ListType;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  onAdd,
  onRemove,
  onInsert,
  onTypeChange,
  listType,
}) => {
  const [insertPosition, setInsertPosition] = useState(0);
  const [insertValue, setInsertValue] = useState(0);
  const [removePosition, setRemovePosition] = useState(0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Controls</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium mb-3">List Type</h3>
        <div className="flex flex-wrap gap-4">
          {(['singly', 'doubly', 'circular', 'doubly-circular'] as ListType[]).map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                px-4 py-2 rounded-lg capitalize transition-colors
                ${listType === type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onPlayPause}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {isPlaying ? 'Pause' : 'Play'} Traversal
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
        >
          <RotateCcw size={20} />
          Reset
        </button>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add at End
        </button>
      </div>
      
      <div className="bg-gray-50 p-5 rounded-lg shadow-inner">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Insert at Position</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Position:</label>
            <input
              type="number"
              min="0"
              value={insertPosition}
              onChange={(e) => setInsertPosition(Number(e.target.value))}
              className="w-20 px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Value:</label>
            <input
              type="number"
              value={insertValue}
              onChange={(e) => setInsertValue(Number(e.target.value))}
              className="w-20 px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => onInsert(insertPosition, insertValue)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <ArrowDown size={20} />
            Insert
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-5 rounded-lg shadow-inner">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Remove at Position</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Position:</label>
            <input
              type="number"
              min="0"
              value={removePosition}
              onChange={(e) => setRemovePosition(Number(e.target.value))}
              className="w-20 px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => onRemove(removePosition)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <Minus size={20} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default Controls;