// Gaelen Dignan
// ga634357

import java.io.*;
import java.util.*;

public class RunLikeHell
{
	// Traverses the array of blocks finding the max gain of knowledge 
	public static int maxGain(int [] blocks)
	{
		int [] dp = new int [blocks.length];

		if (blocks.length == 0) return 0;
		if (blocks.length == 1)	return blocks[0];

		dp[0] = blocks[0];
		dp[1] = Math.max(blocks[1], blocks[0]);

		for (int i = 2; i < blocks.length; i++)
		{
			dp[i] = Math.max(
					dp[i - 2] + blocks[i],
					dp[i - 1]
				);
		}

		return dp[blocks.length - 1];
	}

	// Returns difficulty rating
	public static double difficultyRating()
	{
		return 2.0;
	}

	// Returns hours spent
	public static double hoursSpent()
	{
		return 1.0;
	}
}

