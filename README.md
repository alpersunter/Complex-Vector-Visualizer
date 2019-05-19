# Complex-Vector-Visualizer
Visualize complex vectors like you never did!

I was reading *A First Course in Wavelets with Fourier Analysis* by Boggess & Narcowich. In chapter zero, they define dot (inner) product of vectors with complex components. I know complex numbers and their properties. I always think of them as arrows in complex plane. In chapter 0 they wrote some properties that those vectors satisfy.  All of those properties were clear if I were to apply formulas and do maths. But unless I do some substitution, I couldn't see them. I needed a visual intuition!

I wondered for few minutes and then an idea stroke me: What if, each component of a vector, was not represented by digits but rather by arrows. Imagine your plain old 3D vector:
![3D Vector](https://latex.codecogs.com/gif.latex?%5CLARGE%20%5Cbegin%7Bpmatrix%7D%20x%5C%5C%20y%5C%5C%20z%5C%5C%20%5Cend%7Bpmatrix%7D) 
Now, imagine, how would that look like if each of x, y and z were changed to arrows?
![Arrows](data:image/png;base64,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)
This thought inspired me at that moment to make this complex vector visualizer.

Here you can modify vectors and take their dot products. 
Dot product means "similarity" between two vectors, so try to see how complex vectors look like each other by changing parameters.
I hope this toy gives both you and me a new and funny way to visualize and interiorize entities called "complex vectors".
