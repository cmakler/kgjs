---
layout: documentation
title: Exchange Equilibrium
---

We've already looked at linear supply, demand, and equilibrium with an agent (buyer) and a firm (seller). Now we turn to exchange equilibrium, when both parties are agents with some endowment of goods 1 and 2 and some preferences over those goods. The agents can **exchange** goods between them until an exchange equilibrium results. 

## Net Demand

For each agent in an exchange equilibrium-style problem, they have some net demand for each good based on the relative prices of both goods–a positive demand if they'd like more of the good, and a negative demand if they'd like to sell that good.   


<div width="500" height="1000" class="codePreview">

schema: EconSchema
params:
- name: a
  value: 0.5
  min: 0.01
  max: 0.99
  round: 0.01
- name: p1
  value: 4
  min: 0.1
  max: 10
  round: 0.01
- name: p2
  value: 8
  min: 0.1
  max: 10
  round: 0.01
- name: w1
  value: 40
  min: 0
  max: 100
  round: 1
- name: w2
  value: 30
  min: 0
  max: 50
  round: 1
- name: showIndW
  value: false
- name: showPOC
  value: false
- name: showExplanation
  value: false
calcs:
  bottomGraphLeft: (-1*params.w1)
  bottomGraphRight: (100-params.w1)
  cutoffPrice: (calcs.endowmentBundle.mrs*params.p2)
  wealth: (params.w1*params.p1 + params.w2*params.p2)
