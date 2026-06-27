import { connect } from "@/app/lib/dbConnect";
import { ObjectId } from "mongodb";

const expenseCollection = connect("spendly");

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const result = await expenseCollection.deleteOne({
    _id: new ObjectId(id),
  });

  return Response.json({ result });
}

// UPDATE
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const body = await request.json();

  const result = await expenseCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        title: body.title,
        amount: body.amount,
        category: body.category,
        date: body.date,
      },
    },
  );

  return Response.json({ result });
}
