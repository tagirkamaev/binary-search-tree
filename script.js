class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const sortedArray = Array.from(new Set(array)).sort((a, b) => a - b);
    this.root = this.buildTree(sortedArray);
  }

  buildTree(array) {
    if (array.length === 0) return null;

    const middle = Math.floor(array.length / 2);
    const root = new Node(array[middle]);

    root.left = this.buildTree(array.slice(0, middle));
    root.right = this.buildTree(array.slice(middle + 1));

    return root;
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }

    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }

    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);

    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  // Insert node
  insert(value) {
    this.root = this._insertVal(this.root, value);
  }

  _insertVal(node, value) {
    if (node === null) return new Node(value);

    if (value < node.data) {
      node.left = this._insertVal(node.left, value);
    } else if (value > node.data) {
      node.right = this._insertVal(node.right, value);
    }

    return node;
  }

  // Delete node
  deleteItem(value) {
    this.root = this._deleteRec(this.root, value);
  }

  _deleteRec(node, value) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this._deleteRec(node.left, value);
    } else if (value > node.data) {
      node.right = this._deleteRec(node.right, value);
    } else {
      // 1. Node doesn't have children
      if (node.left === null && node.right === null) {
        return null;
      }

      // 2. Node has one child
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      // 3. Node has 2 children
      const minValue = this._findMin(node.right);
      node.data = minValue;
      node.right = this._deleteRec(node.right, minValue);
    }

    return node;
  }

  _findMin(node) {
    let current = node;

    while (current.left !== null) {
      current = current.left;
    }

    return current.data;
  }

  // Find node
  find(value) {
    return this._findRec(this.root, value);
  }

  _findRec(node, value) {
    if (node === null) return null;

    if (node.data === value) return node;

    if (value < node.data) {
      return this._findRec(node.left, value);
    } else if (value > node.data) {
      return this._findRec(node.right, value);
    }
  }

  // LEVEL order
  levelOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    if (!this.root) return;

    const queue = [this.root];

    while (queue.length > 0) {
      const currentNode = queue.shift();
      callback(currentNode);
    }

    if (currentNode.left) queue.push(currentNode.left);
    if (currentNode.right) queue.push(currentNode.right);
  }

  // DEPTH order
  inOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    this._inOrderRec(this.root, callback);
  }

  _inOrderRec(node, callback) {
    if (node === null) return;

    this._inOrderRec(node.left, callback);
    callback(node);
    this._inOrderRec(node.right, callback);
  }

  preOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    this._preOrderRec(this.root, callback);
  }

  _preOrderRec(node, callback) {
    if (node === null) return;

    callback(node);
    this._preOrderRec(node.left, callback);
    this._preOrderRec(node.right, callback);
  }

  postOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }

    this._postOrderRec(this.root, callback);
  }

  _postOrderRec(node, callback) {
    if (node === null) return;

    this._postOrderRec(node.left, callback);
    this._postOrderRec(node.right, callback);
    callback(node);
  }

  // Height and Depth of Tree
  height(node) {
    if (node === null) return -1;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    if (node === null) return -1;

    let depth = 0;
    let currentNode = this.root;

    while (currentNode !== null) {
      if (currentNode === node) return depth;

      if (node.data < currentNode.data) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }

      depth++;
    }

    return -1;
  }

  // Balance of Tree
  isBalanced() {
    return this._isBalancedRec(this.root);
  }

  _isBalancedRec(node) {
    if (node === null) return true;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    if (Math.abs(leftHeight - rightHeight) > 1) {
      return false;
    }

    return this._isBalancedRec(node.left) && this._isBalancedRec(node.right);
  }

  rebalance() {
    const sortedArray = [];
    this.inOrder((node) => sortedArray.push(node.data));

    this.root = this.buildTree(sortedArray);
  }
}

const array = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const tree = new Tree(array);

console.log(tree.isBalanced());
tree.insert(6);
console.log(tree.prettyPrint());
tree.deleteItem(23);
console.log(tree.prettyPrint());
