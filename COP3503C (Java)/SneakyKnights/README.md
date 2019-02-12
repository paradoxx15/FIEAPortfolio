# Sneaky Knights
### by Gaelen Dignan

In this assignment I was tasked with implementing a math algorithm that checks a chess board with knights in various positions and returns true if they are all safe, or false otherwise. What makes it difficult is that its worst-case runtime complexity and space complexity must be O(n). Additionally, the maximum board size is Integer.MAX_VALUE x Integer.MAX_VALUE.

File Descriptions:
- SneakyKnights.java is my own coded solution to this assignment.
- TestCase.java are sample main functions that test my solution, Designed by Sean Szumlanski.
- TestCase-output.txt shows what the desired output is. Can use to check my solution is correct if need be.
- TestCase-input.txt are input files needed by the text cases.
- SneakyKnights.pdf is the assignment document and contains additional information about the assignment.

Major Features:
- Utilization of HashSets
- Utilization of regular expressions and pattern matching
- Conversion of number to string using Euclidean algorithm to convert it to a base 26 number

How to run:
- javac SneakyKnights.java TestCaseX.java
    - Replace X with whichever test case you are trying to run
- java TestCaseX
- To run all test cases at once
    - ./run-all-test-cases.sh