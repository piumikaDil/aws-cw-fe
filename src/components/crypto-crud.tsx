/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, Coins } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Banner from "./ui/banner";

interface Crypto {
  coinId: string;
  name: string;
  symbol: string;
  price: number;
}
function validatePrice(value: string) {
  if (/^\d*\.?\d*$/.test(value) === false) {
    return;
  }
}
export function CryptoCrud() {
  async function fetchAllCoins() {
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL+'searchAll');
      setCryptos(response.data.data);
    } catch (error) {
      console.log('Something went wrong', error);
      toast.error("No coins to display, Start by adding new Coins.");
    }
  }
  useEffect(() => {
    fetchAllCoins();
  }, []);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [newCrypto, setNewCrypto] = useState<Crypto>({
    coinId: "",
    name: "",
    symbol: "",
    price: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div>
        <Toaster />
      </div>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
          <Coins className="h-8 w-8 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Coinbase</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Cryptocurrency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="CoinID"
                value={newCrypto.coinId}
                onChange={(e) =>
                  setNewCrypto({ ...newCrypto, coinId: e.target.value })
                }
              />
              <Input
                placeholder="Name"
                value={newCrypto.name}
                onChange={(e) =>
                  setNewCrypto({ ...newCrypto, name: e.target.value })
                }
              />
              <Input
                placeholder="Symbol"
                value={newCrypto.symbol}
                onChange={(e) =>
                  setNewCrypto({ ...newCrypto, symbol: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={newCrypto.price}
                onChange={(e) => {
                  validatePrice(e.target.value);
                  setNewCrypto({
                    ...newCrypto,
                    price: parseFloat(e.target.value),
                  });
                }}
              />
              <Button
                onClick={async () => {
                  if (
                    cryptos.find(
                      (crypto) => crypto.coinId === newCrypto.coinId
                    ) ||
                    cryptos.find((crypto) => crypto.name === newCrypto.name)
                  ) {
                    toast.error("Coin already exists!");
                    return;
                  } else if (
                    newCrypto.coinId === "" ||
                    newCrypto.name === "" ||
                    newCrypto.symbol === "" ||
                    newCrypto.price === 0
                  ) {
                    toast.error("Please fill all the fields!");
                    return;
                  }
                  setCryptos([...cryptos, newCrypto]);
                  try {
                    const res = await axios.post(import.meta.env.VITE_BASE_URL+"add",newCrypto);
                    console.log(res.data);
                    if (res.data.statusCode === 201) {
                      return toast.success("Coin Added Successfully");
                    }
                  } catch (error) {
                    console.error("Error adding coin:", error);
                    toast.error("Something went wrong!");
                  }
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Crypto
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          {/* {cryptos.length === 0 ? <Banner /> : null} */}
          <CardHeader>
            <CardTitle>Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CoinId</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cryptos.length > 0 ? (
                  <>
                    {cryptos.map((crypto) => (
                      <TableRow key={crypto.coinId}>
                        <TableCell>
                          {editingId === crypto.coinId ? (
                            <Input value={crypto.coinId} />
                          ) : (
                            crypto.coinId
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === crypto.coinId ? (
                            <Input
                              onChange={(e) => {
                                setNewCrypto({
                                  ...newCrypto,
                                  name: e.target.value,
                                });
                              }}
                            />
                          ) : (
                            crypto.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === crypto.coinId ? (
                            <Input
                              onChange={(e) => {
                                setNewCrypto({
                                  ...newCrypto,
                                  symbol: e.target.value,
                                });
                              }}
                            />
                          ) : (
                            crypto.symbol
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === crypto.coinId ? (
                            <Input
                              type="number"
                              onKeyDown={(e) => {
                                if (!/[0-9.]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                setNewCrypto({
                                  ...newCrypto,
                                  price: parseFloat(e.target.value),
                                });
                              }}
                            />
                          ) : (
                            `$${crypto.price.toFixed(2)}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === crypto.coinId ? (
                            <Button
                              onClick={async () => {
                                setEditingId(null);
                                setNewCrypto({
                                  ...newCrypto,
                                  coinId: crypto.coinId,
                                });
                                console.log("newCrypto", newCrypto);
                                if (
                                  newCrypto.coinId === "" ||
                                  newCrypto.name === "" ||
                                  newCrypto.symbol === "" ||
                                  newCrypto.price === 0
                                ) {
                                  toast.error("Please fill all the fields!");
                                  return;
                                }

                                try {
                                  const res = await axios.put(
                                    import.meta.env.VITE_BASE_URL+"update",
                                    newCrypto
                                  );
                                  console.log(res.data);
                                  if (res.data.statusCode === 200) {
                                    fetchAllCoins();

                                    return toast.success(
                                      "Coin updated Successfully"
                                    );
                                  }
                                } catch (error) {
                                  console.error("Error adding coin:", error);
                                  toast.error("Something went wrong!");
                                }
                              }}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              onClick={() => setEditingId(crypto.coinId)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost">
                            <Trash2
                              className="h-4 w-4 text-red-500"
                              onClick={async () => {
                                try {
                                  const res = await axios.delete(import.meta.env.VITE_BASE_URL+"delete?id="+crypto.coinId);
                                  if (res.data.statusCode === 200)
                                    setCryptos((prevCryptos) =>
                                      prevCryptos.filter(
                                        (coin) => coin.coinId !== crypto.coinId
                                      )
                                    );
                                  {
                                    toast.success("Coin Deleted Successfully");
                                  }
                                } catch (error: unknown) {
                                  console.error("Error deleting coin:", error);
                                  toast.error("Something went wrong!");
                                }
                              }}
                            />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                 ) : null} 
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
