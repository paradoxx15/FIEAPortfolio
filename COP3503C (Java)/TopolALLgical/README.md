# TopolALLgical
### by Gaelen Dignan

In this assignment I was tasked with implementing a program that could determine all valid topological sorts for an abitrary graph using a backtracking approach. It was required to have a best-case runtime of no worse than O(n^2).

File Descriptions:
- TopolALLgical.java is my own coded solution to this assignment.
- TestCase.java are sample main functions that test my solution, Designed by Sean Szumlanski.
- TestCase-output.txt shows what the desired output is. Can use to check my solution is correct if need be.
- TestCase-input.txt are input files needed by the text cases.
- TestCase-solution.txt show the actual solution to the input, not just the desired output.
- TopolALLgical.pdf is the assignment document and contains additional information about the assignment.

Major Features:
- Reads a file containing a graph and returns all of the possible topological sorts as Strings in a HashSet
- Recursivley searches a tree to create each topological sort
- Uses adjacency lists for each node
- Converts paths to strings

How to run:
- javac TopolALLgical.java TestCaseX.java
    - Replace X with whichever test case you are trying to run
- java TestCaseX
- To run all test cases at once
    - ./test-all.sh