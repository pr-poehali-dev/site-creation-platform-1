import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [htmlCode, setHtmlCode] = useState('<h1>Hello World</h1>');
  const [cssCode, setCssCode] = useState('h1 { color: #0EA5E9; }');
  const [jsCode, setJsCode] = useState('console.log("Hello!");');
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePublish = () => {
    const projectId = Math.random().toString(36).substring(7);
    const publishUrl = `https://yoursite-${projectId}.poehali.dev`;
    
    toast.success('Сайт опубликован!', {
      description: publishUrl,
      duration: 5000,
    });
    
    navigator.clipboard.writeText(publishUrl);
  };

  const getPreviewContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-glow">
              <Icon name="Code2" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              CodeStudio
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 transition-all duration-300"
              onClick={() => window.open('https://t.me/plutstudio', '_blank')}
            >
              <Icon name="Send" size={18} className="mr-2" />
              Telegram
            </Button>
            <Button
              onClick={handlePublish}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 animate-glow"
            >
              <Icon name="Globe" size={18} className="mr-2" />
              Опубликовать
            </Button>
          </div>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Icon name="Menu" size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-card border-border animate-slide-in-right">
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  variant="ghost"
                  className="justify-start hover:bg-primary/10 transition-all duration-300"
                  onClick={() => {
                    window.open('https://t.me/plutstudio', '_blank');
                    setMenuOpen(false);
                  }}
                >
                  <Icon name="Send" size={18} className="mr-2" />
                  Telegram
                </Button>
                <Button
                  onClick={() => {
                    handlePublish();
                    setMenuOpen(false);
                  }}
                  className="justify-start bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
                >
                  <Icon name="Globe" size={18} className="mr-2" />
                  Опубликовать
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          <Card className="p-6 bg-card border-border shadow-xl animate-fade-in">
            <Tabs defaultValue="html" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 mb-4">
                <TabsTrigger 
                  value="html" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  <Icon name="FileCode2" size={16} className="mr-2" />
                  HTML
                </TabsTrigger>
                <TabsTrigger 
                  value="css"
                  className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all duration-300"
                >
                  <Icon name="Palette" size={16} className="mr-2" />
                  CSS
                </TabsTrigger>
                <TabsTrigger 
                  value="js"
                  className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-300"
                >
                  <Icon name="Braces" size={16} className="mr-2" />
                  JS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="flex-1 mt-0">
                <Textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="h-full font-mono text-sm bg-muted/30 border-border resize-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  placeholder="Введите HTML код..."
                />
              </TabsContent>

              <TabsContent value="css" className="flex-1 mt-0">
                <Textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="h-full font-mono text-sm bg-muted/30 border-border resize-none focus:ring-2 focus:ring-secondary transition-all duration-300"
                  placeholder="Введите CSS код..."
                />
              </TabsContent>

              <TabsContent value="js" className="flex-1 mt-0">
                <Textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className="h-full font-mono text-sm bg-muted/30 border-border resize-none focus:ring-2 focus:ring-accent transition-all duration-300"
                  placeholder="Введите JavaScript код..."
                />
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6 bg-card border-border shadow-xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Icon name="Monitor" size={20} className="text-primary" />
                Превью
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/50 hover:bg-primary/10 transition-all duration-300"
                onClick={() => {
                  const preview = document.getElementById('preview') as HTMLIFrameElement;
                  if (preview) {
                    preview.srcdoc = getPreviewContent();
                  }
                }}
              >
                <Icon name="RotateCw" size={16} className="mr-2" />
                Обновить
              </Button>
            </div>

            <div className="h-[calc(100%-60px)] border-2 border-border rounded-lg overflow-hidden bg-white">
              <iframe
                id="preview"
                srcDoc={getPreviewContent()}
                className="w-full h-full"
                title="Preview"
                sandbox="allow-scripts"
              />
            </div>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <Card className="p-4 bg-card/50 border-border hover:border-primary transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Файлов</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-border hover:border-secondary transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-secondary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Icon name="Eye" size={20} className="text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Просмотров</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-border hover:border-accent transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-accent/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Обновлено</p>
                <p className="text-xl font-bold">Сейчас</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-border hover:border-primary transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Sparkles" size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Статус</p>
                <p className="text-xl font-bold">Live</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
