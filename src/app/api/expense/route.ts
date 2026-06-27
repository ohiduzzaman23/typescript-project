import { connect } from "@/app/lib/dbConnect";

const expenseCollection = connect("spendly");

export async function GET() {
  const result = await expenseCollection.find().toArray();
  return Response.json({ result });
}

export async function POST(request: Request) {
  const expense = await request.json();

  const result = await expenseCollection.insertOne(expense);

  return Response.json({ result });
}
