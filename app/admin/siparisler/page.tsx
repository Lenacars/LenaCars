import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SiparislerPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Siparişler</h1>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Sipariş ara..." className="md:w-1/3" />
            <Select>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beklemede">Beklemede</SelectItem>
                <SelectItem value="onaylandi">Onaylandı</SelectItem>
                <SelectItem value="tamamlandi">Tamamlandı</SelectItem>
                <SelectItem value="iptal">İptal Edildi</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Ara</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sipariş Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Sipariş No</th>
                  <th className="text-left p-3">Müşteri</th>
                  <th className="text-left p-3">Araç</th>
                  <th className="text-left p-3">Tarih</th>
                  <th className="text-left p-3">Tutar</th>
                  <th className="text-left p-3">Durum</th>
                  <th className="text-left p-3">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">SIP-{1000 + i}</td>
                    <td className="p-3">Ahmet Yılmaz</td>
                    <td className="p-3">Toyota Corolla</td>
                    <td className="p-3">15.03.2023</td>
                    <td className="p-3">10,500 ₺</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          i % 3 === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : i % 3 === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {i % 3 === 0 ? "Beklemede" : i % 3 === 1 ? "Onaylandı" : "Tamamlandı"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Detay
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                          İptal
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

