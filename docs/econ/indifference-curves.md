---
layout: documentation
title: Econ Indifference Curves
---

KGJS includes several built-in indifference curves that are used in introductory economics, including: 
* Cobb Douglas
* Perfect Complements
* Substitutes 
* Quasilinear
* Concave
* CES

Each of the above indifference curve types can take in possible parameters, as we will explore below. 

Let's begin with a simple Cobb Douglas indifference curve. Remember to use EconSchema when writing code with econ features so that the colors show up appropriately: 


<div width="500" height="425" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      objects: 
      - EconIndifferenceCurve:
          utilityFunction:
            CobbDouglas: {alpha: 0.3}
          level: 5
      


</div>

Note the following features of this indifference curve: 
* The curve is automatically labeled 'U' at its right tail to indicate that it is an indifference curve. 
* The `alpha` value of the Cobb Douglas curve indicates the alpha value for the equation $x_1^\alpha x_2^{1-\alpha}$.
* The `level` indicates the level of utility that the curve represents–in this case, the curve represents all points where the agent receives a utility of 5. 

We can also write Cobb Douglas using coefficients, indicating the `a` and `b` values in the expression `((x_1)^a)*((x_2)^b)`.

<div width="500" height="425" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      objects: 
      - EconIndifferenceCurve:
          utilityFunction:
            CobbDouglas: {coefficients: [1,2]}
          level: 10

</div>

Now, let's look at a substitutes indifference curve: 

<div width="500" height="425" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      objects: 
      - EconIndifferenceCurve:
          utilityFunction:
            Substitutes: {coefficients: [1,2]}
          level: 10

</div>

Here, we use `coefficients: [a,b]` in the context of the utility function $a*(x_1) + b*(x_2)$, as in the equation for substitutes. 

Now, here is a quasilinear function:

<div width="500" height="425" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      objects: 
      - EconIndifferenceCurve:
          utilityFunction:
            Quasilinear: {alpha: 0.3}
          level: 5

</div>