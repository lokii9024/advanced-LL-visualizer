export type ListType = 'singly' | 'doubly' | 'circular' | 'doubly-circular';

export interface Node {
  value: number;
  address: string;
  next: string | null;
  prev?: string | null;
}

export interface ListState {
  nodes: Node[];
  currentIndex: number | null;
  traversingPath: number[];
  isPlaying: boolean;
  speed: number;
  operationLog: string;
  isAddingNode: boolean;
  pendingNode: Node | null;
  listType: ListType;
}