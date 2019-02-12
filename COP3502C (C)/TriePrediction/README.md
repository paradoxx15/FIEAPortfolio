# Trie Prediciton
### by Gaelen Dignan

In this assignment I was tasked with implementing a trie that allows for efficient insertion and lookup, and then use it for text prediction. Helped fortify my knowledge of algorithms and data structures in C as pertaining to dynamic memory management, file I/O, processing command line arguments, dealing with pointers and structs, and more.

File Descriptions:
- TriePrediction.c is my own coded solution to this assignment.
- test_cases folder contains all of the test cases necessary to run TriePrediction.c
- TriePrediction.pdf is the assignment document and contains additional information about the assignment.

Major Features:
- Creation and Destruction of the trie. Creation of the trie is based on file input.
- Finding the most frequent word within a trie.
- Using a less smart version of SmartArray as a intermediate data structure.
- Stripping a string of punctuators.
- Inserting a string into a trie.

How to run:
- gcc TriePrediction.c
- ./a.out test_cases/corpusX.txt test_cases/inputX.txt
    - Replace X with whichever number case you would like to test, EX: 01.