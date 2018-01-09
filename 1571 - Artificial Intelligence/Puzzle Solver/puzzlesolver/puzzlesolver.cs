using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace puzzlesolver
{
    class puzzlesolver
    {
        static void Main(string[] args)
        {
            string nodes = "";
            StringBuilder edges = new StringBuilder();

            string algorithm = args[1].ToString().ToLower().Trim();
            string file = args[0].ToString().Trim();
            string problemType = readFile(file, ref nodes, ref edges);

            Console.WriteLine("--------------------------------------------------------------------------------");
            Console.WriteLine("Running " + algorithm + " on " + file);

            if (problemType.Equals("monitor", StringComparison.OrdinalIgnoreCase))
            {
                Dictionary<string, MonitorNode> nodeList = parseMonitorNodes(nodes);
                MonitorList monitor = new MonitorList(nodeList);
                parseMonitorEdges(edges.ToString(), monitor);
                Console.WriteLine(determineGoalState(runMonitorAlgorithm(algorithm, monitor)));
            }
            else if(problemType.Equals("aggregation", StringComparison.OrdinalIgnoreCase))
            {
                Dictionary<string, AggregationNode> nodeList = parseAggregationNodes(nodes);
                parseAggregationEdges(edges.ToString(), nodeList);
                Console.WriteLine(determineGoalState(runAggregationAlgorithm(algorithm, nodeList)));
            }
            else if (problemType.Equals("pancakes", StringComparison.OrdinalIgnoreCase))
            {
                PancakeNode pancakes = new PancakeNode(nodes);
                Console.WriteLine(determineGoalState(runPancakeAlgorithm(algorithm, pancakes)));
            }
            else
            {
                Console.WriteLine("Problem type not recognized.");
                endProgram();
            }

            Console.ReadKey();
        }

        private static string readFile(string filePath, ref string nodes, ref StringBuilder edges)
        {
            string problemType = "";

            try
            {
                if (!File.Exists(filePath))
                    throw new FileNotFoundException();
                else
                {
                    using (StreamReader file = new StreamReader(filePath))
                    {
                        problemType = file.ReadLine();
                        nodes = file.ReadLine();

                        if (problemType.Equals("aggregation", StringComparison.OrdinalIgnoreCase))
                        {
                            string line;
                            while ((line = file.ReadLine()) != null)
                            {
                                edges.Append(line + ",");
                            }

                        }
                        else if (problemType.Equals("monitor", StringComparison.OrdinalIgnoreCase))
                        {
                            edges.Append(file.ReadLine());
                        }
                        else if (problemType.Equals("pancakes", StringComparison.OrdinalIgnoreCase))
                        {
                            edges.Append(file.ReadLine());
                        }
                        else
                        {
                            throw new InvalidDataException();
                        }
                    }
                }
            }
            catch (FileNotFoundException)
            {
                Console.WriteLine("An error occured opening the file. Please check the path you entered and try again.");
                endProgram();
            }
            catch (InvalidDataException)
            {
                Console.WriteLine("The problem type was not recognized.");
                endProgram();
            }
            catch (Exception)
            {
                Console.WriteLine("An unknown error occured reading from the file.");
                endProgram();
            }

            return problemType;
        }

        private static Dictionary<string, MonitorNode> parseMonitorNodes(String nodeList)
        {
            var charToRemove = new String[] { "[", "]", "(", ")", "\"" };
            String[] nodes = nodeList.Split(',');
            var parsedNodes = new Dictionary<string, MonitorNode>();

            for (int i = 0; i < nodes.Length; i = i + 4)
            {
                foreach (var c in charToRemove)
                {
                    nodes[i] = nodes[i].Replace(c, "").Trim();
                    nodes[i + 1] = nodes[i + 1].Replace(c, "").Trim();
                    nodes[i + 2] = nodes[i + 2].Replace(c, "").Trim();
                    nodes[i + 3] = nodes[i + 3].Replace(c, "").Trim();
                }

                parsedNodes.Add(nodes[i], new MonitorNode(int.Parse(nodes[i + 1]), int.Parse(nodes[i + 2]), nodes[i], int.Parse(nodes[i + 3])));
            }


            return parsedNodes;
        }

        private static Dictionary<string, AggregationNode> parseAggregationNodes(String nodeList)
        {
            var charToRemove = new String[] { "[", "]", "(", ")", "\"" };
            String[] nodes = nodeList.Split(',');
            var parsedNodes = new Dictionary<string, AggregationNode>();

            for (int i = 0; i < nodes.Length; i = i + 3)
            {
                foreach (var c in charToRemove)
                {
                    nodes[i] = nodes[i].Replace(c, "").Trim();
                    nodes[i + 1] = nodes[i + 1].Replace(c, "").Trim();
                    nodes[i + 2] = nodes[i + 2].Replace(c, "").Trim();
                }

                parsedNodes.Add(nodes[i], new AggregationNode(int.Parse(nodes[i + 1]), int.Parse(nodes[i + 2]), nodes[i]));
            }


            return parsedNodes;
        }

        private static void parseAggregationEdges(String edgeList, Dictionary<string, AggregationNode> nodeList)
        {
            var charToRemove = new String[] { "[", "]", "(", ")", "\"" };
            String[] edges = edgeList.Split(',');

            for (int i = 0; i < edges.Length-1; i = i + 3)
            {
                foreach (var c in charToRemove)
                {
                    edges[i] = edges[i].Replace(c, "").Trim();
                    edges[i + 1] = edges[i + 1].Replace(c, "").Trim();
                    edges[i + 2] = edges[i + 2].Replace(c, "").Trim();
                }

                AggregationNode firstNode = nodeList[edges[i]];
                AggregationNode secondNode = nodeList[edges[i+1]];

                firstNode.connectedNodes.Add(edges[i + 1], Double.Parse(edges[i + 2]));
                secondNode.connectedNodes.Add(edges[i], Double.Parse(edges[i + 2]));
            }
        }

        private static void parseMonitorEdges(String edgeList, MonitorList monitor)
        {
            var charToRemove = new String[] { "[", "]", "(", ")", "\"" };
            String[] edges = edgeList.Split(',');
            var parsedEdges = new List<MonitorNode>();

            for (int i = 0; i < edges.Length-1; i = i + 3)
            {
                foreach (var c in charToRemove)
                {
                    edges[i] = edges[i].Replace(c, "").Trim();
                    edges[i + 1] = edges[i + 1].Replace(c, "").Trim();
                    edges[i + 2] = edges[i + 2].Replace(c, "").Trim();
                }

                foreach (MonitorNode aNode in monitor.sensors)
                {
                    monitor.addConnection(aNode.name, edges[i], 
                        aNode.calculateEuclidianDistance(int.Parse(edges[i + 1]), int.Parse(edges[i + 2])));
                }

            }
        }

        private static void endProgram()
        {
            Console.WriteLine("Press any key to end the program...");
            Console.ReadKey();
            System.Environment.Exit(1);
        }

        private static List<Tuple<string, double>> runAggregationAlgorithm(string algorithm, Dictionary<string, AggregationNode> nodeList)
        {
            List<Tuple<string, double>> possiblePaths = new List<Tuple<string, double>>();

            if(algorithm.Equals("bfs", StringComparison.OrdinalIgnoreCase))
            {
                foreach (KeyValuePair<string, AggregationNode> aNode in nodeList)
                {
                    possiblePaths.Add(aNode.Value.runBFS(nodeList));
                }
            }
            else if(algorithm.Equals("unicost", StringComparison.OrdinalIgnoreCase))
            {
                foreach (KeyValuePair<string, AggregationNode> aNode in nodeList)
                {
                    possiblePaths.Add(aNode.Value.runUCS(nodeList));
                }
            }
            else if(algorithm.Equals("iddfs", StringComparison.OrdinalIgnoreCase))
            {
                foreach (KeyValuePair<string, AggregationNode> aNode in nodeList)
                {
                    possiblePaths.Add(aNode.Value.startDFS(nodeList));
                } 
            }
            else
            {
                Console.WriteLine("Algorithm not recognized.");
                endProgram();
            }

            return possiblePaths;
        }

        private static List<Tuple<string, double>> runMonitorAlgorithm(string algorithm, MonitorList monitor)
        {
            List<Tuple<string, double>> possiblePaths = new List<Tuple<string, double>>();

            if (algorithm.Equals("bfs", StringComparison.OrdinalIgnoreCase))
            {
                possiblePaths.Add(monitor.runBFS());
               
            }
            else if (algorithm.Equals("unicost", StringComparison.OrdinalIgnoreCase))
            {
                possiblePaths.Add(monitor.runUCS());
            }
            else if (algorithm.Equals("iddfs", StringComparison.OrdinalIgnoreCase))
            {
                possiblePaths.Add(monitor.startDFS());
            }
            else
            {
                Console.WriteLine("Algorithm not recognized.");
                endProgram();
            }

            return possiblePaths;
        }

        private static List<Tuple<string, double>> runPancakeAlgorithm(string algorithm, PancakeNode pancakes)
        {
            List<Tuple<string, double>> possiblePaths = new List<Tuple<string, double>>();

            if (algorithm.Equals("bfs", StringComparison.OrdinalIgnoreCase))
            {
                for(int i = 0; i < 100; i++)
                {
                    possiblePaths.Add(pancakes.runBFS());
                }              
            }
            else if (algorithm.Equals("unicost", StringComparison.OrdinalIgnoreCase))
            {
                possiblePaths.Add(pancakes.runUCS());
            }
            else if (algorithm.Equals("iddfs", StringComparison.OrdinalIgnoreCase))
            {
                possiblePaths.Add(pancakes.startDFS());
            }
            else
            {
                Console.WriteLine("Algorithm not recognized.");
                endProgram();
            }

            return possiblePaths;
        }

        private static string determineGoalState(List<Tuple<string, double>> possiblePaths)
        {
            double lowestCost = double.MaxValue;
            StringBuilder finalPaths = new StringBuilder();
            List<Tuple<string, double>> finalPathList = new List<Tuple<string, double>>();

            foreach (Tuple<string, double> path in possiblePaths)
            {
                if (path.Item2 == lowestCost)
                {
                    finalPathList.Add(path);
                }
                else if (path.Item2 < lowestCost)
                {
                    finalPathList.Clear();
                    finalPathList.Add(path);
                    lowestCost = path.Item2;
                }
            }

            foreach (Tuple<string, double> path in finalPathList)
            {
                finalPaths.Append(path.Item1);
                finalPaths.AppendLine("Cost: " + path.Item2.ToString());
                finalPaths.AppendLine();
            }

            return finalPaths.ToString();
        }
    }

    class MonitorList
    {
        public List<MonitorNode> sensors = new List<MonitorNode>();
        List<Tuple<string, string, double>> connections = new List<Tuple<string, string, double>>();
      
        public MonitorList (Dictionary<string, MonitorNode> nodes)
        {
            foreach (KeyValuePair<string, MonitorNode> aNode in nodes)
            {
                sensors.Add(aNode.Value);
            }
        }

        public void addConnection(string sensor, string target, double distance)
        {
            connections.Add(new Tuple<string, string, double>(sensor, target, distance));
        }

        public Tuple<string, double> runBFS()
        {
            StringBuilder path = new StringBuilder();
            int frontier = 0;
            int time = connections.Count;

            Queue fringe = new Queue();
            Dictionary<string, int> watchedTargets = new Dictionary<string, int>();
            List<string> isVisited = new List<string>();
            fringe.Enqueue(connections[0]);
            connections.RemoveAt(0);

            while (fringe.Count != 0)
            {
                if (fringe.Count > frontier)
                {
                    frontier = fringe.Count;
                }

                Tuple<string, string, double> dequeued = (Tuple<string, string, double>)fringe.Dequeue();

                if(!isVisited.Contains(dequeued.Item1))
                {
                    bool targetOk = false;
                    if(!watchedTargets.ContainsKey(dequeued.Item2))
                    {
                        watchedTargets.Add(dequeued.Item2, 1);
                        targetOk = true;
                    }
                    else if(watchedTargets[dequeued.Item2] != 2)
                    {
                        watchedTargets[dequeued.Item2] = 2;
                        targetOk = true;
                    }

                    if(targetOk)
                    {
                        isVisited.Add(dequeued.Item1);
                        path.AppendLine(dequeued.Item1 + dequeued.Item2);
                        foreach (MonitorNode aNode in this.sensors)
                        {
                            if (aNode.name.Equals(dequeued.Item1, StringComparison.OrdinalIgnoreCase))
                            {
                                aNode.remainingPower -= dequeued.Item3;
                            }
                        }

                        foreach (Tuple<string, string, double> aConnection in connections)
                        {
                            if (!isVisited.Contains(aConnection.Item1))
                            {
                                fringe.Enqueue(aConnection);
                                frontier++;
                            }
                        }
                    }
                }

            }

            double cost = 0;
            int visited = 0;
            foreach(KeyValuePair<string, int> pair in watchedTargets)
            {
                visited += pair.Value;
            }

            foreach(MonitorNode aNode in sensors)
            {
                cost += aNode.calculatePowerExpended();
            }

            return new Tuple<string, double>(path.ToString() + "Time: " + time.ToString() + "\nFrontier: " + frontier.ToString() +
                "\nExplored: " + visited.ToString() + "\n", cost);
        }

        public Tuple<string, double> runUCS()
        {
            StringBuilder path = new StringBuilder();
            int frontier = 0;

            List<Tuple<string, string, double>> fringe = new List<Tuple<string, string, double>>();
            Dictionary<string, int> watchedTargets = new Dictionary<string, int>();
            List<string> visited = new List<string>();

            foreach (Tuple<string, string, double> aConnection in this.connections)
            {
                if (fringe.Count == 0)
                {
                    fringe.Add(aConnection);
                }
                else
                {
                    for (int i = 0; i < fringe.Count; i++)
                    {
                        if (fringe.ElementAt(i).Item3 >= aConnection.Item3)
                        {
                            fringe.Insert(i, aConnection);
                            break;
                        }
                        else if (i == fringe.Count - 1)
                        {
                            fringe.Add(aConnection);
                            break;
                        }
                    }
                }
            }

            while (fringe.Count != 0)
            {
                if (fringe.Count > frontier)
                {
                    frontier = fringe.Count;
                }

                Tuple<string, string, double> dequeued = fringe[0];
                fringe.RemoveAt(0);

                if(!visited.Contains(dequeued.Item1) )
                {
                    bool targetOk = false;
                    if (!watchedTargets.ContainsKey(dequeued.Item2))
                    {
                        watchedTargets.Add(dequeued.Item2, 1);
                        targetOk = true;
                    }
                    else if (watchedTargets[dequeued.Item2] != 2)
                    {
                        watchedTargets[dequeued.Item2] = 2;
                        targetOk = true;
                    }

                    if(targetOk)
                    {
                        visited.Add(dequeued.Item1);
                        path.AppendLine(dequeued.Item1 + dequeued.Item2);

                        foreach (MonitorNode aNode in this.sensors)
                        {
                            if (aNode.name.Equals(dequeued.Item1, StringComparison.OrdinalIgnoreCase))
                            {
                                aNode.remainingPower -= dequeued.Item3;
                            }
                        }
                    }
                }
            }

            double cost = 0;
            int numVisited = 0;
            foreach (KeyValuePair<string, int> pair in watchedTargets)
            {
                numVisited += pair.Value;
            }

            foreach (MonitorNode aNode in sensors)
            {
                cost += aNode.calculatePowerExpended();
            }

            return new Tuple<string, double>(path.ToString() + "Time: " + connections.Count.ToString() + "\nFrontier: " + frontier.ToString() +
                "\nExplored: " + numVisited.ToString() + "\n", cost);
        }

        public Tuple<string, double> startDFS()
        {
            Tuple<string, double> possiblePath = new Tuple<string, double>("", 0);
            bool isCutOff = false;
            int depth = 0;

            while (!isCutOff)
            {
                possiblePath = runIDDFS(depth, ref isCutOff);
                depth++;
            }

            return possiblePath;
        }

        public Tuple<string, double> runIDDFS(int depth, ref  bool isCutOff)
        {
            StringBuilder path = new StringBuilder();
            int frontier = 0;
            int currentDepth = 0;
            int numberVisited = 0;

            Stack fringe = new Stack();
            List<string> visited = new List<string>();
            Dictionary<string, int> watchedTargets = new Dictionary<string, int>();

            foreach (Tuple<string, string, double> nextNode in this.connections)
            {
                fringe.Push(nextNode);
            }

            while(fringe.Count != 0)
            {
                if (fringe.Count > frontier)
                {
                    frontier = fringe.Count;
                }

                Tuple<string, string, double> dequeued = (Tuple<string, string, double>)fringe.Pop();
                numberVisited++;

                if (!visited.Contains(dequeued.Item1))
                {
                    bool targetOk = false;
                    if (!watchedTargets.ContainsKey(dequeued.Item2))
                    {
                        watchedTargets.Add(dequeued.Item2, 1);
                        targetOk = true;
                    }
                    else if (watchedTargets[dequeued.Item2] != 2)
                    {
                        watchedTargets[dequeued.Item2] = 2;
                        targetOk = true;
                    }

                    if(targetOk)
                    {
                        path.AppendLine(dequeued.Item1 + dequeued.Item2);
                        visited.Add(dequeued.Item1);
                        foreach (MonitorNode aNode in this.sensors)
                        {
                            if (aNode.name.Equals(dequeued.Item1, StringComparison.OrdinalIgnoreCase))
                            {
                                aNode.remainingPower -= dequeued.Item3;
                            }
                        }
                    }
                }

                if (numberVisited == connections.Count) //goal state is when all are visited
                {
                    isCutOff = true;
                }
                else if (depth == currentDepth)
                {
                    continue;
                }
                else
                {
                    foreach (Tuple<string, string, double> nextNode in connections)
                    {
                        fringe.Push(nextNode);
                    }
                    currentDepth++;
                }
            }

            double cost = 0;

            foreach (MonitorNode aNode in sensors)
            {
                cost += aNode.calculatePowerExpended();
            }

            return new Tuple<string, double>(path.ToString() + "Time: " + connections.Count.ToString() + "\nFrontier: " + frontier.ToString() +
                "\nExplored: " + visited.Count + "\n", cost);
        }
    }

    class MonitorNode
    {
        public string name;     //state
        public int locationX, locationY;
        public int initialPower;
        public double remainingPower;

        public MonitorNode(int locationX, int locationY, string name, int initialPower)
        {
            this.name = name;
            this.locationX = locationX;
            this.locationY = locationY;
            this.initialPower = initialPower;
            this.remainingPower = initialPower;
        }

        public double calculateEuclidianDistance(int X, int Y)
        {
            double a = Math.Pow(this.locationX - X, 2.0);
            double b = Math.Pow(this.locationY - Y, 2.0);
            return Math.Sqrt(a + b);
        }

        public double calculatePowerExpended()
        {
            return initialPower - remainingPower;
        }
    }

    class AggregationNode
    {
        public string name;
        public int locationX, locationY;
        public Dictionary<string, double> connectedNodes = new Dictionary<string, double>();

        public AggregationNode(int locationX, int locationY, string name)
        {
            this.name = name;
            this.locationX = locationX;
            this.locationY = locationY;
        }

        public Dictionary<string, double> getSuccessors()
        {
            return connectedNodes;
        }

        public Tuple<string, double> runBFS(Dictionary<string, AggregationNode> nodeList)
        {
            StringBuilder path = new StringBuilder();
            double cost = 0;
            int frontier = 0;

            Queue fringe = new Queue();
            List<string> visited = new List<string>();
            visited.Add(this.name);
            path.AppendLine(this.name);

            foreach (KeyValuePair<string, double> nextNode in this.connectedNodes)
            {
                fringe.Enqueue(nextNode);
            }

            while (fringe.Count!= 0)
            {
                if(fringe.Count > frontier)
                {
                    frontier = fringe.Count;
                }

                KeyValuePair<string, double> dequeued = (KeyValuePair<string, double>)fringe.Dequeue();
                AggregationNode current = nodeList[dequeued.Key];
                if (!visited.Contains(current.name))
                {
                    path.AppendLine(current.name);
                    visited.Add(current.name);
                    cost += dequeued.Value;
                }

                foreach (KeyValuePair<string, double> nextNode in current.connectedNodes)
                {
                    if(!visited.Contains(nextNode.Key))
                        fringe.Enqueue(nextNode);
                }
            }
            return new Tuple<string, double>(path.ToString() + "Time: " + nodeList.Count + "\nFrontier: " + frontier +
                "\nExplored: " + visited.Count + "\n", cost);
        }

        public Tuple<string, double> runUCS(Dictionary<string, AggregationNode> nodeList)
        {
            StringBuilder path = new StringBuilder();
            double cost = 0;
            int frontier = 0;

            List<Tuple<string, double>> fringe = new List<Tuple<string, double>>();
            List<string> visited = new List<string>();
            visited.Add(this.name);
            path.AppendLine(this.name);

            foreach (KeyValuePair<string, double> nextNode in this.connectedNodes)
            {
                if(fringe.Count == 0)
                {
                    fringe.Add(new Tuple<string, double>(nextNode.Key, nextNode.Value));
                }
                else
                {
                    for(int i = 0; i < fringe.Count; i++)
                    {
                        if(fringe[i].Item2 > nextNode.Value)
                        {
                            fringe.Insert(i, new Tuple<string, double>(nextNode.Key, nextNode.Value));
                            break;
                        }
                        else if(i == fringe.Count-1)
                        {
                            fringe.Add(new Tuple<string, double>(nextNode.Key, nextNode.Value));
                            break;
                        }
                    }
                }
            }

            while(fringe.Count != 0)
            {
                if (fringe.Count > frontier)
                {
                    frontier = fringe.Count;
                }

                Tuple<string, double> dequeued = fringe[0];
                fringe.RemoveAt(0);
                AggregationNode current = nodeList[dequeued.Item1];

                if (!visited.Contains(current.name))
                {
                    path.AppendLine(current.name);
                    visited.Add(current.name);
                    cost += dequeued.Item2;
                }

                foreach (KeyValuePair<string, double> nextNode in current.connectedNodes)
                {
                    if (!visited.Contains(nextNode.Key))
                    {
                        if (fringe.Count == 0)
                        {
                            fringe.Add(new Tuple<string, double>(nextNode.Key, nextNode.Value));
                        }
                        else
                        {
                            for (int i = 0; i < fringe.Count; i++)
                            {
                                if (fringe[i].Item2 > nextNode.Value)
                                {
                                    fringe.Insert(i, new Tuple<string, double>(nextNode.Key, nextNode.Value));
                                    break;
                                }
                                else if (i == fringe.Count - 1)
                                {
                                    fringe.Add(new Tuple<string, double>(nextNode.Key, nextNode.Value));
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            return new Tuple<string, double>(path.ToString() + "Time: " + nodeList.Count + "\nFrontier: " + frontier +
                "\nExplored: " + visited.Count + "\n", cost);
        }

        public Tuple<string, double> startDFS(Dictionary<string, AggregationNode> nodeList)
        {
            Tuple<string, double> possiblePath = new Tuple<string, double>("", 0);
            bool isCutOff = false;
            int depth = 0;

            while (!isCutOff)
            {
                possiblePath = runIDDFS(nodeList, depth, ref isCutOff);
                depth++;
            }

            return possiblePath;
        }

        public Tuple<string, double> runIDDFS(Dictionary<string, AggregationNode> nodeList, int depth, ref bool isCutOff)
        {
            StringBuilder path = new StringBuilder();
            double cost = 0;
            int frontier = 0;
            int currentDepth = 0;
            int numberVisited = 1;

            Stack fringe = new Stack();
            List<string> visited = new List<string>();
            visited.Add(this.name);
            path.AppendLine(this.name);

            foreach (KeyValuePair<string, double> nextNode in this.connectedNodes)
            {
                fringe.Push(nextNode);
            }

            while (fringe.Count != 0)
            {
                if (fringe.Count > frontier)
                {
                    frontier = fringe.Count;
                }

                KeyValuePair<string, double> dequeued = (KeyValuePair<string, double>)fringe.Pop();
                AggregationNode current = nodeList[dequeued.Key];
                numberVisited++;

                if (!visited.Contains(current.name))
                {
                    path.AppendLine(current.name);
                    visited.Add(current.name);
                    cost += dequeued.Value;
                }

                foreach (KeyValuePair<string, double> nextNode in current.connectedNodes)
                {
                    if (!visited.Contains(nextNode.Key))
                        fringe.Push(nextNode);
                }

                if (numberVisited == nodeList.Count) //goal state is when all are visited
                {
                    isCutOff = true;
                }
                else if (depth == currentDepth)
                {
                    continue;
                }
                else
                {
                    foreach (KeyValuePair<string, double> nextNode in current.connectedNodes)
                    {
                        fringe.Push(nextNode);
                    }
                    currentDepth++;
                }
            }
            return new Tuple<string, double>(path.ToString() + "Time: " + nodeList.Count + "\nFrontier: " + frontier +
                                                "\nExplored: " + visited.Count + "\n", cost);
        }

        //public StringBuilder runGreedy(Dictionary<string, AggregationNode> nodeList)
        //{
        //    StringBuilder path = new StringBuilder();
        //    return path;
        //}

        //public StringBuilder runAStar(Dictionary<string, AggregationNode> nodeList)
        //{
        //    StringBuilder path = new StringBuilder();
        //    return path;
        //}
    }

    class PancakeNode
    {
        public List<int> pancakeStack = new List<int>();
        public List<int> pancakeStackAbsolute = new List<int>();
        public List<bool> burntStack = new List<bool>();
        public List<int> goalStack = new List<int>();
        int flipCost = 0;

        public PancakeNode(string pancakeString)
        {
            var charToRemove = new String[] { "[", "]", "(", ")", "\"" };
            string[] pancakes = pancakeString.Split(',');

            for(int i = 0; i < pancakes.Length; i++)
            {
                foreach (var c in charToRemove)
                {
                    pancakes[i] = pancakes[i].Replace(c, "").Trim();
                }

                pancakeStack.Add(int.Parse(pancakes[i]));
                pancakeStackAbsolute.Add(Math.Abs(int.Parse(pancakes[i])));
                goalStack.Add(i + 1);
                if(int.Parse(pancakes[i]) < 0)
                {
                    burntStack.Add(true);
                                    }
                else
                {
                    burntStack.Add(false);
                }
            }
        }

        public void flipFront(int position)
        {
            for(int i = 0; i < --position; i++)
            {
                int swap = pancakeStack[i];
                int absolute = pancakeStackAbsolute[i];
                bool burntAt = burntStack[i];
                bool burntTo = burntStack[position];

                pancakeStack[i] = burntTo ? -1 * pancakeStack[position] : pancakeStack[position];
                pancakeStack[position] = burntAt ? -1 * swap : swap;
                pancakeStackAbsolute[i] = pancakeStackAbsolute[position];
                pancakeStackAbsolute[position] = absolute;
                burntStack[i] = burntTo;
                burntStack[position] = burntAt;

                flipCost++;
            }
        }

        public bool isGoalState(List<int> possibleState)
        {
            return goalStack.SequenceEqual(possibleState);
        }

        public Tuple<string, double> runBFS()
        {
            StringBuilder path = new StringBuilder();
            int frontier = 0;

            Queue fringe = new Queue();
            List<int> visited = new List<int>();
            fringe.Enqueue(pancakeStack.IndexOf(pancakeStack.Max()));

            while(fringe.Count != 0)
            {
                if (fringe.Count > frontier)
                {
                    frontier = fringe.Count;
                }

                int dequeued = (int)fringe.Dequeue();
                visited.Insert(0, pancakeStack[dequeued]);
                flipFront(dequeued+1);
                path.AppendLine(string.Join(",", pancakeStack.ToArray()));
                flipFront(pancakeStack.Count);
                pancakeStack.RemoveAt(pancakeStack.Count - 1);
                if(pancakeStack.Count != 0)
                {
                    fringe.Enqueue(pancakeStack.IndexOf(pancakeStack.Max()));
                }
                else
                {
                    flipFront(pancakeStack.Count);
                }
            }

            //if(isGoalState(visited))
            //{
            //    return new Tuple<string, double>(path.ToString() + string.Join(",", visited.ToArray()) + "\n", flipCost);
            //}
            //else
            //{
            //    return new Tuple<string, double>(path.ToString() + string.Join(",", visited.ToArray()) + "\nNO SOLUTION\n", flipCost);
            //}

            return new Tuple<string, double>(path.ToString() + string.Join(",", visited.ToArray()) + "\nTime: " + goalStack.Count + 
                "\nFrontier: " + frontier + "\nExplored: " + visited.Count + "\n", flipCost);
        }

        public Tuple<string, double> runUCS()
        {
            StringBuilder path = new StringBuilder();
            int frontier = 0;

            Queue fringe = new Queue();
            List<int> visited = new List<int>();
            fringe.Enqueue(pancakeStack.IndexOf(pancakeStack.Max()));

            while (fringe.Count != 0)
            {
                if (fringe.Count > frontier)
                {
                    frontier = fringe.Count;
                }

                int dequeued = (int)fringe.Dequeue();
                visited.Insert(0, pancakeStack[dequeued]);
                flipFront(dequeued + 1);
                path.AppendLine(string.Join(",", pancakeStack.ToArray()));
                flipFront(pancakeStack.Count);
                pancakeStack.RemoveAt(pancakeStack.Count - 1);
                if (pancakeStack.Count != 0)
                {
                    fringe.Enqueue(pancakeStack.IndexOf(pancakeStack.Max()));
                }
                else
                {
                    flipFront(pancakeStack.Count);
                }
            }

            //if(isGoalState(visited))
            //{
            //    return new Tuple<string, double>(path.ToString() + string.Join(",", visited.ToArray()) + "\n", flipCost);
            //}
            //else
            //{
            //    return new Tuple<string, double>(path.ToString() + string.Join(",", visited.ToArray()) + "\nNO SOLUTION\n", flipCost);
            //}

            return new Tuple<string, double>(path.ToString() + string.Join(",", visited.ToArray()) + "\nTime: " + goalStack.Count +
                "\nFrontier: " + frontier + "\nExplored: " + visited.Count + "\n", flipCost);
        }

        public Tuple<string, double> startDFS()
        {
            Tuple<string, double> possiblePath = new Tuple<string, double>("", 0);
            bool isCutOff = false;
            int depth = 0;

            while (!isCutOff)
            {
                possiblePath = runIDDFS(depth, ref isCutOff);
                depth++;
            }

            return possiblePath;
        }

        public Tuple<string, double> runIDDFS(int depth, ref bool isCutOff)
        {
            StringBuilder path = new StringBuilder();
            int frontier = 0;
            int currentDepth = 0;
            int numberVisited = 0;

            Stack fringe = new Stack();
            List<int> visited = new List<int>();
            fringe.Push(pancakeStack.IndexOf(pancakeStack.Max()));

            while (fringe.Count != 0)
            {
                if (fringe.Count > frontier)
                {
                    frontier = fringe.Count;
                }

                int dequeued = (int)fringe.Pop();
                visited.Insert(0, pancakeStack[dequeued]);
                numberVisited++;
                currentDepth++;
                flipFront(dequeued + 1);
                path.AppendLine(string.Join(",", pancakeStack.ToArray()));
                flipFront(pancakeStack.Count);
                pancakeStack.RemoveAt(pancakeStack.Count - 1);

                if (pancakeStack.Count != 0)
                {
                    fringe.Push(pancakeStack.IndexOf(pancakeStack.Max()));
                }
                else
                {
                    flipFront(pancakeStack.Count);
                }

                if (numberVisited == goalStack.Count) //goal state is when all are visited
                {
                    isCutOff = true;
                }
                else if (depth == currentDepth)
                {
                    continue;
                }
            }

            return new Tuple<string, double>(path.ToString() + "Time: " + burntStack.Count.ToString() + "\nFrontier: " + frontier.ToString() +
                        "\nExplored: " + visited.Count + "\n", this.flipCost);
        }
    } 
}