using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vko.Repository
{
    public class Statement
    {
        public virtual Statement[] Statements
        {
            get { return new Statement[] { this }; }
        }
        public override string ToString()
        {
            return "";
        }
    }

    public class ValueStatement : Statement
    {
        object value;
        public ValueStatement(object value)
        {
            this.value = value;
        }
        public override string ToString()
        {
            return System.Convert.ToString(this.value);
        }
    }

    public class NameStatement : Statement
    {
        private string name;
        public NameStatement(string name)
        {
            this.name = name;
        }

        public override string ToString()
        {
            return System.Convert.ToString(this.name);
        }
    }

    public class EqStatement : Statement
    {
        Statement left;
        Statement right;
        public EqStatement(Statement left, Statement right)
        {
            this.left = left;
            this.right = right;
        }

        public override Statement[] Statements
        {
            get { return new Statement[] { this.left, this.right }; }
        }

        public override string ToString()
        {
            return left.ToString() + "=" + right.ToString();
        }
    }

    public class AndStatement : Statement
    {
        List<Statement> statements;
        public AndStatement(Statement[] statements)
        {
            this.statements = new List<Statement>(statements);
        }
        public override string ToString()
        {
            return "(" + string.Join(" AND ", statements.Select(x => x.ToString())) + ")";
        }
    }
    public class OrStatement : Statement
    {
        List<Statement> statements;
        public OrStatement(Statement[] statements)
        {
            this.statements = new List<Statement>(statements);
        }
        public override string ToString()
        {
            return "(" + string.Join(" OR ", statements.Select(x => x.ToString())) + ")";
        }
    }

    public class InStatement : Statement
    {
        List<Statement> statements;
        private NameStatement name;
        public InStatement(ValueStatement[] statements)
        {
            this.name = new NameStatement("");
            this.statements = new List<Statement>(statements);
        }
        public InStatement(NameStatement name, ValueStatement[] statements)
        {
            this.name = name;
            this.statements = new List<Statement>(statements);
        }
        public override string ToString()
        {
            return this.name.ToString() + " IN (" + string.Join(", ", statements.Select(x => x.ToString())) + ")";
        }
    }

    public class OrderByStatement : Statement
    {
        Statement name;
        Statement order;
        public OrderByStatement(Statement name, Statement order)
        {
            this.name = name;
            this.order = order;
        }
        public override string ToString()
        {
            return " ORDER BY " + name.ToString() + " " + order.ToString();
        }
    }

    public class ExpressionStatement : Statement
    {
        List<Statement> statements;
        public ExpressionStatement(Statement[] statements)
        {
            this.statements = new List<Statement>(statements);
        }
        public override Statement[] Statements
        {
            get
            {
                return this.statements.ToArray();
            }
        }
        public override string ToString()
        {
            return string.Join(" ", statements.Select(x => x.ToString()));
        }
    }

    public class WhereStatements
    {
        public static Dictionary<TKey, TValue> Merge<TKey, TValue>(params Dictionary<TKey, TValue>[] dictionaries)
        {
            var result = new Dictionary<TKey, TValue>();
            foreach (var dict in dictionaries)
                foreach (var x in dict)
                    result[x.Key] = x.Value;
            return result;
        }

        public static Tuple<Statement, Dictionary<string, object>> Parse<T>(T args, int level)
        {
            if (level > 20)
            {
                throw new Exception("sorry something wrong");
            }
            Type t = args.GetType();
            var props = t.GetProperties().ToArray();
            var expr = new List<Statement>();
            var paramList = new Dictionary<string, object>();
            foreach (var prop in props)
            {
                var value = prop.GetValue(args);
                if (prop.Name == "search")
                {
                    expr.Add(Name("{0} "));
                    paramList = Merge(paramList, new Dictionary<string, object>() {
                        { ":search", "%" + Convert.ToString(prop.GetValue(args)) + "%" },
                        { ":searchExact", prop.GetValue(args) }
                    });
                }
                else if (prop.Name == "__in")
                {
                    var inValue = value as IEnumerable;
                    var inValues = inValue.Cast<object>()
                    .Select(x => "'" + Convert.ToString(x) + "'")
                    .ToArray();
                    return Tuple.Create(In(inValues), new Dictionary<string, object>());
                }
                else if (prop.Name == "__and")
                {
                    if (value is IEnumerable)
                    {
                        throw new Exception("Sorry: __and isn't implemented yet");
                    }
                    var __endRes = Parse(value, level + 1);
                    expr.Add(And(__endRes.Item1.Statements));
                    paramList = Merge(paramList, __endRes.Item2);
                }
                else if (prop.Name == "__or")
                {
                    if (value is IEnumerable)
                    {
                        throw new Exception("Sorry: __and isn't implemented yet");
                    }
                    var __endRes = Parse(value, level + 1);
                    expr.Add(new OrStatement(__endRes.Item1.Statements));
                    paramList = Merge(paramList, __endRes.Item2);
                }
                else if (value.GetType().IsPrimitive())
                {
                    expr.Add(Eq(prop.Name, Val(":" + prop.Name)));
                    paramList = Merge(paramList, new Dictionary<string, object>() { { ":" + prop.Name, prop.GetValue(args) } });
                }
                else
                {
                    var res = Parse(value, level + 1);
                    expr.Add(Expr(Name(prop.Name), res.Item1));
                    paramList = Merge(paramList, res.Item2);
                }
            }

            return Tuple.Create((Statement)new ExpressionStatement(expr.ToArray()), paramList);
        }

        public static Tuple<string, Dictionary<string, object>> FromArgs<T>(T args)
        {

            var result = Parse(args, 0);

            return Tuple.Create(result.Item1.ToString(), result.Item2);
        }

        public static ValueStatement Val(object val)
        {
            return new ValueStatement(val);
        }
        public static NameStatement Name(string val)
        {
            return new NameStatement(val);
        }
        public static Statement Eq(string name, object value)
        {
            return new EqStatement(Val(name), Val(value));
        }
        public static Statement Eq(string name, Statement stmt)
        {
            return new EqStatement(Val(name), stmt);
        }
        public static Statement And(Statement[] args)
        {
            return new AndStatement(args);
        }
        public static Statement In<T>(NameStatement name, params T[] args)
        {
            return new InStatement(name, new List<T>(args).Select(x => Val(x)).ToArray());
        }
        public static Statement In<T>(params T[] args)
        {
            IEnumerable<ValueStatement> items = new List<T>(args).Select(x => Val(x));
            return new InStatement(items.ToArray());
        }
        public static Statement Expr(params Statement[] args)
        {
            return new ExpressionStatement(args);
        }
        public static Statement OrderBy(string name, Statement order)
        {
            return new OrderByStatement(Val(name), order);
        }
        public static Statement Desc()
        {
            return Val("DESC");
        }
    }
}