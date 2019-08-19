---
layout: documentation
title: Econ Linear Supply and Demnad
---

KGJS includes many economics-specific features, including linear supply, linear demand, and equilbrium. Let's take a look at how to generate a linear demand curve, which is similar to a line: 

<div width="500" height="425" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      objects:
      - EconLinearDemand:
            name: ourDemand
            xIntercept: 10
            invSlope: -1


</div>

Note that naming the `EconLinearDemand` curve is optional, but will be helpful later on when designating multiple equilibria. The demand curve here is defined by an x-intercept and an invSlope (the same as the slope, but different notation). Similarly, the linear supply curve should be defined instead using the y-intercept and slope: 

<div width="500" height="425" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      objects:
      - EconLinearSupply:
            name: ourSupply
            yIntercept: 1
            slope: 1


</div>

Let's combine the demand and supply curves into an equilibrium object: 

<div width="500" height="425" class="codePreview">
    
schema: EconSchema
layout:
  OneGraph:
    graph:
      objects:
      - EconLinearEquilibrium:
          demand: 
            name: ourDemand
            xIntercept: 10
            invSlope: -1
          supply: 
            name: ourSupply
            yIntercept: 1
            slope: 1
          equilibrium:
            droplines:
              vertical: Q_0
              horizontal: P_0


</div>

As you can see, the `EconLinearEquilibrium` object automatically calculates an equilibrium point when you add the attribute `equilibrium`. We can label the droplines however we wish; here, we've chosen label as Q0 and P0. 

Of course, we will often want to see what happens when we _shift_ supply or demand and how the new equilibrium is achieved. Let's see how to do this with a change in demand: 

<div width="500" height="425" class="codePreview">
    
schema: EconSchema
params: 
    - {name: demandShift, value: 0, min: -2, max: 2, round: 0.1}
    - {name: supplyShift, value: 0, min: -2, max: 2, round: 0.1}
layout:
  OneGraph:
    graph:
      objects:
      - EconLinearEquilibrium:
          name: ourEquilibrium
          demand: 
            name: ourDemand
            xIntercept: 8 + params.demandShift
            invSlope: -1
            drag: 
            - horizontal: demandShift
          supply: 
            name: ourSupply
            yIntercept: 1 - params.supplyShift
            slope: 1
            drag: 
              - horizontal: supplyShift
          equilibrium:
            droplines:
              vertical: "`Q_0 = ${calcs.ourEquilibrium.Q.toFixed(2)}`"
              horizontal: "`P_0 = ${calcs.ourEquilibrium.P.toFixed(2)}`"
          


</div>

Notice above that we _add_ the `params.demandShift` to the x-intercept of demand, but we _subtract_ the `params.supplyShift` from the y-intercept of supply. This is because as we drag the supply curve to the right, we actually want the y-intercept to _decrease_. 

We could also add a feature to show consumer and producer surplus on an equilibrium graph like this. By default, the color of the surplus will be the color of the curve it is associated with (blue for demand, orange for supply) but you can use the `fill` command to change this, as we do for producer surplus below: 

<div width="500" height="425" class="codePreview">
    
schema: EconSchema
params: 
    - {name: demandShift, value: 0, min: -2, max: 2, round: 0.1}
    - {name: supplyShift, value: 0, min: -2, max: 2, round: 0.1}
layout:
  OneGraph:
    graph:
      objects:
      - EconLinearEquilibrium:
          name: ourEquilibrium
          demand: 
            name: ourDemand
            xIntercept: 8 + params.demandShift
            invSlope: -1
            drag: 
            - horizontal: demandShift
            surplus: 
          supply: 
            name: ourSupply
            yIntercept: 0 - params.supplyShift
            slope: 1
            drag: 
              - horizontal: supplyShift
            surplus: 
              fill: red
          equilibrium:
            droplines:
              vertical: "`Q_0 = ${calcs.ourEquilibrium.Q.toFixed(2)}`"
              horizontal: "`P_0 = ${calcs.ourEquilibrium.P.toFixed(2)}`"
          


</div>

We can add several layers of complexity to the graphs above to illustrate the properties of supply, demand, and equilibrium. Play with the graph below to see some of these features in action: 

<div width="500" height="800" class="codePreview">
    
schema: EconSchema
params:
  - name: demandShift
    value: 0
    min: -5
    max: 5
    round: 0.1
  - name: supplyShift
    value: 0
    min: -5
    max: 5
    round: 0.1
calcs:
  demandChanged: ((params.demandShift-0)^2 > 0.04)
  supplyChanged: ((params.supplyShift-0)^2 > 0.04)
layout:
  OneGraph:
    graph:
      objects:
      - EconLinearEquilibrium:
          demand:
            name: oldDemand
            xIntercept: 10
            invSlope: -1
            lineStyle: dotted
            pts:
            - name: a
              y: 4
          supply:
            yIntercept: 2
            slope: 1
            lineStyle: dotted
            pts:
            - name: a
              y: 8
          equilibrium:
            droplines:
              vertical: Q_0
              horizontal: P_0
      - EconLinearEquilibrium:
          name: newEquilibrium
          demand:
            name: newDemand
            xIntercept: 10 + params.demandShift
            invSlope: -1
            pts:
            - name: a
              y: 4
            drag:
              - horizontal: demandShift
          supply:
            name: newSupply
            yIntercept: 2 - params.supplyShift
            slope: 1
            pts:
            - name: a
              y: 8
            drag:
              - horizontal: supplyShift
          equilibrium:
            show: (calcs.demandChanged || calcs.supplyChanged)
            droplines:
              vertical: Q_1
              horizontal: P_1
            
      - Arrow:
         begin: [calcs.oldDemand.a.x,4]
         end: [calcs.newDemand.a.x,4]
         show: calcs.demandChanged
         color: demand
         trim: 0.1
         
      - Arrow:
         begin: [calcs.supply.a.x,8]
         end: [calcs.newSupply.a.x,8]
         show: calcs.supplyChanged
         color: supply
         trim: 0.1
          


</div>

Some important things to notice about the graph above: 
* We've created two `EconLinearEquilibrium` objects, one to represent the original equilibrium and one to represent the new equilibrium. Before the user has shifted the supply or demand curves, we 'hide' the new equilibrium point with the `show: (calcs.demandChanged || calcs.supplyChanged)` line. This tells the equilibrium point to only show up on the graph when the supply or demand has been changed. Check out the calcs to see how this works mechanically. We've squared the terms so that the shift is always positive, and made it >.04 so that the two points don't have to be _exactly_ equilvalent to show up as such.
* We've named each equilibrium object something different now to distinguish between them!  
* Notice that the demand and supply for both the old and new equilibrium have points associated with them, both named `a` and with different values. We created these points so that we could generate the arrows pointing from the original demand/supply to the new demand/supply. We have arbitrarily selected the y-values 4 and 8 for the demand and supply, respectively, where the arrows will be show up. The arrows begin at the a-coordinates of the old demand and end at the a-coordinates of the new demand, and same for supply. Also note that the `trim` attribute of the arrow tells the arrow to stop slightly short of the line itself so as not to overlap with the line. Trim should generally be about 0.1, and always less than 0.5.

