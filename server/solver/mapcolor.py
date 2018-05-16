#!/usr/bin/env python

# !!! Change this to fit your path !!!
minisat="./minisat"

import sys
from subprocess import Popen
from subprocess import PIPE
import re
import random
import os
import json
from pprint import pprint

gbi = 0
varToStr = ["invalid"]
colors = []
links = []
nodes = []

def printClause(cl):
    print map(lambda x: "%s%s" % (x < 0 and eval("'-'") or eval ("''"), varToStr[abs(x)]) , cl)

def gvi(name):
    global gbi
    global varToStr
    gbi += 1
    varToStr.append(name)
    return gbi

def gen_vars(colors, nodes):

    varMap = {}

    for i in range(0, colors):
        for j in range(0, nodes):
            var_name = '{},{}'.format(j, i)
            varMap[var_name] = gvi(var_name)

    return varMap

def genGraphConstr(colorsCount, nodesCount, linksCount, vars):
    global nodes, colors, links

    clauses = []

    for p in range(0, nodesCount):
        all = []
        for h1 in range(0, colorsCount):
            for h2 in range(h1+1, colorsCount):
                var_name_1='{},{}'.format(p, h1)
                var_name_2='{},{}'.format(p, h2)
                clauses.append([-vars[var_name_1], -vars[var_name_2]])
            all.append(vars['{},{}'.format(p, h1)])
        clauses.append(all)

    for h in range(0, colorsCount):
        for p1 in range(0, nodesCount):
            for p2 in range(0, linksCount):
                if links[p2][0] == p1:
                    var_name_1='{},{}'.format(p1, h)
                    var_name_2='{},{}'.format(links[p2][1], h)
                    clauses.append([-vars[var_name_1], -vars[var_name_2]])

    return clauses

# A helper function to print the cnf header
def printHeader(n):
    global gbi
    return "p cnf %d %d" % (gbi, n)

# A helper function to print a set of clauses cls
def printCnf(cls):
    return "\n".join(map(lambda x: "%s 0" % " ".join(map(str, x)), cls))

def readJson(path):
    global colors, links, nodes
    with open(path) as data_file:
        data = json.load(data_file)
        colors = data["colors"]
        links = data["links"]
        nodes = data["nodes"]

def writeJson(facts):
    result = {"status": "satisfiable", "solutions": []}
    for f in facts:
        splitted = f.split(",")
        result["solutions"].append({"node": splitted[0], "color": colors[int(splitted[1])]})
    print "result"
    print facts
    with open('solution.json', 'w') as outfile:
        json.dump(result, outfile)

def writeUnsatisfiableJson():
    result = {"status": "unsatisfiable"}
    with open('solution.json', 'w') as outfile:
        json.dump(result, outfile)

# This function is invoked when the python script is run directly and not imported
if __name__ == '__main__':
    if not (os.path.isfile(minisat) and os.access(minisat, os.X_OK)):
        print "Set the path to minisat correctly on line 4 of this file (%s)" % sys.argv[0]
        sys.exit(1)

    # This is for reading in the arguments.
    if len(sys.argv) != 2:
        print "Usage: %s <graph.json>" % sys.argv[0]
        sys.exit(1)

    readJson(sys.argv[1])    
    
    vars = gen_vars(len(colors), len(nodes))
    print vars
    rules = genGraphConstr(len(colors), len(nodes), len(links), vars)
    print rules
    head = printHeader(len(rules))
    rls = printCnf(rules)

    # here we create the cnf file for minisat
    fl = open("tmp_prob.cnf", "w")
    fl.write("\n".join([head, rls]))
    fl.close()

    # this is for runing minisat
    ms_out = Popen([minisat, "tmp_prob.cnf", "solution"], stdout=PIPE).communicate()[0]

    # Print the output, just out of curiosity
    print ms_out

    # minisat with these arguments writes the solution to a file called "solution".  Let's check it
    res = open("solution", "r").readlines()

    # if it was satisfiable, we want to have the assignment printed out
    if res[0] == "SAT\n":
        # First get the assignment, which is on the second line of the file, and split it on spaces
        asgn = map(int, res[1].split())
        # Then get the variables that are positive, and get their names.
        # This way we know that everything not printed is false.
        # The last element in asgn is the trailing zero and we can ignore it
        facts = map(lambda x: varToStr[abs(x)], filter(lambda x: x > 0, asgn[:-1]))

        writeJson(facts)
    else:
        writeUnsatisfiableJson()
