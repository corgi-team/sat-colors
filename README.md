# SAT - Map Colors


## The Problem				
The problem that we choose to solve is defined as follows: 

**Given an undirected graph `G = (V, E)` and an integer `k`, is there a way to color the vertices with `k` colors such that adjacent vertices are colored differently?**

This problem can be applied in many different fields such as printing a map with the smallest amount of colors for example.

## Running the Solver
To run the solver, you will need to have `node` installed. After that is done, run the following command in the `server` folder:

```bash
$ npm install
$ node app.js
```

You can now go to the following URL in your preferred browser: [http://localhost:3000](http://localhost:3000). 

Create a graph, select the number of colors and launch the SAT solver. You should soon see the graph being colored if the problem is satisfiable or otherwise an error message.