using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;


namespace Rebelmouse.jira {
    public class Statement {
        public override string ToString() {
            return "";
        }
    }
    public class ValueStatement: Statement {
        object value;
        public ValueStatement(object value) {
            this.value = value;
        }
        public override string ToString() {
            return System.Convert.ToString(this.value);
        }
    }
    public class NameStatement: Statement {
        string name;
        public NameStatement(string name) {
            this.name = name;
        }
        public override string ToString() {
            return System.Convert.ToString(this.name);
        }
    }
    public class EqStatement: Statement {
        Statement left;
        Statement right;
        public EqStatement(Statement left, Statement right) {
            this.left = left;
            this.right = right;
        }
        public override string ToString() {
            return left.ToString() + "=" + right.ToString();
        }
    }
    public class AndStatement: Statement {
        List<Statement> statements;
        public AndStatement(Statement[] statements) {
            this.statements = new List<Statement>(statements);
        }
        public override string ToString() {
            return string.Join(" AND ", statements.Select(x => x.ToString()));
        }
    }
    public class OrStatement: Statement {
        List<Statement> statements;
        public OrStatement(Statement[] statements) {
            this.statements = new List<Statement>(statements);
        }
        public override string ToString() {
            return string.Join(" OR ", statements.Select(x => x.ToString()));
        }
    }
    public class InStatement: Statement {
        List<Statement> statements;
        NameStatement name;
        public InStatement(ValueStatement[] statements) {
            this.name = new NameStatement("");
            this.statements = new List<Statement>(statements);
        }
        public InStatement(NameStatement name, ValueStatement[] statements) {
            this.name = name;
            this.statements = new List<Statement>(statements);
        }
        public override string ToString() {
            return this.name.ToString() + " IN (" + string.Join(", ", statements.Select(x => x.ToString())) + ")";
        }
    }
    public class OrderByStatement: Statement {
        Statement name;
        Statement order;
        public OrderByStatement(Statement name, Statement order) {
            this.name = name;
            this.order = order;
        }
        public override string ToString() {
            return " ORDER BY " + name.ToString() + " " + order.ToString();
        }
    }
    public class ExpressionStatement: Statement {
        List<Statement> statements;
        public ExpressionStatement(Statement[] statements) {
            this.statements = new List<Statement>(statements);
        }
        public override string ToString() {
            return string.Join(" ", statements.Select(x => x.ToString()));
        }
    }
	public class BaseManager {
        public static ValueStatement Val(object val) {
            return new ValueStatement(val);
        }
        public static NameStatement Name(string val) {
            return new NameStatement(val);
        }
        public static Statement Eq(string name, object value) {
            return new EqStatement(Val(name), Val(value));
        }
        public static Statement Eq(string name, Statement stmt) {
            return new EqStatement(Val(name), stmt);
        }
        public static Statement And(params Statement[] args) {
            return new AndStatement(args);
        }
        public static Statement In<T>(NameStatement name, params T[] args) {
            return new InStatement(name, new List<T>(args).Select(x => Val(x)).ToArray());
        }
        public static Statement In<T>(params T[] args) {
            IEnumerable<ValueStatement> items = new List<T>(args).Select(x => Val(x));
            return new InStatement(items.ToArray());
        }
        public static Statement Expr(params Statement[] args) {
            return new ExpressionStatement(args);
        }
        public static Statement OrderBy(string name, Statement order) {
            return new OrderByStatement(Val(name), order);
        }
        public static Statement Desc() {
            return Val("DESC");
        }
	}
}