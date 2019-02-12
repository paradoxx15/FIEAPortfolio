// Gaelen Dignan
// ga634357

import java.util.*;
import java.io.*;

// A node that contains data of any type, a height, and pointers to a node at
// each level of that height
class Node<T extends Comparable<T>>
{
	private ArrayList<Node<T>> nextNodes = new ArrayList<Node<T>>();
	private int height;
	private T data;

	// Initializes the Node's height and adds null pointer for each level 
	Node(int height)
	{
		this.height = height;

		for (int i = 0; i < height; i++)
		{
			nextNodes.add(i, null);
		}
	}

	// Initializes the Node's height, add null pointers for each level
	// and sets its data to T data
	Node(T data, int height)
	{
		this.height = height;
		this.data = data;

		for (int i = 0; i < height; i++)
		{
			nextNodes.add(i, null);
		}
	}

	// Returns the data held within the Node
	public T value()
	{
		return data;
	}

	// Returns the height of the Node
	public int height()
	{
		return height;
	}

	// Returns the pointer to Node<T> at the specified level
	public Node<T> next(int level)
	{
		if (level < 0 || level > height - 1)
			return null;

		return nextNodes.get(level);
	}

	// Sets the next pointer at a specific index to a node
	public void setNext(int level, Node<T> node)
	{
		nextNodes.set(level, node);
	}

	// Makes the nodes height grow by 1 and add a new next pointer at that level
	public void grow()
	{
		height = height + 1;
		nextNodes.add(height - 1, null);
	}

	// Has a 50% chance to grow the node
	public boolean maybeGrow()
	{
		Random r = new Random();

		if (r.nextInt(2) == 1)
		{
			height = height + 1;
			nextNodes.add(height - 1, null);
			return true;
		}
		return false;
	}

	// Trims the height of the node and removes the top next pointer
	public void trim(int height)
	{
		while (this.height != height)
		{
			nextNodes.remove(--this.height);
		}
	}

}

// A list of the Nodes class that allows insertion, deletion, and traversal of 
// the list
public class SkipList<T extends Comparable<T>>
{
	private Node<T> head;
	private int size = 0;

	// Iniitalizes the head of the SkipList to height 1
	SkipList()
	{
		head = new Node<T>(1);
	}

	// Initializes the head of the SkipList to a specific height
	SkipList(int height)
	{
		head = new Node<T>((height <= 0) ? 1 : height);
	}

	// Returns the max height of the SkipList depending on how many nodes it has
	private static int getMaxHeight(int n)
	{
		return (n <= 2) ? 1 : (int)Math.ceil(Math.log(n)/Math.log(2));
	}

	// Generates a random height below or equal to the maxHeight
	// for a Node
	private static int generateRandomHeight(int maxHeight)
	{
		int height = 0;
		Random r = new Random();

		while (height != maxHeight)
		{
			height++;
			if (r.nextInt(2) == 0)
				break;
		}

		return height;
	}

	// Grows the SkipList, every Node at the maxHeight has a 50% chance to grow
	private void growSkipList()
	{
		Node<T> current;
		Node<T> previous = head;
		Node<T> lastGrown = head;
		int level = head.height() - 1;
		head.grow();

		// Traverses the top of the list calling maybeGrow() on each Node
		while(previous.next(level) != null)
		{
			current = previous.next(level);
		
			if (current.maybeGrow())
			{
				lastGrown.setNext(level + 1, current);
				lastGrown = current;
			}

			previous = current;
		}
	}

	// Trims the SkipList, bringing the height down by 1 and removing the top
	// pointer for each Node
	private void trimSkipList()
	{
		Node<T> current;
		Node<T> previous = head;
		int level = head.height() - 1;

		while(previous != null)
		{
			current = previous.next(level);
			previous.trim(level);
			previous = current;
		}
	}

	// Returns the size of the SkipList
	public int size()
	{
		return size;
	}

	// Returns the height of the SkipList
	public int height()
	{
		return head.height();
	}

	// Returns the head of the SkipList
	public Node<T> head()
	{
		return head;
	}