layout:
  TwoVerticalGraphsPlusSidebar: 
    topGraph:
      xAxis:
        title: Units of Good 1
        orient: bottom
        min: 0
        max: 100
        ticks: 10
      yAxis:
        title: Units of Good 2
        orient: left
        min: 0
        max: 50
      objects:
      - type: EconOptimalBundle
        def:
          name: optimum2
          utilityFunction:
            type: CobbDouglas
            def:
              alpha: params.a
          budgetLine:
            p1: 2
            p2: params.p2
            x: params.w1
            y: params.w2
            inMap: true
          indifferenceCurve:
            inMap: true
          label: 
          droplines: {}
          r: 4
          color: colors.offer
          show: params.showPOC
      - type: EconOptimalBundle
        def:
          name: optimum4
          utilityFunction:
            type: CobbDouglas
            def:
              alpha: params.a
          budgetLine:
            p1: 4
            p2: params.p2
            x: params.w1
            y: params.w2
            inMap: true
          indifferenceCurve:
            inMap: true
          label: 
          droplines: {}
          r: 4
          color: colors.offer
          show: params.showPOC
      - type: EconOptimalBundle
        def:
          name: optimum6
          utilityFunction:
            type: CobbDouglas
            def:
              alpha: params.a
          budgetLine:
            p1: 6
            p2: params.p2
            x: params.w1
            y: params.w2
            inMap: true
          indifferenceCurve:
            inMap: true
          label: 
          droplines: {}
          r: 4
          color: colors.offer
          show: params.showPOC
      - type: EconOptimalBundle
        def:
          name: optimum8
          utilityFunction:
            type: CobbDouglas
            def:
              alpha: params.a
          budgetLine:
            p1: 8
            p2: params.p2
            x: params.w1
            y: params.w2
            inMap: true
          indifferenceCurve:
            inMap: true
          label: 
          droplines: {}
          r: 4
          color: colors.offer
          show: params.showPOC
      - type: EconPriceOfferCurve
        def:
          lineStyle: dashed
          utilityFunction:
            type: CobbDouglas
            def:
              alpha: params.a
          budgetLine:
            p1: params.p1
            p2: params.p2
            x: params.w1
            y: params.w2
          good: 1
          show: params.showPOC
      - type: EconBundle
        def:
          name: endowmentBundle
          coordinates:
          - params.w1
          - params.w2
          droplines:
            vertical: "\\omega_1"
          color: gray
          label:
            text: W
            position: tr
          utilityFunction:
            type: CobbDouglas
            def:
              alpha: params.a
          drag:
          - directions: x
            param: w1
            expression: params.w1 + drag.dx
          - directions: y
            param: w2
            expression: params.w2 + drag.dy
          indifferenceCurve:
            label:
              text: 
            color: colors.endowment
            show: params.showIndW
      - type: EconOptimalBundle
        def:
          name: optimum
          label:
            text: X
          droplines:
            vertical: x_1^*
          utilityFunction:
            type: CobbDouglas
            def:
              alpha: params.a
          color: colors.utility
          budgetLine:
            p1: params.p1
            p2: params.p2
            x: params.w1
            y: params.w2
            draggable: false
            handles: false
            set: false
            color: colors.budget
            label:
              text: "`BL_{m=${calcs.wealth.toFixed(0)}}`"
          indifferenceCurve: {}
      - type: Segment
        def:
          a:
          - 0
          - 8
          b:
          - params.w1
          - 8
          endArrow: true
          color: colors.endowment
          label:
            text: "`\\\\text{You have ${params.w1.toFixed(0)} units of good 1...}`"
            location: 0.5
            yPixelOffset: 15
          show: params.showExplanation
      - type: Segment
        def:
          a:
          - 0
          - 5
          b:
          - calcs.optimum.x
          - 5
          endArrow: true
          color: colors.utility
          label:
            text: "`\\\\text{...and want to consume ${calcs.optimum.x.toFixed(0)}...}`"
            location: 0.5
            yPixelOffset: -15
          show: params.showExplanation
    bottomGraph:
      xAxis:
        title: Net Demand for Good 1
        orient: bottom
        min: (calcs.bottomGraphLeft)
        max: (calcs.bottomGraphRight)
        ticks: 10
      yAxis:
        title: Price of Good 1
        orient: left
        min: 0
        max: 10
      objects:
      - type: EconNetDemandCurve
        def:
          name: demandCurve
          utilityFunction:
            type: CobbDouglas
            def:
              alpha: params.a
          budgetLine:
            p2: params.p2
            x: params.w1
            y: params.w2
          max: calcs.cutoffPrice
      - type: EconNetDemandCurve
        def:
          name: demandCurve
          utilityFunction:
            type: CobbDouglas
            def:
              alpha: params.a
          budgetLine:
            p2: params.p2
            x: params.w1
            y: params.w2
          color: colors.supply
          min: calcs.cutoffPrice
      - type: Point
        def:
          coordinates:
          - calcs.optimum2.x - params.w1
          - 2
          r: 4
          color: colors.demand
          show: params.showPOC
      - type: Point
        def:
          coordinates:
          - calcs.optimum4.x - params.w1
          - 4
          r: 4
          color: colors.demand
          show: params.showPOC
      - type: Point
        def:
          coordinates:
          - calcs.optimum6.x - params.w1
          - 6
          r: 4
          color: colors.demand
          show: params.showPOC
      - type: Point
        def:
          coordinates:
          - calcs.optimum8.x - params.w1
          - 8
          r: 4
          color: colors.demand
          show: params.showPOC
      - type: Segment
        def:
          a:
          - calcs.bottomGraphLeft
          - params.p1
          b:
          - calcs.bottomGraphRight
          - params.p1
          color: colors.budget
          drag:
          - directions: y
            param: p1
            expression: params.p1 + drag.dy
          label:
            text: p_1
            location: 0.05
      - type: Segment
        def:
          a:
          - calcs.bottomGraphLeft
          - 2
          b:
          - calcs.bottomGraphRight
          - 2
          color: colors.budget
          lineStyle: dotted
          show: params.showPOC
      - type: Segment
        def:
          a:
          - calcs.bottomGraphLeft
          - 4
          b:
          - calcs.bottomGraphRight
          - 4
          color: colors.budget
          lineStyle: dotted
          show: params.showPOC
      - type: Segment
        def:
          a:
          - calcs.bottomGraphLeft
          - 6
          b:
          - calcs.bottomGraphRight
          - 6
          color: colors.budget
          lineStyle: dotted
          show: params.showPOC
      - type: Segment
        def:
          a:
          - calcs.bottomGraphLeft
          - 8
          b:
          - calcs.bottomGraphRight
          - 8
          color: colors.budget
          lineStyle: dotted
          show: params.showPOC
      - type: Point
        def:
          coordinates:
          - calcs.optimum.x - params.w1
          - params.p1
          label:
            text: d_1(p_1|p_2)
          color: colors.demand
          droplines:
            vertical: (calcs.optimum.x - params.w1).toFixed(0)
          drag:
          - directions: y
            param: p1
            expression: params.p1 + drag.dy
          show: (params.p1 < calcs.cutoffPrice)
      - type: Point
        def:
          coordinates:
          - calcs.optimum.x - params.w1
          - params.p1
          label:
            text: s_1(p_1|p_2)
            position: tr
          color: colors.supply
          droplines:
            vertical: (calcs.optimum.x - params.w1).toFixed(0)
          drag:
          - directions: y
            param: p1
            expression: params.p1 + drag.dy
          show: (params.p1 > calcs.cutoffPrice)
      - type: Segment
        def:
          a:
          - 0
          - 1
          b:
          - calcs.optimum.x-params.w1
          - 1
          endArrow: true
          color: colors.supply
          label:
            text: "`\\\\text{...so you want to sell ${(params.w1-calcs.optimum.x).toFixed(0)}}`"
            location: 0.5
            yPixelOffset: -15
          show: (params.showExplanation && (calcs.optimum.x < params.w1))
      - type: Segment
        def:
          a:
          - 0
          - 1
          b:
          - calcs.optimum.x-params.w1
          - 1
          endArrow: true
          color: colors.demand
          label:
            text: "`\\\\text{...so you want to buy ${(calcs.optimum.x-params.w1).toFixed(0)}
              more}`"
            location: 0.5
            yPixelOffset: -15
          show: (params.showExplanation && (calcs.optimum.x > params.w1))
    sidebar:
      controls:
      - title: Utility Function
        sliders:
        - param: a
          label: "\\alpha"
        divs:
        - html: "`$$u(x_1,x_2) = x_1^\\\\alpha x_2^{1 - \\\\alpha} = x_1^{${params.a.toFixed(2)}}x_2^{${(1-params.a).toFixed(2)}}$$`"
      - title: Budget Parameters
        sliders:
        - param: p1
          label: p_1
        - param: p2
          label: p_2
      - title: Options
        checkboxes:
        - param: showPOC
          label: "\\text{Show offer curve and bundles for }p_1 = 2,4,6,8"
        - param: showIndW
          label: "\\text{Show indifference curve through $W$}"
        - param: showExplanation
          label: "\\text{Show explanation}"
        divs:
        - html: "`<hr/>You start with an endowment of $\\\\color{${colors.endowment}}{\\\\omega_1
            = ${params.w1.toFixed(0)}}$ units of good 1 and $\\\\color{${colors.endowment}}{\\\\omega_2
            = ${params.w2.toFixed(0)}}$ of good 2. With $p_1 = ${params.p1.toFixed(2)}$
            and $p_2 = ${params.p2.toFixed(2)}$, this has a monetary value of $$\\\\color{${colors.budget}}{m
            = p_1\\\\omega_1 + p_2\\\\omega_2 \\\\approx ${calcs.wealth.toFixed(0)}}$$`"
          show: params.showExplanation
        - html: "`With this Cobb-Douglas utility function, your <b>gross demand</b>
            for good 1 is $$\\\\color{${colors.utility}}{x_1^* = \\\\frac{\\\\alpha
            m}{p_1}  \\\\approx \\\\frac{${params.a.toFixed(2)} \\\\times ${calcs.wealth.toFixed(0)}}{${params.p1.toFixed(2)}}
            \ \\\\approx ${calcs.optimum.x.toFixed(0)}}$$`"
          show: params.showExplanation
        - html: "`Since ${calcs.optimum.x.toFixed(0)} is more than your endowment
            of ${params.w1.toFixed(0)}, you want to buy the difference: that is, your
            <b>net demand</b> is $$\\\\color{${colors.demand}}{d_1 = x_1^* - \\\\omega_1
            \\\\approx ${calcs.optimum.x.toFixed(0)} - ${params.w1.toFixed(0)} \\\\approx
            ${(calcs.optimum.x - params.w1).toFixed(0)}}$$`"
          show: (params.showExplanation && (params.p1 < calcs.cutoffPrice))
        - html: "`Since ${calcs.optimum.x.toFixed(0)} is less than your endowment
            of ${params.w1.toFixed(0)}, you want to sell the difference: that is,
            your <b>net supply</b> is $$\\\\color{${colors.supply}}{s_1 = \\\\omega_1
            - x_1^* \\\\approx ${params.w1.toFixed(0)} - ${calcs.optimum.x.toFixed(0)}
            \\\\approx ${(params.w1 - calcs.optimum.x).toFixed(0)}}$$(That is, your
            <b>net demand</b> is $ ${(calcs.optimum.x - params.w1).toFixed(0)}$.)`"
          show: (params.showExplanation && (params.p1 > calcs.cutoffPrice))


</div>

