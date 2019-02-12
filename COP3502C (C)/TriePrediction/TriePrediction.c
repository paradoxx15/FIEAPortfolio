//Gaelen Dignan
//ga634357

#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "TriePrediction.h"

//Struct that contains a character array and its size
typedef struct smarty
{
	char array[1024];
	int size;
}SmartArray;

// Helper function called by printTrie()
void printTrieHelper(TrieNode *root, char *buffer, int k)
{
	int i;

	if (root == NULL)
		return;

	if (root->count > 0)
		printf("%s (%d)\n", buffer, root->count);

	buffer[k + 1] = '\0';

	for (i = 0; i < 26; i++)
	{
		buffer[k] = 'a' + i;

		printTrieHelper(root->children[i], buffer, k + 1);
	}

	buffer[k] = '\0';
}

//Prints out everything in a Trie
void printTrie(TrieNode *root, int useSubtrieFormatting)
{
	char buffer[1026];

	if (useSubtrieFormatting)
	{
		strcpy(buffer, "- ");
		printTrieHelper(root, buffer, 2);
	}
	else
	{
		strcpy(buffer, "");
		printTrieHelper(root, buffer, 0);
	}
}

//Callocs the memory for a TrieNode, setting all children to NULL
TrieNode *createTrieNode(void)
{
	TrieNode *newNode;
	int i;

	if((newNode = calloc(1, sizeof(TrieNode))) == NULL)
	{
		return NULL;
	}

	for(i = 0; i < 26; i++)
		newNode->children[i] = NULL;

	return newNode;
}

//Retruns the terminal node of the str if it exists in the try
TrieNode *getNode(TrieNode *root, char *str)
{
	int i, length, temp;

	if(root == NULL || str == NULL)
		return NULL;

	length = strlen(str);
	for(i = 0; i < length; i++)
	{
		temp = tolower(str[i]) - 'a';
		if(root->children[temp] != NULL)
			root = root->children[temp];
		else
			return NULL;
	}

	if(root->count > 0)
		return root;

	return NULL; 
}

//Inserts a string into a trie by inserting a character node by node,
//if the string didn't already exist
void insertString(TrieNode *root, char *str)
{
	int i, length, temp;

	length = strlen(str);
	for(i = 0; i < length; i++)
	{
		temp = tolower(str[i]) - 'a';

		if(root->children[temp] == NULL)
			root->children[temp] = createTrieNode();

		root = root->children[temp];

		if(i == length - 1)
			root->count++;
	}
}

//Callocs the memory for a SmartArray
SmartArray *createSmarty()
{
	SmartArray *newArray;

	if((newArray = calloc(1, sizeof(SmartArray))) == NULL)
		return NULL;

	return newArray;
}

//Finds the most frequent word recursively using 
//a SmartArray buffer and char array max
void mostFrequentWordHelper(TrieNode *root, char *max, SmartArray *buffer, 
							int *count_max)
{
	int i;

	if(root == NULL)
		return;

	//Checks all children of a node
	for(i = 0; i < 26; i++)
	{
		//If child exists, copies data over to buffer
		if(root->children[i] != NULL)
		{
			buffer->array[buffer->size++] = i + 'a';
			buffer->array[buffer->size] = '\0';

			//Copies over buffers array if the childs max
			// is greater than count_max
			if(root->children[i]->count > *count_max)
			{
				*count_max = root->children[i]->count;
				strcpy(max, buffer->array);
			}

			mostFrequentWordHelper(root->children[i], max, buffer, count_max);
		}
	}

	if (buffer->size > 0)
	{
		buffer->array[buffer->size - 1] = '\0';
		buffer->size--;
	} 
}

