# Skip List
### by Gaelen Dignan

In this assignment I was tasked with implementing a probabilistic skip list. Shows my ability to work with a probabilistic data structure with complex insertion and deletion algorithms

File Descriptions:
- SkipList.java is my own coded solution to this assignment.
- TestCase.java are sample main functions that test my solution, Designed by Sean Szumlanski.
- TestCase-output.txt shows what the desired output is. Can use to check my solution is correct if need be.
- SkipList.pdf is the assignment document and contains additional information about the assignment.

Major Features:
- Fully implimented Node class used by the SkipList
- Trimming, growing, insertion, deletion, and contains methods
    - Insertion uses a TraverseInsertion which keeps track of pointer values so that the chain is not broken when a new Node is inserted
- Generates random hights for nodes and can return max height.

How to run:
- javac SkipList.java TestCaseX.java
    - Replace X with whichever test case you are trying to run
- java TestCaseX
- To run all test cases at once
    - ./test-all.sh