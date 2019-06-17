# Complex Vector Visualizer
Live at: <a href="https://alpersunter.github.io/Complex-Vector-Visualizer/free/">HERE</a>

_Currently, I am still working on code._ 
 - Move mouse over a component to edit [DONE]
 - Scroll mouse wheel to change scale [DONE]
 - How to calculate? [DONE]
 
 - Consider note below:

 <img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;\langle&space;V,&space;W&space;\rangle" title="\langle V, W \rangle" /> should not be interpreted as "How much is W similar to V". It should be reverse. Also for the individual similarity <img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;v\cdot\overline{w}" title="v\cdot\overline{w}" />, it is not "How much is w similar to v" but rather "How much is v similar to w" because the angle of w is subtracted from the argument angle of v. If it was <img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;a\cdot\overline{w}" title="a\cdot\overline{w}" /> or <img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;b\cdot\overline{w}" title="b\cdot\overline{w}" /> or <img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;c\cdot\overline{w}" title="c\cdot\overline{w}" /> or etc. each of these operations would subtract the argument angle of w from a, b and c. Which means all of the operations are done *with respect to* w and is the one who all of the v, a, b and c take as a reference. This is why <img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;v\cdot\overline{w}" title="v\cdot\overline{w}" /> means "How much is v similar to w" and as a direct result, <img src="https://latex.codecogs.com/gif.latex?\inline&space;\dpi{150}&space;\langle&space;V,&space;W&space;\rangle" title="\langle V, W \rangle" /> means "How much is vector V similar to vector W".

 

## Visualize complex vectors like you never did!

I was reading *A First Course in Wavelets with Fourier Analysis* by Boggess & Narcowich. In chapter zero, they define dot (inner) product of vectors with complex components. I know complex numbers and their properties. I always think of them as arrows in complex plane. There, they wrote some properties that dot product of those vectors satisfy.  All of those properties were clear if I were to apply formulas and do maths. But unless I do some substitution, I couldn't see them. I needed a visual intuition!

I always looked at the _dot product_ (also 2D kernel convolutions and function correlations) as **similarity queries** between two given information. So, naturally, I asked "When everything was real, result of the dot product was _a number_ and its _positivity_ was giving me how similar were operand data. If components are not just numbers but _arrows_(I always thought complex numbers as arrows, never as a + bi), how would that similarity query result? Moreover, what does that mean for similarity of two vectors to be something _complex_ or -as beloved James Grime says- _compound_?"

I pondered for few minutes and then an idea stroke me: What if, each component of a vector, was not represented by digits but rather by arrows. Imagine your plain old 3D vector:

![3D Vector](https://latex.codecogs.com/gif.latex?%5CLARGE%20%5Cbegin%7Bpmatrix%7D%20x%5C%5C%20y%5C%5C%20z%5C%5C%20%5Cend%7Bpmatrix%7D) 

Now, imagine, how would that look like if each of x, y and z were changed to arrows?

![](https://i.ibb.co/6r9K3kY/dd.png)
This thought inspired me at that moment to make this complex vector visualizer.

Here you can modify vectors and take their dot products. 
Dot product means "similarity" between two vectors, so try to see **how** complex vectors look like each other by changing parameters. For example, dot product in complex vectors results in another complex number; what does the angle of that resulting number has to do with _similarity of vectors_? How everything affects every other thing??? What is the meaning of numbers??? (Okay, this was me exaggerating)


I hope this toy gives both you and me a new and funny way to visualize and interiorize entities called "complex vectors". 
# Have fun!
