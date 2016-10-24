class Node {
	constructor (key, value) {
		this.key = key;
		this.value = value;
		this.left = null;
		this.right = null;
	}
}
function insert(current, key, value) {
	if (current === null) return new Node(key, value);
	if (key > current.key) {
		current.right = insert(current.right, key, value);
	} else if (key < current.key) {
		current.left = insert(current.left, key, value);
	} else {
		current.value = value;
	}
	return current;
}
function getValue (current, key) {
	if (current === null) return { flag: 0, msg: "not found" }; 
	if (current.key < key) return getValue(current.right, key);
	if (current.key > key) return getValue(current.left, key);
	return current.value;
}
class BinarySearchTree {
	constructor () {
		this.root = null;
		this.length = 0;
	}
	insert (key, value) {
		if (key == null || value == null) { // ban null or undefined
			throw new Error("argument is error");
		}
		this.root = insert(this.root, key, value);
		this.length++;
	}  
	get (key) {
		return getValue(this.root, key);
	}
}
const tree = new BinarySearchTree();
tree.insert(2, "B");
tree.insert(1, "A");
tree.insert(3, "C");
tree.insert(4, "D");
console.log(tree.get(3));