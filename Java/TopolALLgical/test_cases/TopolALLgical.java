// Gaelen Dignan
// ga634357

import java.util.*;
import java.io.*;

// A node that holds id and its in-degree of edges
class Node
{
	int inDegree, id;
	ArrayList<Node> adjacentNodes = new ArrayList<>();

	public Node(int id)
	{
		this.id = id;
		inDegree = 0;
	}

}

public class TopolALLgical
{
	// Turns an ArrayList of Nodes into a String
	public static String pathToString(ArrayList<Node> path)
	{
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < path.size(); i++)
		{
			int id = path.get(i).id + 1;

			if (i == path.size() - 1)
				sb.append(id);
			else
				sb.append(id + " ");
		}
		return sb.toString();
	}

	// Recursively traverses the graph to create each possible topological sort
	private static void findTopoSorts(ArrayList<Node> unusedNodes, 
		HashSet<String> topoPaths, ArrayList<Node> path)
	{
		if (unusedNodes.isEmpty())
		{
			if (!path.isEmpty())
				topoPaths.add(pathToString(path));
			return;
		}

		for (int i = 0; i < unusedNodes.size(); i++)
		{
			Node current = unusedNodes.get(i);
			int key = current.id + 1;

			if (current.inDegree == 0)
			{
				unusedNodes.remove(current);
				path.add(current);
				for (Node n : current.adjacentNodes)
					n.inDegree--;

				findTopoSorts(unusedNodes, topoPaths, path);

				unusedNodes.add(i, current);
				path.remove(current);
				for (Node n : current.adjacentNodes)
					n.inDegree++;
			}
		}
	}

	// Reads a file containing a graph and returns all of the possible
	// topological sorts as Strings in a HashSet
	public static HashSet<String> allTopologicalSorts(String filename) 
	throws FileNotFoundException
	{
		Scanner sc = new Scanner(new File(filename));
		int numVertices = sc.nextInt();
		ArrayList<Node> unusedNodes = new ArrayList<>();

		for (int i = 0; i < numVertices; i++)
			unusedNodes.add(new Node(i));

		// Fills each Nodes adjacenccy list with the Nodes its adjacent too
		for (int i = 0; i < numVertices; i++)
		{
			int numEdges = sc.nextInt();

			for (int j = 0; j < numEdges; j++)
			{
				int id = sc.nextInt() - 1;
				unusedNodes.get(i).adjacentNodes.add(unusedNodes.get(id));
				unusedNodes.get(id).inDegree++;
			}
		}

		HashSet<String> topoPaths = new HashSet<>();
		ArrayList<Node> path = new ArrayList<Node>();

		findTopoSorts(unusedNodes, topoPaths, path);

		return topoPaths;
	}

	public static double hoursSpent()
	{
		return 6.0;
	}

	public static double difficultyRating()
	{
		return 3.7;
	}
}