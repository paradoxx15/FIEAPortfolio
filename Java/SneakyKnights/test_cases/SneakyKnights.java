//Gaelen Dignan
//ga634357

import java.util.*;
import java.util.regex.*;
import java.io.*;
import java.lang.StringBuilder;

public class SneakyKnights
{

	//Converts the column from a string of letters to its integer representation
	public static int convertColToNum(String col)
	{
		int retval = 0;
		int power = 0;

		for(int i = col.length() - 1; i >= 0; i--)
		{
			retval += (col.charAt(i) - 'a' + 1) * Math.pow(26, power);
			power++;
		}

		return retval;
	}

	//Converts the column from an integer to a String
	public static String convertNumToCol(int col)
	{
		StringBuilder retval = new StringBuilder();
		int remainder, quotient = col;
		char c;

		//Uses modified euclidean algorithm to convert the number in base 26
		while(quotient != 0)
		{
			remainder = quotient % 26;
			quotient = quotient / 26;

			//Modifies the algorithm because z is 0, so the quotient must be
			//subtracted by 1
			if(remainder == 0)
			{
				retval.append('z');
				quotient--;
				continue;
			}

			c = (char)(remainder - 1 + 'a');
			retval.append(c);		
		}

		retval.reverse();
		return retval.substring(0);
	}

	//Finds all 8 moves a knight can make
	public static StringBuilder[] findMoves(int col, int row, int boardsize)
	{	
		StringBuilder [] moves = new StringBuilder[8];
		int x = 2;
		int y = 1;

		for (int i = 0; i < 8; i++)
			moves[i] = new StringBuilder();

		for (int i = 0; i < 8; i++)
		{
			//Finds the move right 2 up 1, and right 1 up 1
			if (i < 2)
			{
				if ((boardsize - col >= x) && (boardsize - row >= y))
				{
					moves[i].append(convertNumToCol(col + x));
					moves[i].append(row + y);
				}
			}

			//Finds the move right 2 down 1, and right 1 down 2
			else if (i < 4)
			{
				if ((boardsize - col >= x) && (row - y >= 1))
				{
					moves[i].append(convertNumToCol(col + x));
					moves[i].append(row - y);
				}
			}

			//Finds the move left 2 and up 1, and left 1 up 2
			else if (i < 6)
			{
				if ((col - x >= 1) && (boardsize - row >= y))
				{
					
					moves[i].append(convertNumToCol(col - x));
					moves[i].append(row + y);
				}
			}

			//Finds the move left 2 down 1, and left 1 down 2
			else if (i < 8)
			{
				if ((col - x >= 1) && (row - y >= 1))
				{
					moves[i].append(convertNumToCol(col - x));
					moves[i].append(row - y);
				}
			}

			int temp = x;
			x = y;
			y = temp;
		}

		return moves; 
	}

	//Checks if all the Knights in coordinateStrings are safe on a board of 
	//size boardsize
	public static boolean 
	allTheKnightsAreSafe(ArrayList<String> coordinateStrings, int boardsize)
	{
		HashSet<String> knights = new HashSet<String>();
		Pattern p = Pattern.compile("[A-Za-z]+|[0-9]+");
		Matcher m;
		int row, col;
		StringBuilder[] moves = new StringBuilder[8];

		//Hashs all the Knights to a HashSet
		for (String s: coordinateStrings)
			knights.add(s);

		//Checks if any of the 8 moves each knight can make are contained within
		//the HashSet knights
		for (String coordinate: coordinateStrings)
		{
			m = p.matcher(coordinate);
			m.find();
			col = convertColToNum(m.group());
			m.find();
			row = Integer.parseInt(m.group());

			moves = findMoves(col, row, boardsize);
			

			for(int i = 0; i < 8; i++)
				if (moves[i].length() != 0)
					if(knights.contains(moves[i].substring(0)))
						return false;	
		}

		return true;
	}

	//Returns the difficulty rating of the program
	public static double difficultyRating()
	{
		return 4.0;
	}

	//Returns the hours spent on the program
	public static double hoursSpent()
	{
		return 7.0;
	}

}