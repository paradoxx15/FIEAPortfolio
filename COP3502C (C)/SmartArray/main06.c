// Sean Szumlanski
// COP 3502, Summer 2016
// Assignment #1, Test Case #6


#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "SmartArray.h"

void printErr(char *s)
{
	printf("%s\n", s);
	fflush(stdout);
}

void nullAssert(void *ptr, char *s)
{
	if (ptr != NULL)
		printf("ERROR: %s failed to return NULL as required.\n", s);

	// Uncomment the following line for output that shows how far you get before
	// segfaulting.
	//else { printf("Passed test case: %s\n", s); fflush(stdout); }
}

void zeroAssert(int i, char *s)
{
	if (i != 0)
		printf("ERROR: %s failed to return NULL as required.\n", s);

	// Uncomment the following line for output that shows how far you get before
	// segfaulting.
	//else { printf("Passed test case: %s\n", s); fflush(stdout); }
}

int main(void)
{
	int i; char *str = NULL;

	SmartArray *mySmarty = createSmartArray(0);
	SmartArray *smarty = NULL;

	// Manually set up SmartArray so this won't fail simply because the student's
	// createSmartArray() function doesn't work.
	mySmarty->array[0] = malloc(sizeof(char) + (strlen("word1") + 1));
	strcpy(mySmarty->array[0], "word1");

	mySmarty->array[1] = malloc(sizeof(char) + (strlen("word2") + 1));
	strcpy(mySmarty->array[1], "word2");

	mySmarty->size = 2;

	// Begin testing. Each of these function calls should return NULL.

	smarty = destroySmartArray(NULL);
	nullAssert(smarty, "destroySmartArray()");
	printErr("destroy 1");

	smarty = expandSmartArray(NULL, 20);
	nullAssert(smarty, "expandSmartArray()");
	printErr("expand 1");

	smarty = trimSmartArray(NULL);
	nullAssert(smarty, "trimSmartArray()");
	printErr("trim 1");

	str = put(NULL, "word");
	nullAssert(str, "put() -- 1");

	str = put(mySmarty, NULL);
	nullAssert(str, "put() -- 2");

	str = get(NULL, 0);
	nullAssert(str, "get() -- 1");

	str = get(NULL, 1);
	nullAssert(str, "get() -- 2");

	str = get(NULL, -1);
	nullAssert(str, "get() -- 3");

	str = get(mySmarty, 2);
	nullAssert(str, "get() -- 4");
	printErr("get 4");

	str = get(mySmarty, 3);
	nullAssert(str, "get() -- 5");

	str = get(mySmarty, -1);
	nullAssert(str, "get() -- 6");

	str = set(NULL, 0, "word");
	nullAssert(str, "set() -- 1");

	str = set(NULL, 1, "word");
	nullAssert(str, "set() -- 2");

	str = set(NULL, -1, "word");
	nullAssert(str, "set() -- 3");

	str = set(mySmarty, 2, "word");
	nullAssert(str, "set() -- 4");

	str = set(mySmarty, 3, "word");
	nullAssert(str, "set() -- 5");

	str = set(mySmarty, -1, "word");
	nullAssert(str, "set() -- 6");

	str = set(mySmarty, 0, NULL);
	nullAssert(str, "set() -- 7");

	str = set(mySmarty, 1, NULL);
	nullAssert(str, "set() -- 8");

	str = set(mySmarty, 2, NULL);
	nullAssert(str, "set() -- 9");

	str = set(mySmarty, -1, NULL);
	nullAssert(str, "set() -- 10");

	str = insertElement(NULL, 0, "word");
	nullAssert(str, "insertElement() -- 1");

	str = insertElement(NULL, 1, "word");
	nullAssert(str, "insertElement() -- 2");

	str = insertElement(NULL, -1, "word");
	nullAssert(str, "insertElement() -- 3");

	// Decided not to use in grading.
	// str = insertElement(mySmarty, -1, "word");
	// nullAssert(str, "insertElement() -- 4");

	str = insertElement(mySmarty, 0, NULL);
	nullAssert(str, "insertElement() -- 5");

	str = insertElement(mySmarty, 1, NULL);
	nullAssert(str, "insertElement() -- 6");

	str = insertElement(mySmarty, 2, NULL);
	nullAssert(str, "insertElement() -- 7");

	str = insertElement(mySmarty, -1, NULL);
	nullAssert(str, "insertElement() -- 8");

	i = removeElement(NULL, 0);
	zeroAssert(i, "removeElement() -- 1");

	i = removeElement(NULL, 1);
	nullAssert(str, "removeElement() -- 2");

	i = removeElement(NULL, -1);
	nullAssert(str, "removeElement() -- 3");

	// Decided not to use in grading.
	// i = removeElement(mySmarty, -1);
	// nullAssert(str, "removeElement() -- 4");

	i = removeElement(mySmarty, 2);
	nullAssert(str, "removeElement() -- 5");

	i = removeElement(mySmarty, 3);
	nullAssert(str, "removeElement() -- 6");

	printf("\n");

	i = getSize(mySmarty);
	printf("At end of execution, getSize(mySmarty) = %d.\n", getSize(mySmarty));

	i = getSize(mySmarty);
	printf("At end of execution, getSize(NULL) = %d.\n", getSize(NULL));

	printf("\nContents of mySmarty:\n");
	printSmartArray(mySmarty);

	printf("\nContents of NULL SmartArray:\n");
	printSmartArray(NULL);

	return 0;
}
