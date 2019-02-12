//Gaelen Dignan
//ga634357

import java.util.*;
import java.util.regex.*;
import java.io.*;

public class SneakyQueens
{
	//Converts the column from a string of letters to its integer representation
	public static int convertCol(String col)
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
	
	//Checks if every queen from the coordinateStrings is safe on a chess board of size boardSize
	public static boolean allTheQueensAreSafe(ArrayList<String> coordinateStrings, int boardSize)
	{
		int col, row, diagModifier = boardSize - 2, numDiagonals = 4 * boardSize - 6;

		//int[0] is columns, int[1] is rows
		int[][] colRow = new int[2][boardSize];

		//int[0] is positive slope diagonals, int[1] is negative slope diagonals
		int[][] diag = new int[2][numDiagonals / 2];

		//This pattern splits up the coordinates between their letters and numbers
		Pattern p = Pattern.compile("[A-Za-z]+|[0-9]+");
		Matcher m;

		//Accesses every coordinate in the array and put its row, column, and diagonals
		//into their respective array
		for(String coordinate : coordinateStrings)
		{
			m = p.matcher(coordinate);
			m.find();
			col = convertCol(m.group());
			m.find();
			row = Integer.parseInt(m.group());

			if(++colRow[1][row - 1] > 1 || ++colRow[0][col - 1] > 1)
				return false;

			//The queen is in the top left or bottom right square
			if((col == 1 && row == boardSize) || (col == boardSize && row == 1))
			{
				//-3 because the first diagonal always starts at 3
				if(++diag[1][row + col - 3] > 1)
					return false;
			}

			//The queen is in the bottom left or top right square
			else if((col == 1 && row == 1) || (col == boardSize && row == boardSize))
			{
				if(++diag[0][col - row + diagModifier] > 1)
					return false;
			}

			//Finds both diagonals the queen is in
			else
			{
				if(++diag[0][col - row + diagModifier] > 1 || ++diag[1][row + col - 3] > 1)
					return false;
			}
		}

		return true;
	}

	//Returns difficulty rating of program
	public static double difficultyRating()
	{
		return 3.0;
	}

	//Return hours spent
	public static double hoursSpent()
	{
		return 3.5;
	}
}