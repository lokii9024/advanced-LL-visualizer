import { create } from 'zustand';
import { ListState, ListType, Node } from './types';

const generateAddress = () => '0x' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

const createInitialNodes = (type: ListType): Node[] => {
  const nodes: Node[] = Array.from({ length: 4 }, (_, i) => ({
    value: i + 1,
    address: generateAddress(),
    next: null,
    prev: type === 'doubly' || type === 'doubly-circular' ? null : undefined
  }));

  // Link the nodes
  for (let i = 0; i < nodes.length; i++) {
    const nextIndex = (i + 1) % nodes.length;
    const isCircular = type === 'circular' || type === 'doubly-circular';
    nodes[i].next = isCircular || i < nodes.length - 1 ? nodes[nextIndex].address : null;
    
    if (type === 'doubly' || type === 'doubly-circular') {
      const prevIndex = (i - 1 + nodes.length) % nodes.length;
      nodes[i].prev = isCircular || i > 0 ? nodes[prevIndex].address : null;
    }
  }

  return nodes;
};

export const useListStore = create<ListState>((set, get) => ({
  nodes: [],
  currentIndex: null,
  traversingPath: [],
  isPlaying: false,
  speed: 1000,
  operationLog: 'Initialize linked list',
  isAddingNode: false,
  pendingNode: null,
  listType: 'singly',
  
  initializeList: (type: ListType) => {
    set({
      nodes: createInitialNodes(type),
      listType: type,
      currentIndex: null,
      traversingPath: [],
      isPlaying: false,
      operationLog: `Initialized ${type} linked list`
    });
  },

  resetVisualization: () => {
    set(state => ({
      currentIndex: null,
      traversingPath: [],
      isPlaying: false,
      isAddingNode: false,
      pendingNode: null,
      operationLog: `Reset ${state.listType} linked list visualization`
    }));
  },

  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  
  addNode: () => {
    set(state => {
      const newAddress = generateAddress();
      const newValue = state.nodes.length + 1;
      const isCircular = state.listType === 'circular' || state.listType === 'doubly-circular';
      
      const newNode: Node = {
        value: newValue,
        address: newAddress,
        next: isCircular ? state.nodes[0]?.address || null : null,
        prev: (state.listType === 'doubly' || state.listType === 'doubly-circular') 
          ? state.nodes[state.nodes.length - 1]?.address || null 
          : undefined
      };

      const traversalTimer = setInterval(() => {
        const { currentIndex, nodes } = get();
        
        if (currentIndex === null) {
          set({
            currentIndex: 0,
            traversingPath: [0],
            operationLog: `Traversing to add new node with value ${newValue}`
          });
        } else if (currentIndex < nodes.length - 1) {
          set(state => ({
            currentIndex: currentIndex + 1,
            traversingPath: [...state.traversingPath, currentIndex + 1],
            operationLog: `Traversing to position ${currentIndex + 1}`
          }));
        } else {
          clearInterval(traversalTimer);
          set(state => {
            const updatedNodes = [...state.nodes];
            if (updatedNodes.length > 0) {
              const lastNode = updatedNodes[updatedNodes.length - 1];
              lastNode.next = newNode.address;
              
              if (state.listType === 'doubly' || state.listType === 'doubly-circular') {
                newNode.prev = lastNode.address;
              }
            }

            if (isCircular && updatedNodes.length === 0) {
              newNode.next = newNode.address;
              if (state.listType === 'doubly-circular') {
                newNode.prev = newNode.address;
              }
            }

            return {
              nodes: [...updatedNodes, newNode],
              currentIndex: null,
              traversingPath: [],
              isAddingNode: false,
              pendingNode: null,
              operationLog: `Added node with value ${newNode.value}`
            };
          });
        }
      }, 1000);

      return {
        pendingNode: newNode,
        isAddingNode: true,
        operationLog: `Starting to add node with value ${newValue} at address ${newAddress}`
      };
    });
  },

  removeNode: (position: number) => {
    set(state => {
      if (state.nodes.length === 0) {
        return {
          operationLog: "Cannot remove node from empty list"
        };
      }

      if (position < 0 || position >= state.nodes.length) {
        return {
          operationLog: `Invalid position: ${position}`
        };
      }

      const updatedNodes = [...state.nodes];
      const removedNode = updatedNodes[position];
      const isCircular = state.listType === 'circular' || state.listType === 'doubly-circular';
      const isDoubly = state.listType === 'doubly' || state.listType === 'doubly-circular';

      // Update connections
      if (updatedNodes.length > 1) {
        const prevNode = position > 0 ? updatedNodes[position - 1] : isCircular ? updatedNodes[updatedNodes.length - 1] : null;
        const nextNode = position < updatedNodes.length - 1 ? updatedNodes[position + 1] : isCircular ? updatedNodes[0] : null;

        if (prevNode) {
          prevNode.next = nextNode ? nextNode.address : isCircular ? updatedNodes[0].address : null;
        }
        if (nextNode && isDoubly) {
          nextNode.prev = prevNode ? prevNode.address : isCircular ? updatedNodes[updatedNodes.length - 2].address : null;
        }
      }

      updatedNodes.splice(position, 1);

      return {
        nodes: updatedNodes,
        operationLog: `Removed node with value ${removedNode.value} at position ${position}`
      };
    });
  },

  insertNode: (position: number, value: number) => {
    set(state => {
      if (position < 0 || position > state.nodes.length) {
        return {
          operationLog: `Invalid position: ${position}`
        };
      }

      const newAddress = generateAddress();
      const isCircular = state.listType === 'circular' || state.listType === 'doubly-circular';
      const isDoubly = state.listType === 'doubly' || state.listType === 'doubly-circular';

      const newNode: Node = {
        value,
        address: newAddress,
        next: position < state.nodes.length ? state.nodes[position].address : null,
        prev: isDoubly ? (position > 0 ? state.nodes[position - 1].address : null) : undefined
      };

      const traversalTimer = setInterval(() => {
        const { currentIndex, nodes } = get();
        
        if (currentIndex === null) {
          set({
            currentIndex: 0,
            traversingPath: [0],
            operationLog: `Traversing to insert node with value ${value}`
          });
        } else if (currentIndex < position - 1) {
          set(state => ({
            currentIndex: currentIndex + 1,
            traversingPath: [...state.traversingPath, currentIndex + 1],
            operationLog: `Traversing to position ${currentIndex + 1}`
          }));
        } else {
          clearInterval(traversalTimer);
          set(state => {
            const updatedNodes = [...state.nodes];
            
            if (position > 0) {
              updatedNodes[position - 1].next = newNode.address;
              if (isDoubly) {
                newNode.prev = updatedNodes[position - 1].address;
              }
            }

            if (position < updatedNodes.length) {
              newNode.next = updatedNodes[position].address;
              if (isDoubly) {
                updatedNodes[position].prev = newNode.address;
              }
            }

            updatedNodes.splice(position, 0, newNode);

            if (isCircular) {
              updatedNodes[updatedNodes.length - 1].next = updatedNodes[0].address;
              if (isDoubly) {
                updatedNodes[0].prev = updatedNodes[updatedNodes.length - 1].address;
              }
            }

            return {
              nodes: updatedNodes,
              currentIndex: null,
              traversingPath: [],
              isAddingNode: false,
              pendingNode: null,
              operationLog: `Inserted node with value ${value} at position ${position}`
            };
          });
        }
      }, 1000);

      return {
        pendingNode: newNode,
        isAddingNode: true,
        operationLog: `Starting to insert node with value ${value} at position ${position}`
      };
    });
  },

  traverse: () => {
    set(state => {
      if (!state.isPlaying || state.isAddingNode) return state;

      if (state.currentIndex === null) {
        return {
          currentIndex: 0,
          traversingPath: [0],
          operationLog: `Starting traversal from first node (${state.nodes[0]?.address})`
        };
      }

      const nextNodeIndex = state.nodes.findIndex(
        node => node.address === state.nodes[state.currentIndex!].next
      );

      const isCircular = state.listType === 'circular' || state.listType === 'doubly-circular';
      if (nextNodeIndex === -1 || (!state.nodes[state.currentIndex].next && !isCircular)) {
        return {
          currentIndex: null,
          isPlaying: false,
          operationLog: 'Reached end of list'
        };
      }

      return {
        currentIndex: nextNodeIndex,
        traversingPath: [...state.traversingPath, nextNodeIndex],
        operationLog: `Traversing to node at address ${state.nodes[nextNodeIndex].address}`
      };
    });
  }
}));