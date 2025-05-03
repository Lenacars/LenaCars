import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UyelerPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Üyeler</h1>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input placeholder="Üye ara..." className="md:w-1/3" />
            <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Ara</Button>
            <Button variant="outline" className="ml-auto">
              Yeni Üye Ekle
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Üye Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Ad Soyad</th>
                  <th className="text-left p-3">E-posta</th>
                  <th className="text-left p-3">Telefon</th>
                  <th className="text-left p-3">Kayıt Tarihi</th>
                  <th className="text-left p-3">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{i}</td>
                    <td className="p-3">Ahmet Yılmaz</td>
                    <td className="p-3">ahmet.yilmaz@example.com</td>
                    <td className="p-3">+90 555 123 4567</td>
                    <td className="p-3">15.03.2023</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Düzenle
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                          Sil
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

