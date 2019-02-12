// Sean Szumlanski
// COP 3503, Fall 2016

// ================================
// GenericBST: GenericsWarning.java
// ================================
// This little beast will help you determine whether your compiler/IDE is
// properly generating Xlint warnings for you. If you can compile this without
// receiving any warnings from your compiler/IDE, we need to get you into an
// environment where you're getting Xlint warnings about unchecked or unsafe
// operations. That way, you'll know for sure whether your GenericBST.java is
// generating Xlint warnings before you submit this assignment. (You do NOT want
// your GenericBST.java to generate any warnings.)


import java.util.*;

public class GenericsWarning<QQ> {
	LinkedList L;

	GenericsWarning() {
		L = new LinkedList();
		L.add(null);
	}
}
