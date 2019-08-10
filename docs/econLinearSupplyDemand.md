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

