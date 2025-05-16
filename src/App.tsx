import React, { useEffect } from 'react';
import LinkedListNode from './components/LinkedListNode';
import Controls from './components/Controls';
import { Info, AlertCircle } from 'lucide-react';
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

  const getCppImplementation = () => {
    switch(listType) {
      case 'singly':
        return `
template<typename T>
class Node {
public:
    T data;
    Node* next;
    Node(T value) : data(value), next(nullptr) {}
};

template<typename T>
class SinglyLinkedList {
private:
    Node<T>* head;
    
public:
    SinglyLinkedList() : head(nullptr) {}
    
    void insert(T value) {
        Node<T>* newNode = new Node<T>(value);
        if (!head) {
            head = newNode;
            return;
        }
        Node<T>* current = head;
        while (current->next) {
            current = current->next;
        }
        current->next = newNode;
    }
    
    void remove(int position) {
        if (!head || position < 0) return;
        
        if (position == 0) {
            Node<T>* temp = head;
            head = head->next;
            delete temp;
            return;
        }
        
        Node<T>* current = head;
        for (int i = 0; current && i < position - 1; i++) {
            current = current->next;
        }
        
        if (!current || !current->next) return;
        
        Node<T>* temp = current->next;
        current->next = temp->next;
        delete temp;
    }
};`;
      case 'doubly':
        return `
template<typename T>
class Node {
public:
    T data;
    Node* next;
    Node* prev;
    Node(T value) : data(value), next(nullptr), prev(nullptr) {}
};

template<typename T>
class DoublyLinkedList {
private:
    Node<T>* head;
    Node<T>* tail;
    
public:
    DoublyLinkedList() : head(nullptr), tail(nullptr) {}
    
    void insert(T value) {
        Node<T>* newNode = new Node<T>(value);
        if (!head) {
            head = tail = newNode;
            return;
        }
        tail->next = newNode;
        newNode->prev = tail;
        tail = newNode;
    }
    
    void remove(int position) {
        if (!head || position < 0) return;
        
        Node<T>* current = head;
        for (int i = 0; current && i < position; i++) {
            current = current->next;
        }
        
        if (!current) return;
        
        if (current->prev) {
            current->prev->next = current->next;
        } else {
            head = current->next;
        }
        
        if (current->next) {
            current->next->prev = current->prev;
        } else {
            tail = current->prev;
        }
        
        delete current;
    }
};`;
      case 'circular':
        return `
template<typename T>
class Node {
public:
    T data;
    Node* next;
    Node(T value) : data(value), next(nullptr) {}
};

template<typename T>
class CircularLinkedList {
private:
    Node<T>* head;
    
public:
    CircularLinkedList() : head(nullptr) {}
    
    void insert(T value) {
        Node<T>* newNode = new Node<T>(value);
        if (!head) {
            head = newNode;
            head->next = head;
            return;
        }
        Node<T>* current = head;
        while (current->next != head) {
            current = current->next;
        }
        current->next = newNode;
        newNode->next = head;
    }
    
    void remove(int position) {
        if (!head || position < 0) return;
        
        if (position == 0) {
            if (head->next == head) {
                delete head;
                head = nullptr;
                return;
            }
            Node<T>* current = head;
            while (current->next != head) {
                current = current->next;
            }
            current->next = head->next;
            delete head;
            head = current->next;
            return;
        }
        
        Node<T>* current = head;
        for (int i = 0; i < position - 1; i++) {
            current = current->next;
            if (current == head) return;
        }
        
        Node<T>* temp = current->next;
        current->next = temp->next;
        delete temp;
    }
};`;
      case 'doubly-circular':
        return `
template<typename T>
class Node {
public:
    T data;
    Node* next;
    Node* prev;
    Node(T value) : data(value), next(nullptr), prev(nullptr) {}
};

template<typename T>
class DoublyCircularLinkedList {
private:
    Node<T>* head;
    
public:
    DoublyCircularLinkedList() : head(nullptr) {}
    
    void insert(T value) {
        Node<T>* newNode = new Node<T>(value);
        if (!head) {
            head = newNode;
            head->next = head->prev = head;
            return;
        }
        Node<T>* last = head->prev;
        last->next = newNode;
        newNode->prev = last;
        newNode->next = head;
        head->prev = newNode;
    }
    
    void remove(int position) {
        if (!head || position < 0) return;
        
        Node<T>* current = head;
        for (int i = 0; i < position; i++) {
            current = current->next;
            if (current == head) return;
        }
        
        if (current == head && current->next == head) {
            delete head;
            head = nullptr;
            return;
        }
        
        current->prev->next = current->next;
        current->next->prev = current->prev;
        
        if (current == head) {
            head = current->next;
        }
        
        delete current;
    }
};`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-[1440px] mx-auto">
        <header className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
            Advanced Linked List Visualizer
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Visualize how different types of linked lists work with memory addresses and pointers
          </p>
        </header>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 mb-4 sm:mb-6 lg:mb-8 rounded shadow-md mx-2 sm:mx-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Visualizer Constraints & Limitations</h3>
              <div className="mt-2 text-xs sm:text-sm text-yellow-700 space-y-2">
                <div>
                  <strong>Node Values:</strong>
                  <ul className="list-disc ml-4 mt-1">
                    <li>Only positive integers are supported (0 to 999)</li>
                    <li>No strings, or complex data types</li>
                    {/* <li>Each value must be unique within the list</li> */}
                  </ul>
                </div>
                <div>
                  <strong>List Operations:</strong>
                  <ul className="list-disc ml-4 mt-1">
                    <li>Maximum of 10 nodes for optimal visualization</li>
                    <li>No duplicate addresses allowed</li>
                    <li>Fixed traversal speed of 1 second per node</li>
                  </ul>
                </div>
                <div>
                  <strong>Memory Simulation:</strong>
                  <ul className="list-disc ml-4 mt-1">
                    <li>Addresses are simulated (not real memory addresses)</li>
                    <li>Memory leaks and garbage collection not visualized</li>
                    <li>Node deletion is instant (no memory deallocation visualization)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {showInfo && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 lg:mb-8 rounded shadow-md mx-2 sm:mx-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">About Linked Lists</h3>
                <div className="mt-2 text-xs sm:text-sm text-blue-700">
                  <p>This visualizer supports four types of linked lists:</p>
                  <ul className="list-disc ml-4 mt-2">
                    <li>Singly Linked: Each node points to the next node</li>
                    <li>Doubly Linked: Each node points to both next and previous nodes</li>
                    <li>Circular: Last node points back to the first node</li>
                    <li>Doubly Circular: Combines features of doubly and circular lists</li>
                  </ul>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    className="text-xs sm:text-sm text-blue-500 hover:text-blue-700"
                    onClick={() => setShowInfo(false)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="lg:flex lg:gap-6 xl:gap-8 space-y-4 lg:space-y-0">
          <div className="lg:flex-grow">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Visualization</h2>
              <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 lg:gap-8 min-h-[200px] bg-gray-50 p-3 sm:p-4 md:p-6 rounded-lg overflow-x-auto">
                {nodes.map((node, index) => (
                  <LinkedListNode
                    key={node.address}
                    value={node.value}
                    address={node.address}
                    nextAddress={node.next}
                    prevAddress={node.prev}
                    isHighlighted={currentIndex === index}
                    isTraversing={traversingPath.includes(index)}
                    isLast={!node.next || ((listType === 'circular' || listType === 'doubly-circular') && index === nodes.length - 1)}
                    isFirst={index === 0}
                    listType={listType}
                  />
                ))}
                {pendingNode && (
                  <div className="flex items-center">
                    <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-lg border-2 border-dashed border-green-500 flex flex-col items-center justify-center animate-pulse bg-green-50">
                      <span className="text-lg sm:text-xl font-semibold">{pendingNode.value}</span>
                      <span className="text-[10px] sm:text-xs text-gray-600 mt-1">
                        {pendingNode.address.substring(0, 6)}...
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 sm:mt-6 lg:mt-8 space-y-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Operation Log:</h3>
                  <div className="bg-white p-2 sm:p-3 rounded border font-mono text-xs sm:text-sm">
                    <p className="text-gray-700">{operationLog}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Memory Layout:</h3>
                  <div className="bg-white p-2 sm:p-3 rounded border overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Pointer</th>
                          {(listType === 'doubly' || listType === 'doubly-circular') && (
                            <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prev Pointer</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 font-mono text-xs sm:text-sm">
                        {nodes.map((node) => (
                          <tr key={node.address} className={currentIndex !== null && node === nodes[currentIndex] ? "bg-blue-50" : ""}>
                            <td className="px-2 sm:px-4 py-2 text-gray-600">{node.address}</td>
                            <td className="px-2 sm:px-4 py-2 text-gray-900">{node.value}</td>
                            <td className="px-2 sm:px-4 py-2 text-gray-600">{node.next || 'null'}</td>
                            {(listType === 'doubly' || listType === 'doubly-circular') && (
                              <td className="px-2 sm:px-4 py-2 text-gray-600">{node.prev || 'null'}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[400px] xl:w-[450px]">
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

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-4 sm:mt-6 lg:mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">C++ Implementation</h2>
          <pre className="bg-gray-50 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
            <code className="font-mono text-gray-800">{getCppImplementation()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;