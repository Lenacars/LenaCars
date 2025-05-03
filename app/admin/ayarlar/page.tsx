import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function AyarlarPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Ayarlar</h1>

      <Tabs defaultValue="genel" className="mb-8">
        <TabsList>
          <TabsTrigger value="genel">Genel</TabsTrigger>
          <TabsTrigger value="iletisim">İletişim</TabsTrigger>
          <TabsTrigger value="sosyal">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="genel">
          <Card>
            <CardHeader>
              <CardTitle>Genel Ayarlar</CardTitle>
              <CardDescription>Site ile ilgili genel ayarları buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Adı</Label>
                <Input id="site-name" defaultValue="LenaCars" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Açıklaması</Label>
                <Textarea
                  id="site-description"
                  defaultValue="Kurumsal araç kiralama adımlarını LenaCars uzmanlığı ile tek bir ekranda çözebileceğiniz, yüzlerce araç seçeneğine ve en uygun fiyatlara hızlıca ulaşabileceğiniz online tabanlı araç kiralama platformu."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <Input id="logo" type="file" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <Input id="favicon" type="file" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="iletisim">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Ayarları</CardTitle>
              <CardDescription>İletişim bilgilerinizi buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" type="email" defaultValue="info@lenacars.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" defaultValue="+90 850 532 7929" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobil Telefon</Label>
                <Input id="mobile" defaultValue="+90 537 777 7929" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea id="address" defaultValue="İstanbul, Türkiye" rows={3} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sosyal">
          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya Ayarları</CardTitle>
              <CardDescription>Sosyal medya hesaplarınızı buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" defaultValue="https://facebook.com/lenacars" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" defaultValue="https://instagram.com/lenacars" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" defaultValue="https://twitter.com/lenacars" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" defaultValue="https://linkedin.com/company/lenacars" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input id="youtube" defaultValue="https://youtube.com/lenacars" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Ayarları</CardTitle>
              <CardDescription>SEO ayarlarınızı buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Başlık</Label>
                <Input id="meta-title" defaultValue="LenaCars - Kurumsal Araç Kiralama Çözümleri" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Açıklama</Label>
                <Textarea
                  id="meta-description"
                  defaultValue="Kurumsal araç kiralama adımlarını LenaCars uzmanlığı ile tek bir ekranda çözebileceğiniz, yüzlerce araç seçeneğine ve en uygun fiyatlara hızlıca ulaşabileceğiniz online tabanlı araç kiralama platformu."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Meta Anahtar Kelimeler</Label>
                <Textarea
                  id="meta-keywords"
                  defaultValue="araç kiralama, kurumsal araç kiralama, filo kiralama, uzun dönem araç kiralama, kısa dönem araç kiralama"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-analytics">Google Analytics Kodu</Label>
                <Input id="google-analytics" placeholder="UA-XXXXXXXXX-X" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#5d3b8b] hover:bg-[#4a2e70]">Kaydet</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

