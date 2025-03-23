"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const monthlyData = [
  { name: "Oca", value: 45 },
  { name: "Şub", value: 52 },
  { name: "Mar", value: 61 },
  { name: "Nis", value: 58 },
  { name: "May", value: 65 },
  { name: "Haz", value: 78 },
  { name: "Tem", value: 85 },
  { name: "Ağu", value: 83 },
  { name: "Eyl", value: 75 },
  { name: "Eki", value: 68 },
  { name: "Kas", value: 72 },
  { name: "Ara", value: 79 },
];

const categoryData = [
  { name: "Ekonomik", value: 35 },
  { name: "Orta Sınıf", value: 45 },
  { name: "Premium", value: 25 },
  { name: "SUV", value: 30 },
  { name: "Elektrikli", value: 15 },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kiralama</CardTitle>
            <CardDescription>Tüm zamanlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> geçen aya göre
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktif Kiralama</CardTitle>
            <CardDescription>Şu an devam eden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8%</span> geçen aya göre
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Araç</CardTitle>
            <CardDescription>Filodaki araçlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5</span> yeni araç eklendi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Üye</CardTitle>
            <CardDescription>Kayıtlı üyeler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,845</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+18%</span> geçen aya göre
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Grafikler */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
          <TabsTrigger value="reports">Raporlar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Aylık Kiralama</CardTitle>

              <CardDescription>Son 12 ay</CardDescription>

              <CardDescription>Son 12 aydaki kiralama sayıları</CardDescription>

            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#5d3b8b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Kategori Dağılımı</CardTitle>

              <CardDescription>Filodaki kategori oranı</CardDescription>

              <CardDescription>Araç kategorilerine göre kiralama dağılımı</CardDescription>

            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#5d3b8b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Gelir Trendi</CardTitle>

              <CardDescription>Son 12 ayda kazanç</CardDescription>

              <CardDescription>Son 12 aydaki gelir trendi</CardDescription>

            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#5d3b8b" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Son İşlemler */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Kiralamalar</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Ahmet Yılmaz</p>
                    <p className="text-sm text-muted-foreground">
                      Toyota Corolla - 3 Ay
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">10.500 ₺</p>

                    <p className="text-sm text-muted-foreground">Toyota Corolla - 3 Ay</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">10,500 ₺</p>

                    <p className="text-sm text-muted-foreground">15.03.2023</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Son Yorumlar</CardTitle>
            <CardDescription>Son 5 müşteri yorumu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">Mehmet Kaya</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={star <= 4 ? "gold" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-yellow-400"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Çok memnun kaldım, araç temiz ve bakımlıydı. Teşekkürler.
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
  );
} 