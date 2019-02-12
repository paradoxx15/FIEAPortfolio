// Sean Szumlanski
// COP 3503, Fall 2016

// ====================
// GenericBST: BST.java
// ====================
// Basic binary search tree (BST) implementation that supports insert() and
// delete() operations. This framework is provide for you to modify as part of
// Programming Assignment #2.


import java.io.*;
import java.util.*;

class Node
{
	int data;
	Node left, right;

	Node(int data)
	{
		this.data = data;
	}
}

public class BST
{
	private Node root;

	public void insert(int data)
	{
		root = insert(root, data);
	}

	private Node insert(Node root, int data)
	{
		if (root == null)
		{
			return new Node(data);
		}
		else if (data < root.data)
		{
			root.left = insert(root.left, data);
		}
		else if (data > root.data)
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

	public void delete(int data)
	{
		root = delete(root, data);
	}

	private Node delete(Node root, int data)
	{
		if (root == null)
		{
			return null;
		}
		else if (data < root.data)
		{
			root.left = delete(root.left, data);
		}
		else if (data > root.data)
		{
			root.right = delete(root.right, data);
		}
		else
		{
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
	private int findMax(Node root)
	{
		while (root.right != null)
		{
			root = root.right;
		}

		return root.data;
	}

	// Returns true if the value is contained in the BST, false otherwise.
	public boolean contains(int data)
	{
		return contains(root, data);
	}

	private boolean contains(Node root, int data)
	{
		if (root == null)
		{
			return false;
		}
		else if (data < root.data)
		{
			return contains(root.left, data);
		}
		else if (data > root.data)
		{
			return contains(root.right, data);
		}
		else
		{
			return true;
		}
	}

	public void inorder()
	{
		System.out.print("In-order Traversal:");
		inorder(root);
		System.out.println();
	}

	private void inorder(Node root)
	{
		if (root == null)
			return;

		inorder(root.left);
		System.out.print(" " + root.data);
		inorder(root.right);
	}

	public void preorder()
	{
		System.out.print("Pre-order Traversal:");
		preorder(root);
		System.out.println();
	}

	private void preorder(Node root)
	{
		if (root == null)
			return;

		System.out.print(" " + root.data);
		preorder(root.left);
		preorder(root.right);
	}

	public void postorder()
	{
		System.out.print("Post-order Traversal:");
		postorder(root);
		System.out.println();
	}

	private void postorder(Node root)
	{
		if (root == null)
			return;

		postorder(root.left);
		postorder(root.right);
		System.out.print(" " + root.data);
	}

	public static void main(String [] args)
	{
		BST myTree = new BST();

		for (int i = 0; i < 5; i++)
		{
			int r = (int)(Math.random() * 100) + 1;
			System.out.println("Inserting " + r + "...");
			myTree.insert(r);
		}

		myTree.inorder();
		myTree.preorder();
		myTree.postorder();
	}
}
