import { create } from 'zustand';
import { ListState, ListType, Node } from './types';

const generateAddress = () => '0x' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

const createInitialNodes = (type: ListType): Node[] => {
  const nodes: Node[] = Array.from({ length: 4 }, (_, i) => ({
    value: i + 1,
    address: generateAddress(),
    next: null,
    prev: type === 'doubly' ? null : undefined
  }));

  // Link the nodes
  for (let i = 0; i < nodes.length; i++) {
    const nextIndex = (i + 1) % nodes.length;
    nodes[i].next = type === 'circular' || i < nodes.length - 1 ? nodes[nextIndex].address : null;
    
    if (type === 'doubly') {
      nodes[i].prev = i > 0 ? nodes[i - 1].address : null;
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
      
      const newNode: Node = {
        value: newValue,
        address: newAddress,
        next: state.listType === 'circular' ? state.nodes[0]?.address || null : null,
        prev: state.listType === 'doubly' ? state.nodes[state.nodes.length - 1]?.address || null : undefined
      };

      // Start traversal from the beginning
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
              
              if (state.listType === 'doubly') {
                newNode.prev = lastNode.address;
              }
            }

            if (state.listType === 'circular' && updatedNodes.length === 0) {
              newNode.next = newNode.address;
              if (state.listType === 'doubly') {
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

  removeNode: () => {
    set(state => {
      if (state.nodes.length <= 1) {
        return {
          operationLog: "Cannot remove node from empty list"
        };
      }

      const updatedNodes = state.nodes.slice(0, -1);
      if (updatedNodes.length > 0) {
        const lastNode = updatedNodes[updatedNodes.length - 1];
        lastNode.next = state.listType === 'circular' ? updatedNodes[0].address : null;
      }

      return {
        nodes: updatedNodes,
        operationLog: `Removed last node`
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
      const newNode: Node = {
        value,
        address: newAddress,
        next: position < state.nodes.length ? state.nodes[position].address : null,
        prev: state.listType === 'doubly' ? (position > 0 ? state.nodes[position - 1].address : null) : undefined
      };

      // Start traversal animation
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
              if (state.listType === 'doubly') {
                newNode.prev = updatedNodes[position - 1].address;
              }
            }

            if (position < updatedNodes.length) {
              newNode.next = updatedNodes[position].address;
              if (state.listType === 'doubly') {
                updatedNodes[position].prev = newNode.address;
              }
            }

            updatedNodes.splice(position, 0, newNode);

            if (state.listType === 'circular') {
              updatedNodes[updatedNodes.length - 1].next = updatedNodes[0].address;
              if (state.listType === 'doubly') {
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

      if (nextNodeIndex === -1 || (!state.nodes[state.currentIndex].next && state.listType !== 'circular')) {
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