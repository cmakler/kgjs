---
layout: documentation
title: Econ Linear Supply and Demnad
---

A line can be generated in a number of ways. First, let's look at a line defined by two points:

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

