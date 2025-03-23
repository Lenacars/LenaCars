import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function YorumlarPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Yorumlar</h1>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Yorum ara..." className="md:w-1/3" />
            <Select>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onay-bekliyor">Onay Bekliyor</SelectItem>
                <SelectItem value="onaylandi">Onaylandı</SelectItem>
                <SelectItem value="reddedildi">Reddedildi</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Ara</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yorum Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Müşteri</th>
                  <th className="text-left p-3">Araç</th>
                  <th className="text-left p-3">Yorum</th>
                  <th className="text-left p-3">Puan</th>
                  <th className="text-left p-3">Tarih</th>
                  <th className="text-left p-3">Durum</th>
                  <th className="text-left p-3">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{i}</td>
                    <td className="p-3">Mehmet Kaya</td>
                    <td className="p-3">Toyota Corolla</td>
                    <td className="p-3 max-w-xs truncate">Çok memnun kaldım, araç temiz ve bakımlıydı. Teşekkürler.</td>
                    <td className="p-3">
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
                    </td>
                    <td className="p-3">15.03.2023</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          i % 3 === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : i % 3 === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {i % 3 === 0 ? "Onay Bekliyor" : i % 3 === 1 ? "Onaylandı" : "Reddedildi"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Onayla
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                          Reddet
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

