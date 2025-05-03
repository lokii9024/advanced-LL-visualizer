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
  const isDoublyType = listType === 'doubly' || listType === 'doubly-circular';
  
  return (
    <div className="flex flex-col items-center">
      {showHeadTail && isFirst && (
        <div className="text-sm font-semibold text-blue-600 mb-1">Head</div>
      )}
      <div className="text-xs font-semibold text-gray-600 mb-1">Address: {address}</div>
      <div className="flex items-center">
        {isDoublyType && !isFirst && (
          <div className="flex flex-col items-center mx-4">
            <ArrowLeft 
              className={`text-gray-400 ${isTraversing ? 'text-green-500 animate-pulse' : ''}`} 
              size={24} 
            />
            {listType === 'doubly-circular' && (
              <span className="text-[10px] font-semibold text-gray-600 mt-1">
                {prevAddress ? prevAddress.substring(0, 6) + '...' : 'null'}
              </span>
            )}
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
          <div className="text-xs font-medium text-gray-700 mt-1 space-y-1">
            {listType === 'doubly-circular' ? (
              <>
                <div>next: {nextAddress ? nextAddress.substring(0, 6) + '...' : 'null'}</div>
                <div>prev: {prevAddress ? prevAddress.substring(0, 6) + '...' : 'null'}</div>
              </>
            ) : (
              <div>next: {nextAddress ? nextAddress.substring(0, 6) + '...' : 'null'}</div>
            )}
          </div>
        </div>
        {(!isLast || listType === 'circular' || listType === 'doubly-circular') && (
          <div className="flex flex-col items-center mx-4">
            <ArrowRight 
              className={`text-gray-400 ${isTraversing ? 'text-green-500 animate-pulse' : ''}`} 
              size={24} 
            />
            {listType === 'doubly-circular' && (
              <span className="text-[10px] font-semibold text-gray-600 mt-1">
                {nextAddress ? nextAddress.substring(0, 6) + '...' : 'null'}
              </span>
            )}
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