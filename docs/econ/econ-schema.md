---
layout: documentation
title: Econ Schema
---

The Econ Schema is a color scheme that automatically assigns colors to econ objects like indifference curves, budget lines, etc. It is necessary to supply the Econ Schema to a graph when using econ objects, otherwise they will not appear properly. 

See that the Econ Schema automatically assigns the first budget line to be green. We can change this by simply specifying a different color, as we've done for the second budget line below: 

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
      - EconBudgetLine:
          p1: 2
          p2: 1
          m: 8
          color: blue
          label: {text: M, location: 0.9}

</div>

The following describes the automatic colors for different econ objects: 
* Consumer Theory
   * Utility Function: purple
   * Marginal Rate of Substitution (MRS): blue
   * Dispreferred set: red
   * Preferred set: purple
   * Offer Curve: blue
   * Income Offer Curve: orange
   * Demand Curve: blue
   * Budget Line: green
   * Costlier set: red
   * Endowment: grey
   * Income Effect: orange
   * Substitution Effect: red

* Producer Theory
   * Production Function: blue
   * Marginal Cost Curve: orange
   * Marginal Revenue Curve: olive
   * Supply Curve: orange
   * Short Run: red
   * Long Run: orange
   * Profit area: green
   * Loss area: red

* Equilibrium
   * Price: grey
   * Pareto Lens: "'#ffff99'",
   * Equilibrium Price: green

* Macro
   * Consumption: blue
   * Depreciation: red
   * Savings: green
   * Tax: red
   
As a reminder, the available colors for customization are, by default, blue, orange, green, red, purple, brown, magenta, grey or gray, and olive.