//Copies the most frequent word in the try into the string str
void mostFrequentWord(TrieNode *root, char *str)
{
	SmartArray *buffer; 
	char max[1024];
	int i, *count_max;

	if(root == NULL)
	{
		strcpy(str, "");
	}
	else
	{
		buffer = createSmarty();
		if ((count_max = calloc(1, sizeof(int))) == NULL)
			return;

		*count_max = 0;

		mostFrequentWordHelper(root, max, buffer, count_max);
		strcpy(str, max);
	}

	free(count_max);
	free(buffer);
}

//Strips any puncuators within the string str
void stripPuncuators(char *str)
{
	int i, j = 0, length;
	char *temp;

	length = strlen(str);
	temp = calloc(length + 1, sizeof(char));
	for(i = 0; i < length; i++)
	{
		if(str[i] == ' ' || isalpha(str[i]))
		{
			temp[j] = str[i];
			j++;
		}
	}

	strcpy(str, temp);
	free(temp);
}

//Builds a Trie, including subtries from a the file filename
TrieNode *buildTrie(char *filename)
{
	char buffer[30720], previous[1024], *str;
	FILE *file;
	TrieNode *root, *word;
	int length;

	file = fopen(filename, "r");
	if(file == NULL)
		return NULL;

	root = createTrieNode();
	previous[0] = '\0';

	//Reads each line of the file
	while(fgets(buffer, 30720, file) != NULL )
	{
		str = strtok(buffer, " ");

		//Puts each word into a try and into the previous words subtrie
		while(str != NULL)
		{
			stripPuncuators(str);
			insertString(root, str);

			if(previous[0] != '\0')
			{
				word = getNode(root, previous);
			
				if (word->subtrie == NULL)
					word->subtrie = createTrieNode();

				insertString(word->subtrie, str);
			}

			strcpy(previous, str);
			str = strtok(NULL, " ");
		}

		previous[0] = '\0';
	}

	fclose(file);
	return root;
}

//Frees all data associated with a Trie
TrieNode *destroyTrie(TrieNode *root)
{
	int i;

	if (root == NULL)
		return NULL;

	for (i = 0; i < 26; i++)
	{
		if(root->children[i] != NULL)
		{
			destroyTrie(root->children[i]->subtrie);
			destroyTrie(root->children[i]);
		}		
	}

	free(root);
	return NULL;
}


//Passed the corpus and input and follows the camands of the input
int main(int argc, char **argv)
{
	char *corpus, *input_name, buffer[1030];
	TrieNode *root, *word;
	FILE *input;
	int count, i;

	corpus = argv[1];
	input_name = argv[2];

	root = buildTrie(corpus);

	input = fopen(input_name, "r");
	if(input == NULL)
	{
		printf("Couldn't read input file\n");
		return 0;
	}

	//Reads the input line by line
	while (fscanf(input, "%s", buffer) != EOF)
	{
		//Prints the trie without subtries
		if (strcmp(buffer, "!") == 0)
		{
			printTrie(root, 0);
		}
		//Prints the string and n of the most frequent words that follow it
		else if (strcmp(buffer, "@") == 0)
		{
			fscanf(input, "%s", buffer);
			fscanf(input, "%d", &count);

			stripPuncuators(buffer);

			printf("%s", buffer);
			for(i = 0; i < count; i++)
			{
				word = getNode(root, buffer);
				if(word == NULL || word->subtrie == NULL)
					continue;

				mostFrequentWord(word->subtrie, buffer);
				printf(" %s", buffer);
			}
			printf("\n");
		}
		//Prints the string if its in the try
		else
		{
			printf("%s\n", buffer);

			word = getNode(root, buffer);
			if(word == NULL)
			{
				printf("(INVALID STRING)\n");
				continue;
			}

			if(word->subtrie != NULL)
				printTrie(word->subtrie, 1);
			else
				printf("(EMPTY)\n");
		}
	}

	fclose(input);
	destroyTrie(root);
	return 0;
}

//Returns the difficultyRating
double difficultyRating(void)
{
	return 3;
}

//Returns the hoursSpent
double hoursSpent(void)
{
	return 7;
}