	// Traverses the SkipList, keeping track of each node that points to a
	// position where the new Node will take place, then sets all of those 
	// Nodes' next pointers to the new Node and the new Nodes next pointers
	// to where the other Nodes were pointing
	public void traverseInsert(Node<T> newNode, T data)
	{
		ArrayList<Node<T>> pointers = new ArrayList<>();
		Node<T> current = head;
		int level = head.height() - 1;

		// Continues looping through the list until position for the new node
		// is found
		while (true)
		{
			// Either stores the Node currently pointed at and moves down a 
			// level, or if it is at the bottom level sets all the Nodes
			// stored to the new Node and the new Nodes pointers to where
			// the stored Nodes previously pointed to
			if (current.next(level) == null 
				|| current.next(level).value().compareTo(data) >= 0)
			{
				if (level == 0)
				{
					pointers.add(current);

					// The reference pointers were put in pointers in 
					// descending order from top height
					for (int i = 0; i < newNode.height(); i++)
					{
						level = newNode.height() - 1 - i;
						current = pointers.get(i);
						newNode.setNext(level, current.next(level));
						current.setNext(level, newNode);
					}

					return;
				}

				if (level < newNode.height())
					pointers.add(current);

				level--;
			}

			// Continues to the next Node on the current level
			else if (current.next(level).value().compareTo(data) < 0)
			{
				current = current.next(level);
			}
		}
	}

	// Inserts a Node with specefic data and random height, growing the list if
	// necessary
	public void insert(T data)
	{
		size++;

		if (head.height() < getMaxHeight(size)) growSkipList();

		int newNodeHeight = generateRandomHeight(head.height());
		Node<T> newNode = new Node<T>(data, newNodeHeight);

		if (head.next(0) == null)
		{
			for (int i = 0; i < newNodeHeight; i++)
				head.setNext(i, newNode);

			return;
		}

		traverseInsert(newNode, data);
	}

	// Inserts a Node with specific data and height, growing the list if
	// necessary
	public void insert(T data, int height)
	{
		size++;

		if (head.height() < getMaxHeight(size)) growSkipList();

		Node<T> newNode = new Node<T>(data, height);

		if (head.next(0) == null)
		{
			for (int i = 0; i < height; i++)
				head.setNext(i, newNode);

			return;
		}

		traverseInsert(newNode, data);
	}

	// Deletes the first occurence of a Node containing data, shrinking the 
	// height of the list if necessary
	public void delete(T data)
	{
		if (head.next(0) == null) return;

		ArrayList<Node<T>> pointers = new ArrayList<>();
		Node<T> current = head;
		Node<T> deleteNode;
		int level = head.height() - 1;

		// Traverses through the entire list recording Nodes that pointed at
		// the to be deleted Node. Deletes that Node and shifts the recorded
		// Nodes pointers to where the deleted Node pointed
		while (true)
		{
			// Moves down a level or returns if already at the bottom level
			if (current.next(level) == null 
				|| current.next(level).value().compareTo(data) > 0)
			{
				if (level == 0)
					return;

				level--;
			}

			// Moves along to the next Node at the current level
			else if (current.next(level).value().compareTo(data) < 0)
			{
				current = current.next(level);
			}

			// Records the current Node pointing at the to be deleted Node,
			// and if at the bottom level sets all of the recorded Nodes
			// pointers to the deleted Nodes pointers
			else if (current.next(level).value().compareTo(data) == 0)
			{
				pointers.add(current);

				if (level == 0)
				{
					deleteNode = current.next(level);

					// The Nodes pointing at deleteNode were put in pointers in 
					// descending order from top height
					for (int i = 0; i < deleteNode.height(); i++)
					{
						current = pointers.get(pointers.size() - 1 - i);
						current.setNext(i, deleteNode.next(i));
					}

					size--;
					while (head.height() > getMaxHeight(size))
						trimSkipList();

					return;
				}

				level--;
			}
		}
	}

	// Returns true if the SkipList containes a Node with specific data
	public boolean contains(T data)
	{
		Node<T> current = head;
		int level = head.height() - 1;

		while (true)
		{
			// Moves down a level or breaks if the Node was not found
			if (current.next(level) == null 
				|| current.next(level).value().compareTo(data) > 0)
			{
				if (level == 0)
					return false;

				level--;
			}

			// Continues to the next Node at the current level
			else if (current.next(level).value().compareTo(data) < 0)
			{
				current = current.next(level);
			}

			// Returns true if the data was found
			else if (current.next(level).value().compareTo(data) == 0)
			{
				return true;
			}

		}
	}

	// Returns the difficulty rating of the program
	public static double difficultyRating()
	{
		return 3.0;
	}

	// Returns the hours spent on the program
	public static double hoursSpent()
	{
		return 6.0;
	}
}
 