---
layout: documentation
title: Consumer Optimization
---

Consumer optimization takes in a budget line and indifferent curves to determine the consumer's optimal consumption bundle. KGJS offers several ways to combine these concepts to create graphs for consumer optimization. 

First, let's look at how to create a budget line. Here is a simple example of a budget line: 

<div width="500" height="450" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      xAxis: 
        title: "Good 1"
      yAxis: 
        title: "Good 2"
      objects: 
      - EconBudgetLine:
          p1: 1
          p2: 2
          m: 8
          label: {text: M, location: 0.9}

</div>

Here, `p1` indicates the price of good 1 and `p2` indicates the price of good 2. `m` is the endowment, or the amount of money that the agent has to spend on the two goods in total. The label is similar to other labels, but since the budget line is defined by a segment in the back-end code of KGJS, we define the 'location' of the label by its distance along the segment. Here, we use .9 to say that the label is 9/10ths of the way along the budget line from left-to-right. This is convenient when we drag budget lines, since the label will always be plaecd proportionally along the budget line rather than at a fixed x- or y-value.



Next, let's take a look at indifference curves. KGJS includes several built-in indifference curves that are used in introductory economics, including: 
* Cobb Douglas
* Perfect Complements
* Substitutes 
* Quasilinear
* Concave
* CES

Each of the above indifference curve types can take in possible parameters, as we will explore below. 

Let's begin with a simple Cobb Douglas indifference curve. Remember to use EconSchema when writing code with econ features so that the colors show up appropriately: 


<div width="500" height="450" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      xAxis: 
        title: "Good 1"
      yAxis: 
        title: "Good 2"
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

<div width="500" height="450" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      xAxis: 
        title: "Good 1"
      yAxis: 
        title: "Good 2"
      objects: 
      - EconIndifferenceCurve:
          utilityFunction:
            CobbDouglas: {coefficients: [1,2]}
          level: 10

</div>

Now, let's look at a substitutes indifference curve: 

<div width="500" height="450" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      xAxis: 
        title: "Good 1"
      yAxis: 
        title: "Good 2"
      objects: 
      - EconIndifferenceCurve:
          utilityFunction:
            Substitutes: {coefficients: [1,2]}
          level: 10

</div>

Here, we use `coefficients: [a,b]` in the context of the utility function $a*(x_1) + b*(x_2)$, as in the equation for substitutes. 

Now, here is a quasilinear function:

<div width="500" height="450" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      xAxis: 
        title: "Good 1"
      yAxis: 
        title: "Good 2"
      objects: 
      - EconIndifferenceCurve:
          utilityFunction:
            Quasilinear: {alpha: 0.3}
          level: 5

</div>

As a final example, let's look at a CES function. The CES function takes in coefficients and an additional parameter, `r`, as in the equation $((a*(x_1)^r b*(x_2)^r)^(1/r))$:

<div width="500" height="450" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      xAxis: 
        title: "Good 1"
      yAxis: 
        title: "Good 2"
      objects: 
      - EconIndifferenceCurve:
          utilityFunction:
            CES: {coefficients: [2,1], r: .5}
          level: 5

</div>

For each type of indifference curve, 'alpha' and 'coefficients' takes on a different mathematical meaning. These are described here: 
* Cobb Douglas:
    * `alpha: exponent in the equation $x_1^\alpha x_2^{1-\alpha}$`
    * `coefficients: exponents in the equation $x_1^a x_2^b$`
* Complements/Perfect Complements: 
    * `coefficients: NOT SURE BECAUSE I CAN'T GET IT WORKING`
* Substitutes: 
    * `alpha: the coefficient on $x_1$ in the equation $(\alpha)*x_1 + {1-/alpha}*x_2$`
    * `coefficients: the coefficients a and b of the equation $a*x_1 + b*x_2$`
* Quasilinear: 
    * `alpha: the coefficient on $x_1$ in the equation $(\alpha)*log(x_1) + x_2$ where $x_2$ always has a coefficient of 1.`
    * `coefficients: the coefficients a and b in the equation $a*log(x_1) + b*x_2$`
* Concave: 
    * `alpha: the coefficient in the equation $(/alpha)*(x_1)^2 + {1-\alpha}*(x_2)^2$`
    * `coefficients: the coefficients a and b in the equation $a*(x_1)^2 + b*(x_2)^2$`
* CES: 
    * `alpha: the coefficient in the equation $(\alpha)*((x_1)^r + {1 - \alpha}*(x_2)^r)^(1-r)$`
    * `coefficients: the coefficients a and b in the equation $a*((x_1)^r + b*(x_2)^r)^(1-r)$`
    * `r (required with alpha and coefficients): the power in the equation $(\alpha)*((x_1)^r + {1 - \alpha}*(x_2)^r)^(1-r)$ or $a*((x_1)^r + b*(x_2)^r)^(1-r)$`
    
One fun feature of indifference curves is the ability to make an indifference curve displaying indifference curves at different levels of utility on the graph. Let's take a look at a Cobb-Douglas example: 


<div width="500" height="450" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      xAxis: 
        title: "Good 1"
      yAxis: 
        title: "Good 2"
      objects: 
      - EconIndifferenceMap:
          utilityFunction:
            CobbDouglas: {alpha: .4}
          levels: [1,2,3,4,5]

</div>

Rather than specifying a single utility level, you can add as many utility levels as you like to the indifference map. By default, these lines will show up thin and light grey. 


