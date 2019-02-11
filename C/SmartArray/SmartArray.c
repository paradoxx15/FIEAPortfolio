//Gaelen Dignan
//NID: ga634357

#include "SmartArray.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

//Creates smart array that is dynamically allocated and has all its values initialized
SmartArray *createSmartArray(int length)
{
	SmartArray *smarty;
	int i;

	smarty = malloc(sizeof(SmartArray));

	if(smarty == NULL)
	{
		return NULL;
	}

	smarty->capacity = length > DEFAULT_INIT_LEN ? length : DEFAULT_INIT_LEN;
	smarty->size = 0;
	smarty->array = malloc(sizeof(char *) * smarty->capacity);
	
	if(smarty->array == NULL)
	{
		free(smarty);
		return NULL;
	}

	for(i = 0; i < smarty->capacity; i++)
	{
		smarty->array[i] = NULL;
	}

	printf("-> Created new SmartArray of size %d.\n", smarty->capacity);
	return smarty;
}

//Frees the memory of a SmartArray 
SmartArray *destroySmartArray(SmartArray *smarty)
{
	int i;
	
	if(smarty == NULL)
		return NULL;
	for(i = 0; i < smarty->size; i++)
		free(smarty->array[i]);
	free(smarty->array);
	free(smarty);
	return smarty = NULL;
}

//Expands a smart array that has reached its capacity
SmartArray *expandSmartArray(SmartArray *smarty, int length)
{
	char **newArray;
	int i;

	if(smarty == NULL || length <= smarty->capacity)
	{
		return smarty;
	}

	newArray = malloc(sizeof(char *) * length);
	if(newArray == NULL)
	{
		return NULL;
	}

	//copies over the elements of the old array
	for(i = 0; i < length; i++)
	{
		if(i < smarty->size)
			newArray[i] = smarty->array[i];
		else
			newArray[i] = NULL;
	}

	free(smarty->array);
	smarty->array = newArray;
	smarty->capacity = length;

	printf("-> Expanded SmartArray to size %d.\n", length);

	return smarty;
}

//Trims the SmartArrays capacity if the size is smaller than the capacity
SmartArray *trimSmartArray(SmartArray *smarty)
{
	char **newArray;
	int i;

	if(smarty == NULL)
		return NULL;

	if(smarty->size < smarty->capacity)
	{
		smarty->capacity = smarty->size;

		newArray = malloc(sizeof(char *) * smarty->capacity);
		if(newArray == NULL)
		{
			return NULL;
		}

		//copies over the elements of the old array
		for(i = 0; i < smarty->capacity; i++)
			newArray[i] = smarty->array[i];

		free(smarty->array);
		smarty->array = newArray;

		printf("-> Trimmed SmartArray to size %d.\n", smarty->capacity);
		return smarty;
	}
}

//Puts a new element at the first open index. 
//If array is full it calls expandSmartArray()
char *put(SmartArray *smarty, char *str)
{
	int i;

	if(str == NULL || smarty == NULL)
		return NULL;

	while(1)
	{

		for(i = 0; i < smarty->capacity; i++)
		{
			if(smarty->array[i] == NULL)
			{
				smarty->array[i] = malloc(sizeof(char) * (strlen(str) + 1) );
				if(smarty->array[i] == NULL)
				{
					return NULL;
				}
				strcpy(smarty->array[i], str);
				smarty->size++;
				return smarty->array[i];
			}
		}
		expandSmartArray(smarty, (smarty->capacity * 2 + 1));
	}
	return NULL;
}

//Gets the value of the element in the smarty->array at index
char *get(SmartArray *smarty, int index)
{
	if(smarty == NULL || index >= smarty->capacity || index < 0)
		return NULL;
	else
	{
		return smarty->array[index];
	}
}

//Sets a specific index of the SmartArray to a value
char *set(SmartArray *smarty, int index, char *str)
{
	if(smarty == NULL || index >= smarty->capacity || str == NULL || index < 0 )
		return NULL;

	if(smarty->array[index] != NULL)
	{
		free(smarty->array[index]);
		smarty->array[index] = malloc(sizeof(char) * (strlen(str) + 1));
		strcpy(smarty->array[index], str);
		return smarty->array[index];
	}
	else
		return NULL;

}

//Inserts a new element at a specific index
//Moves all other elements to the right
char *insertElement (SmartArray *smarty, int index, char *str)
{
	int i;

	if(smarty == NULL || index < 0 || str == NULL || index >= smarty->capacity)
		return NULL;

	if(smarty->size == smarty-> capacity)
		expandSmartArray(smarty, (smarty->capacity * 2 + 1));

	if(index >= smarty->size)
	{
		smarty->array[index] = malloc(sizeof(char) * (strlen(str)+1));
		if(smarty->array[i] == NULL)
		{
			return NULL;
		}
		strcpy(smarty->array[smarty->size], str);
		return smarty->array[smarty->size];
	}

	else
	{
		for(i = smarty->size; i > index; i--)
			smarty->array[i] = smarty->array[i-1];
		smarty->array[index] = malloc(sizeof(char) * (strlen(str) + 1));
		if(smarty->array[i] == NULL)
		{
			return NULL;
		}

		strcpy(smarty->array[index], str);
		smarty->size++;
		return smarty->array[index];
	}
}

//Removes an element of the array at a specific index 
int removeElement(SmartArray *smarty, int index)
{
	int i;

	if(smarty == NULL || index < 0)
		return 0;

	if(index > smarty->size -1)
		return 0;

	free(smarty->array[index]);

	for(i = index; i < smarty->size; i++)
	{
		if(i == smarty->size -1)
		{
			smarty->array[i] = NULL;
		}
		else 
			smarty->array[i] = smarty->array[i+1];

	}

	smarty->size--;
	return 1;
}

//Returns the size of the array without giving access to the actual variable
int getSize(SmartArray *smarty)
{
	if(smarty == NULL)
		return -1;

	return smarty->size;
}

//Prints every element of the array
void printSmartArray(SmartArray *smarty)
{
	int i;

	if(smarty == NULL  || smarty->array[0] == NULL)
	{
		printf("(empty array)\n");
		return;
	}
	for(i = 0; i < smarty->size; i++)
	{
		printf("%s\n", smarty->array[i]);
	}
}

double difficultyRating(void)
{
	return 3.0;
}

double hoursSpent(void)
{
	return 7.5;
}
