import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ListType } from '../types';

interface LinkedListNodeProps {
  value: number;
  address: string;
  nextAddress: string | null;
  prevAddress?: string | null;
  isHighlighted?: boolean;
  isTraversing?: boolean;
  isLast?: boolean;
  isFirst?: boolean;
  listType: ListType;
}

const LinkedListNode: React.FC<LinkedListNodeProps> = ({ 
  value, 
  address, 
  nextAddress, 
  prevAddress,
  isHighlighted, 
  isTraversing,
  isLast,
  isFirst,
  listType
}) => {
  const showHeadTail = listType === 'singly' || listType === 'doubly';
  
  return (
    <div className="flex flex-col items-center">
      {showHeadTail && isFirst && (
        <div className="text-sm font-semibold text-blue-600 mb-1">Head</div>
      )}
      <div className="text-xs text-gray-500 mb-1">Address: {address}</div>
      <div className="flex items-center">
        {listType === 'doubly' && !isFirst && (
          <div className="flex flex-col items-center mx-4">
            <ArrowLeft 
              className={`text-gray-400 ${isTraversing ? 'text-green-500 animate-pulse' : ''}`} 
              size={24} 
            />
          </div>
        )}
        <div
          className={`
            relative w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center
            transition-all duration-300 transform
            ${isHighlighted ? 'border-blue-500 bg-blue-100 scale-110' : 'border-gray-300 bg-white'}
            ${isTraversing ? 'border-green-500 bg-green-100' : ''}
          `}
        >
          <span className="text-xl font-semibold">{value}</span>
          <div className="text-xs text-gray-600 mt-1 space-y-1">
            <div>next: {nextAddress ? nextAddress.substring(0, 6) + '...' : 'null'}</div>
            {listType === 'doubly' && (
              <div>prev: {prevAddress ? prevAddress.substring(0, 6) + '...' : 'null'}</div>
            )}
          </div>
        </div>
        {(!isLast || listType === 'circular') && (
          <div className="flex flex-col items-center mx-4">
            <ArrowRight 
              className={`text-gray-400 ${isTraversing ? 'text-green-500 animate-pulse' : ''}`} 
              size={24} 
            />
          </div>
        )}
      </div>
      {showHeadTail && isLast && listType !== 'circular' && (
        <div className="text-sm font-semibold text-blue-600 mt-1">Tail</div>
      )}
    </div>
  );
}

export default LinkedListNode;