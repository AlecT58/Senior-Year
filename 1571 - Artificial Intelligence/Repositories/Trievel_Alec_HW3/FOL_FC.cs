using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FOL_FC
{
    class FOL_FC
    {
        static void Main(string[] args)
        {
            List<String> lines = readFile(args[0]);

            String goal = "";
            List<String> facts = new List<String>();
            List<Sentence> sentences = new List<Sentence>();
            List<Sentence> knowledgeBase = new List<Sentence>();

            splitSentences(lines, ref goal, ref facts, ref sentences);

            for(int i = 0; i < sentences.Count; i++)
            {
                foreach (String aFact in facts)
                {
                    sentences[i] = unify(sentences[i], aFact);

                    if(sentences[i].allSubstiutionsMade() && !knowledgeBase.Contains(sentences[i]))
                    {
                        sentences[i].substituteRightHand();
                        knowledgeBase.Add(sentences[i]);
                    }
                } 
                
                for(int j = 0; j < knowledgeBase.Count; j++)
                {
                    sentences[i] = unify(sentences[i], knowledgeBase[j].rightHandAtom);

                    if (sentences[i].allSubstiutionsMade() && !knowledgeBase.Contains(sentences[i]))
                    {
                        sentences[i].substituteRightHand();
                        knowledgeBase.Add(sentences[i]);
                    }
                }
            }

            for (int i = 0; i < sentences.Count; i++)
            {
                for (int j = 0; j < knowledgeBase.Count; j++)
                {
                    sentences[i] = unify(sentences[i], knowledgeBase[j].rightHandAtom);

                    if (sentences[i].allSubstiutionsMade() && !knowledgeBase.Contains(sentences[i]))
                    {
                        sentences[i].substituteRightHand();
                        knowledgeBase.Add(sentences[i]);
                    }
                }
            }

            isGoalReached(goal, knowledgeBase);

            foreach(Sentence aSentence in knowledgeBase)
            {
                if(aSentence.rightHandAtom.Equals(goal))
                {
                    Console.WriteLine("Goal Reached: " + aSentence.rightHandAtom);
                    break;
                }
                else
                {
                    Console.WriteLine("Inference made: " + aSentence.rightHandAtom);
                }
            }

            Console.ReadLine();
        }

        private static List<String> readFile(String filename)
        {
            String line;
            List<String> lines = new List<String>();
            System.IO.StreamReader file = new System.IO.StreamReader(filename);

            while ((line = file.ReadLine()) != null)
            {
                lines.Add(line);
            }

            return lines;
        }

        private static List<String> getSentences()
        {
            List<String> lines = new List<String>();
            String line = "";

            while (!line.Contains("PROVE"))
            {
                Console.Write("Enter a sentence or PROVE to stop entering: ");
                line = Console.ReadLine();
                lines.Add(line);
            }

            return lines;
        }

        private static void splitSentences(List<String> lines, ref String goal, ref List<String> facts, ref List<Sentence> sentences)
        {
            foreach (String aLine in lines)
            {
                if(aLine.Contains("PROVE"))
                {
                    String[] lineSplit = Regex.Split(aLine, "PROVE");
                    goal = lineSplit[1].Trim();
                }
                else
                {
                    String[] lineSplit = Regex.Split(aLine, "->");

                    if(lineSplit.Length == 1)
                    {
                        facts.Add(lineSplit[0].Trim());
                    }
                    else if(lineSplit.Length == 2)
                    {
                        String[] atomsSplit = lineSplit[0].Split('^');
                        List<Atom> left = new List<Atom>();
                                                
                        foreach(String anAtom in atomsSplit)
                        {
                            String name = anAtom.Split('(')[0].Trim();
                            String[] variables = Regex.Match(anAtom, @"\(([^)]*)\)").Groups[1].Value.Split(',');
                            Atom newAtom = new Atom(name, variables);

                            left.Add(newAtom);
                        }

                        Sentence aSentence = new Sentence(left, lineSplit[1].Trim());
                        sentences.Add(aSentence);
                    }
                }
            }
        }

        private static Sentence unify(Sentence sentence, String fact)
        {
            Sentence returnVal = sentence;
            String[] variables = Regex.Match(fact, @"\(([^)]*)\)").Groups[1].Value.Split(',');
            String Atom = fact.Split('(')[0];

            for (int i = 0; i < sentence.leftHandAtoms.Count; i++)
            {
                if(sentence.leftHandAtoms[i].name.Contains(Atom))
                {
                    returnVal.leftHandAtoms[i].subVariables = variables;
                    returnVal.substituions[i] = true;
                }
            }

            return returnVal;
        }

        private static void isGoalReached(String goal, List<Sentence> knowledgeBase)
        {
            foreach (Sentence aSentence in knowledgeBase)
            {
                if (aSentence.rightHandAtom.Equals(goal))
                {
                    Console.WriteLine("Goal was reached? " + true);
                    return;
                }
            }
            Console.WriteLine("Goal was reached? " + false);
        }
    }

    class Sentence
    {
        public String rightHandAtom;
        public List<Atom> leftHandAtoms;
        public List<Boolean> substituions;

        public Sentence(List<Atom> left, String right)
        {
            this.rightHandAtom = right;
            this.leftHandAtoms = left;
            this.substituions = new List<Boolean>(this.leftHandAtoms.Count);
            
            for (int i = 0; i < leftHandAtoms.Count; i++)
            {
                substituions.Add(false);
            }
        }

        public Boolean allSubstiutionsMade()
        {
            for (int i = 0; i < substituions.Count; i++)
            {
                if(substituions[i] == false)
                {
                    return false;
                }
            }

            return true;
        }

        public void substituteRightHand()
        {
            for(int i = 0; i < leftHandAtoms.Count; i++)
            {
                String[] variables = leftHandAtoms[i].variables;
                for(int j = 0; j < variables.Length; j++)
                {
                    if (rightHandAtom.Contains(variables[j]))
                    {
                        String[] atomSplit = rightHandAtom.Split('(');
                        rightHandAtom = atomSplit[0] + "(" + atomSplit[1].Replace(variables[j], leftHandAtoms[i].subVariables[j]);
                    }
                }
            }
        }
    }

    class Atom
    {
        public String[] variables;
        public String[] subVariables;
        public String name;

        public Atom(String name, String[] variables)
        {
            this.name = name;
            this.variables = variables;
        }

        public override string ToString()
        {
            StringBuilder toString = new StringBuilder();
            for(int i = 0; i < subVariables.Length; i++)
            {
                toString.Append(subVariables[i]);
            }

            return name + "(" + toString.ToString() + ")";
        }
    }
} 