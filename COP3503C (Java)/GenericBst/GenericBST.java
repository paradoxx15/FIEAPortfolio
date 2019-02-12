// Gaelen Dignan
// ga634357

// ====================
// GenericBST: BST.java
// ====================
// Basic binary search tree (BST) implementation that supports insert() and
// delete() operations. This framework is provide for you to modify as part of
// Programming Assignment #2.


import java.io.*;
import java.util.*;

//Individual node of a BST that contains generic T data
class Node<T extends Comparable<T>>
{
	T data;
	Node<T> left, right;

	Node(T data)
	{
		this.data = data;
	}
}

//A BST that can contain generic data that extends Comparable
public class GenericBST<T extends Comparable<T>>
{
	private Node<T> root;

	public void insert(T data)
	{
		root = insert(root, data);
	}

	//Iterates through the tree and inserts the Node root with T data 
	//into the correct spot in the BST 
	private Node<T> insert(Node<T> root, T data)
	{
		//Inserts at root
		if (root == null)
		{
			return new Node<T>(data);
		}

		//Inserts into left subtree
		else if (data.compareTo(root.data) < 0)
		{
			root.left = insert(root.left, data);
		}

		//Inserts into right subtree
		else if (data.compareTo(root.data) > 0)
		{
			root.right = insert(root.right, data);
		}
		else
		{
			// Stylistically, I have this here to explicitly state that we are
			// disallowing insertion of duplicate values. This is unconventional.
			;
		}

		return root;
	}

	public void delete(T data)
	{
		root = delete(root, data);
	}

	//Starts from the root and iterates through the tree, deleting the Node 
	//containing T data
	private Node<T> delete(Node<T> root, T data)
	{
		if (root == null)
		{
			return null;
		}

		//Recursively calls delete on the left subtree
		else if (data.compareTo(root.data) < 0)
		{
			root.left = delete(root.left, data);
		}

		//Recursively calls delete on the right subtree
		else if (data.compareTo(root.data) > 0)
		{
			root.right = delete(root.right, data);
		}
		//Returns the replacement Node for the deleted root
		else
		{
			//root is a leaf Node
			if (root.left == null && root.right == null)
			{
				return null;
			}
			else if (root.right == null)
			{
				return root.left;
			}
			else if (root.left == null)
			{
				return root.right;
			}
			//Replaces root's data with the max child in the left subtries data
			//and then deletes that child
			else
			{
				root.data = findMax(root.left);
				root.left = delete(root.left, root.data);
			}
		}

		return root;
	}

	// This method assumes root is non-null, since this is only called by
	// delete() on the left subtree, and only when that subtree is non-empty.
	private T findMax(Node<T> root)
	{
		while (root.right != null)
		{
			root = root.right;
		}

		return root.data;
	}

	// Returns true if the value is contained in the BST, false otherwise.
	public boolean contains(T data)
	{
		return contains(root, data);
	}

	//Seaches the tree for a specific node containting T data
	private boolean contains(Node<T> root, T data)
	{
		if (root == null)
		{
			return false;
		}
		else if (data.compareTo(root.data) < 0)
		{
			return contains(root.left, data);
		}
		else if (data.compareTo(root.data) > 0)
		{
			return contains(root.right, data);
		}
		else
		{
			return true;
		}
	}

	//Prints out the inorder traversal of the Tree
	public void inorder()
	{
		System.out.print("In-order Traversal:");
		inorder(root);
		System.out.println();
	}

	private void inorder(Node<T> root)
	{
		if (root == null)
			return;

		inorder(root.left);
		System.out.print(" " + root.data);
		inorder(root.right);
	}

	//Prints out the preorder traversal of the tree
	public void preorder()
	{
		System.out.print("Pre-order Traversal:");
		preorder(root);
		System.out.println();
	}

	private void preorder(Node<T> root)
	{
		if (root == null)
			return;

		System.out.print(" " + root.data);
		preorder(root.left);
		preorder(root.right);
	}

	//Prints out the postorder traversal of the tree
	public void postorder()
	{
		System.out.print("Post-order Traversal:");
		postorder(root);
		System.out.println();
	}

	private void postorder(Node<T> root)
	{
		if (root == null)
			return;

		postorder(root.left);
		postorder(root.right);
		System.out.print(" " + root.data);
	}

	//Returns the difficulty rating of the program
	public static double difficultyRating()
	{
		return 2.0;
	}

	//Returns the hours spent on the program
	public static double hoursSpent()
	{
		return 2.0;
	}

}
