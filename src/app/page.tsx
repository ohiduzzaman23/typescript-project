"use client";
import Items from "@/components/Items";
import BasicPie from "@/components/PieChart";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const [filterCategory, setFilterCategory] = useState("All categories");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/expense")
      .then((res) => res.json())
      .then((data) => setExpenses(data.result));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const data = {
      title,
      amount: Number(amount),
      category,
      date,
    };

    if (editingId) {
      // Update
      const res = await fetch(`/api/expense/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (resData.result.modifiedCount > 0) {
        Swal.fire({
          title: "Updated!",
          text: "Expense updated successfully.",
          icon: "success",
        });
        setExpenses((prev) =>
          prev.map((item) =>
            item._id === editingId ? { ...item, ...data } : item,
          ),
        );

        setEditingId(null);
        setTitle("");
        setAmount("");
        setCategory("Food");
        setDate("");
      }

      return;
    }

    const res = await fetch("http://localhost:3000/api/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (resData.result?.insertedId) {
      const newExpense: Expense = {
        _id: resData.result.insertedId,
        title: String(title),
        amount: Number(amount),
        category: String(category),
        date: String(date),
      };

      setExpenses((prev) => [...prev, newExpense]);

      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate("");

      Swal.fire("Success!", "Expense added successfully.", "success");

      form.reset();
      alert("Success");
    }
  };

  const filteredExpenses = expenses.filter((item) => {
    const categoryMatch =
      filterCategory === "All categories" || item.category === filterCategory;

    const itemDate = new Date(item.date);

    const fromMatch = !fromDate || itemDate >= new Date(fromDate);

    const toMatch = !toDate || itemDate <= new Date(toDate);

    return categoryMatch && fromMatch && toMatch;
  });

  const totalAmount = filteredExpenses.reduce(
    (total, item) => total + Number(item.amount),
    0,
  );

  // Delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    const res = await fetch(`/api/expense/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.result.deletedCount > 0) {
      setExpenses((prev) => prev.filter((item) => item._id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "Expense has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // update
  const handleUpdate = (id: string) => {
    const expense = expenses.find((item) => item._id === id);

    if (!expense) return;

    setEditingId(id);
    setTitle(expense.title);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setDate(expense.date);
  };

  return (
    <main className="min-h-screen py-15 px-30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl">
            💳
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-900">Spendly</h1>
            <p className="text-slate-500">Track where your money goes.</p>
          </div>
        </div>

        {/* Top Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Total Card */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <p className="text-slate-500 text-sm mb-4">↗ Total spent</p>

            <h2 className="text-3xl font-bold text-slate-900">
              US${totalAmount.toFixed(2)}
            </h2>
            <p className="text-slate-400 mt-2">Across 0 entries</p>
          </div>

          {/* Category Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-6">
            <h3 className="font-semibold text-slate-700 mb-6">By category</h3>

            <div className=" flex items-center justify-center text-slate-400">
              <BasicPie expenses={filteredExpenses} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Add Expense */}
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6">Add expense</h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      onInvalid={(e) =>
                        e.currentTarget.setCustomValidity("Title is required")
                      }
                      onInput={(e) => e.currentTarget.setCustomValidity("")}
                      placeholder="Coffee with team"
                      className="w-full mt-2 px-4 py-3 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full mt-2 px-4 py-3 rounded-xl shadow-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full mt-2 px-4 py-3 rounded-xl shadow-sm outline-none "
                      >
                        <option>Food</option>
                        <option>Transport</option>
                        <option>Shopping</option>
                        <option>Bills</option>
                        <option>Entertainment</option>
                        <option>Others</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full mt-2 px-4 py-3 rounded-xl shadow-sm outline-none"
                    />
                  </div>

                  <button className="w-full bg-slate-900 text-white py-3 rounded-xl">
                    {editingId ? "Update Expense" : "Add Expense"}
                  </button>
                </div>
              </form>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-3xl shadow-sm shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-6">Filters</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Category</label>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl shadow-sm"
                  >
                    <option>All categories</option>
                    <option>Food</option>
                    <option>Transport</option>
                    <option>Shopping</option>
                    <option>Bills</option>
                    <option>Entertainment</option>
                    <option>Others</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">From</label>

                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full mt-2 px-4 py-3 rounded-xl shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">To</label>

                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full mt-2 px-4 py-3 rounded-xl shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm p-6 min-h-[620px]">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-semibold">Expenses</h3>
                  <p className="text-slate-400">
                    {filteredExpenses.length} entries shown
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase text-slate-400">
                    Filtered Total
                  </p>

                  <h3 className="text-2xl font-bold">
                    US${totalAmount.toFixed(2)}
                  </h3>
                </div>
              </div>

              <div className=" flex flex-col">
                {[...filteredExpenses].reverse().map((item) => (
                  <Items
                    key={item._id}
                    item={item}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
