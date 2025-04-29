import React, { useEffect } from 'react';
import LinkedListNode from './components/LinkedListNode';
import Controls from './components/Controls';
import { Info } from 'lucide-react';
import { useListStore } from './store';
import { ListType } from './types';

function App() {
  const {
    nodes,
    currentIndex,
    traversingPath,
    isPlaying,
    operationLog,
    isAddingNode,
    pendingNode,
    listType,
    initializeList,
    setIsPlaying,
    resetVisualization,
    addNode,
    removeNode,
    insertNode,
    traverse
  } = useListStore();

  const [showInfo, setShowInfo] = React.useState(true);

  useEffect(() => {
    initializeList('singly');
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !isAddingNode) {
      timer = setInterval(traverse, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, traverse, isAddingNode]);

  const handleTypeChange = (type: ListType) => {
    initializeList(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Advanced Linked List Visualizer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visualize how different types of linked lists work with memory addresses and pointers
          </p>
        </header>
        
        {showInfo && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded shadow-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">About Linked Lists</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>This visualizer supports three types of linked lists:</p>
                  <ul className="list-disc ml-4 mt-2">
                    <li>Singly Linked: Each node points to the next node</li>
                    <li>Doubly Linked: Each node points to both next and previous nodes</li>
                    <li>Circular: Last node points back to the first node</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="text-sm text-blue-500 hover:text-blue-700"
                    onClick={() => setShowInfo(false)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Visualization</h2>
          <div className="flex items-center justify-center flex-wrap gap-8 min-h-[200px] bg-gray-50 p-6 rounded-lg overflow-x-auto">
            {nodes.map((node, index) => (
              <LinkedListNode
                key={node.address}
                value={node.value}
                address={node.address}
                nextAddress={node.next}
                prevAddress={node.prev}
                isHighlighted={currentIndex === index}
                isTraversing={traversingPath.includes(index)}
                isLast={!node.next || (listType === 'circular' && index === nodes.length - 1)}
                isFirst={index === 0}
                listType={listType}
              />
            ))}
            {pendingNode && (
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-green-500 flex flex-col items-center justify-center animate-pulse bg-green-50">
                  <span className="text-xl font-semibold">{pendingNode.value}</span>
                  <span className="text-xs text-gray-600 mt-1">
                    {pendingNode.address.substring(0, 6)}...
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Operation Log:</h3>
              <div className="bg-white p-3 rounded border font-mono text-sm">
                <p className="text-gray-700">{operationLog}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Memory Layout:</h3>
              <div className="bg-white p-3 rounded border overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Pointer</th>
                      {listType === 'doubly' && (
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prev Pointer</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 font-mono text-sm">
                    {nodes.map((node) => (
                      <tr key={node.address} className={currentIndex !== null && node === nodes[currentIndex] ? "bg-blue-50" : ""}>
                        <td className="px-4 py-2 text-gray-600">{node.address}</td>
                        <td className="px-4 py-2 text-gray-900">{node.value}</td>
                        <td className="px-4 py-2 text-gray-600">{node.next || 'null'}</td>
                        {listType === 'doubly' && (
                          <td className="px-4 py-2 text-gray-600">{node.prev || 'null'}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Controls
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onReset={resetVisualization}
          onAdd={addNode}
          onRemove={removeNode}
          onInsert={insertNode}
          onTypeChange={handleTypeChange}
          listType={listType}
        />
      </div>
    </div>
  );
}

export default App;