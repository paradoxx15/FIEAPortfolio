import java.io.*;
import java.util.*;

public class Person implements Comparable<Person> {

	private String firstName, lastName;
	private int birthYear, birthMonth, birthDay;

	// We will order our Person objects by birthday. We want older persons to
	// come before younger persons in sorted order, so we do the following:
	//
	// Return a negative integer if 'this' was born before 'rhs.' Return a
	// positive integer if 'this' was born after 'rhs'. Return zero if they
	// both share the same birthday.
	public int compareTo(Person rhs) {
		if (this.birthYear != rhs.birthYear)
			return this.birthYear - rhs.birthYear;
		else if (this.birthMonth != rhs.birthMonth)
			return this.birthMonth - rhs.birthMonth;
		return this.birthDay - rhs.birthDay;
	}

	Person(String name, String birthday) {

		// The last word in the 'name' string will be the last name. Everything
		// else will be the first name. For example:
		//
		// "Sean Szumlanski" => firstName = Sean
		//                      lastName  = Szumlanski
		//
		// "Regulus Arcturus Black" => firstName = Regulus Arcturus
		//                             lastName  = Black

		int splitPoint = name.lastIndexOf(' ');

		this.firstName = name.substring(0, splitPoint);
		this.lastName = name.substring(splitPoint + 1);

		// The String class in Java has a handy split() method that splits one
		// long string up into an array of individual strings, using some token
		// as a delineator. Here, we split dates up by the slash (/) character.
		// For example:
		//
		// "01/30/1961".split("/") => { "01", "30", "1961" }

		String [] numbers = birthday.split("/");

		this.birthMonth = Integer.parseInt(numbers[0]);
		this.birthDay   = Integer.parseInt(numbers[1]);
		this.birthYear  = Integer.parseInt(numbers[2]);
	}

	// Returns, e.g.: "(01/30/1961) Black, Regulus Arcturus"
	public String toString() {

		return "(" + String.format("%02d", birthMonth) +
		        "/" + String.format("%02d", birthDay) +
		        "/" + String.format("%02d", birthYear) + ")" +
		        " " + lastName + ", " + firstName;
	}

	public static void main(String [] args) {

		// here's another fantastic Java container: an array that grows dynamically
		ArrayList<Person> list = new ArrayList<Person>();

		// add some Person objects to the ArrayList
		list.add(new Person("Cada St-Merrein", "04/22/1961"));
		list.add(new Person("Regulus Arcturus Black", "01/30/1961"));
		list.add(new Person("Perceval Thoreau", "08/08/1450"));
		list.add(new Person("Magdeleine Corriander Grabb", "05/19/1960"));

		// print the unsorted ArrayList
		System.out.println("Unsorted List");
		System.out.println("=============");
		for (Person p : list)
			System.out.println(p);

		// any of Java's collections can be sorted, provided that they implement
		// the Comparable interface
		Collections.sort(list);

		// print the sorted ArrayList
		System.out.println();
		System.out.println("Sorted List");
		System.out.println("===========");
		for (Person p : list)
			System.out.println(p);


		// The Collections.sort() method does not apply to arrays, because the
		// array is not a collection class. Instead, we use Arrays.sort(). Let's
		// see how that works...

		// first, shuffle the list so it's in some sort of random(ish) order again
		Collections.shuffle(list);

		// copy the list into an array
		Person [] array = new Person[4];
		for (int i = 0; i < list.size(); i++)
			array[i] = list.get(i);

		// print the unsorted array
		System.out.println("");
		System.out.println("Unsorted array");
		System.out.println("==============");
		for (Person p : array)
			System.out.println(p);

		// sort the array (which only works on Comparable objects)
		Arrays.sort(array);

		// print the sorted array
		System.out.println("");
		System.out.println("Sorted array");
		System.out.println("============");
		for (Person p : array)
			System.out.println(p);

	}
}