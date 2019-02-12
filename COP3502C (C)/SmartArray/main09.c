// Sean Szumlanski
// COP 3502, Summer 2016
// Assignment #1, Test Case #9

// This test case was created by one of my former students, Bucky Zahid. :-)


#include <stdio.h>
#include "SmartArray.h"

int main(void)
{
    int i;

    char* dwarves[] = {
        "Bifur", "Bofur", "Bombur",
        "Kili", "Fili", "Oin", "Gloin",
        "Ori", "Nori", "Dori", "Dwalin",
        "Balin", "Thorin"
    };

    SmartArray* S1 = createSmartArray(11);
    SmartArray* S2 = createSmartArray(-1);

    removeElement(S1, 0);
    removeElement(S2, 22);

    S2 = destroySmartArray(S2);
    S2 = destroySmartArray(S2);
    S2 = createSmartArray(5);

    removeElement(S2, 0);

    printf("Size of S2: %d\n", getSize(S2));

    S2 = destroySmartArray(S2);

    put(S2, "Gandalf");

    printf("-- SmartArray 2 -- \n");
    printSmartArray(S2);

    set(S1, 0, "Gandalf");

    printf("-- SmartArray 1 -- \n");
    printSmartArray(S1);

    for(i = 0; i < 10; i++)
        put(S1, dwarves[i]);

    insertElement(S1, 10, dwarves[11]);
    insertElement(S1, 13, dwarves[10]);
    insertElement(S1, 5, NULL);
    insertElement(S1, -5, "Derp");

    put(S1, dwarves[12]);
    put(S1, NULL);

    set(S1, 0, "Bilbo");
    set(S1, -5, "Derpy-Derp");

    insertElement(S1, 1, *dwarves);
    printf("%d\n", S1->capacity );
    insertElement(S1, 23, "and Gandalf");
    removeElement(S1, -5);



    printf("-- SmartArray 1 -- \n");
    printSmartArray(S1);

    return 0;
}
