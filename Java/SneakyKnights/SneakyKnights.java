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

	public static String convertNumToCol(int col)
	{
		StringBuilder retval = new StringBuilder();
		int remainder, quotient = col;
		char c;

		while(quotient != 0)
		{
			remainder = quotient % 26;
			quotient = quotient / 26;

			System.out.println(quotient + " * (26) + " + remainder);
			if(remainder == 0)
			{
				retval.append('z');
				quotient--;
				continue;
			}

			c = (char)(remainder - 1 + 'a');
			System.out.println(c);
			retval.append(c);
		}

		retval.reverse();
		return retval.substring(0);
	}


	/*//Modify can only be the value 1, 2, -1, or -2
	public static String changeCol(int modify, String col)
	{
		char [] characters = col.toCharArray();
		StringBuilder sb = new StringBuilder(col);
		char c;
		boolean stop = false;
		int i = col.length() - 1, length = i;

		while(stop == false)
		{
			if (modify > 0)
			{
				c = sb.charAt(i);
				if (i == 0 && c == 'z')
				{
					sb.setCharAt(i, 'a');
					sb.append('a');
					break;
				}

				//Checks if modifying the last character will require modifying
				// previous characters
				if (((c - 'a' + ((i == length) ? modify : 1)) <= 25))
					stop = true;

				c = (char)((c - 'a' + ((i == length) ? modify : 1)) % 26 + 'a');
				sb.setCharAt(i, c);
				i--;
			}

			/*else if (modify < 0)
			{
				c = sb.charAt(i);
				if (i == 1 && c == 'a')
				{
					sb.setCharAt(i, 'a')
					sb.append('a');
					break;
				}

				//Checks if modifying the last character will require modifying
				// previous characters
				if (((c - 'a' + (i == length) ? modify : 1) <= 25)
					stop = true;

				c = (char)((c - 'a' + (i == length) ? modify : 1) % 26 + 'a');
				sb.setCharAt(i, c);
				i--;
			}
		}

		return sb.substring(0);
	}*/

	public static StringBuilder[] findMoves(int col, int row, int boardsize)
	{	
		StringBuilder [] moves = new StringBuilder[8];
		int x = 2;
		int y = 1;

		for (int i = 0; i < 8; i++)
			moves[i] = new StringBuilder();

		for (int i = 0; i < 2; i++)
		{
			if (i < 2)
			{
				if (boardsize - col >= x)
					moves[i].append(col + x);
				if (boardsize - row >= y)
					moves[i].append(row + y);
			}
			else if (i < 4)
			{
				if (boardsize - col >= x)
					moves[i].append(col + x);
				if (row - y >= 1)
					moves[i].append(row - y);
			}
			else if (i < 6)
			{
				if (col - x >= 1)
					moves[i].append(col - x);
				if (boardsize - row >= y)
					moves[i].append(row + y);
			}
			else if (i < 8)
			{
				if (col - x >= 1)
					moves[i].append(col - x);
				if (row - y >= 1)
					moves[i].append(row - y);
			}

			int temp = x;
			x = y;
			y = temp;
		}

		return moves; 
	}

	public static boolean 
	allTheKnightsAreSafe(ArrayList<String> coordinateStrings, int boardsize)
	{
		HashSet<String> knights = new HashSet<String>();
		Pattern p = Pattern.compile("[A-Za-z]+|[0-9]+");
		Matcher m;
		int row, col, x, y;
		StringBuilder[] moves = new StringBuilder[8];

		for (String s: coordinateStrings)
		{
			knights.add(s);
		}

		for (String coordinate: coordinateStrings)
		{
			m = p.matcher(coordinate);
			m.find();
			col = convertColToNum(m.group());
			m.find();
			row = Integer.parseInt(m.group());

			moves = findMoves(col, row, boardsize);

			for(int i = 0; i < 8; i++)
			{
				if (knights.contains(moves[i].substring(0)));
				{
					return false;
				}
			}

		}

		return true;
	}

	public static double difficultyRating()
	{
		return 0.0;
	}

	public static double hoursSpent()
	{
		return 0.0;
	}

}