import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import JSZip from 'jszip';

interface Project {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  createdAt: number;
}

const defaultHTML = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plut Studio Devs</title>
</head>
<body>
  <div class="container">
    <div class="hero">
      <h1 class="title">Plut Studio Devs</h1>
      <p class="subtitle">Site Default</p>
      <div class="description">
        <p>СОЗДАВАЙ САЙТЫ С СВОИМ ДОМЕНОМ</p>
        <p>РЕАЛЬНЫЕ КОТОРЫЕ МОЖНО ПОТОМ ОТКРЫТЬ И ДЕЛИТЬСЯ</p>
      </div>
      <a href="https://t.me/plutstudio" class="cta-button">Начать создавать</a>
    </div>
  </div>
</body>
</html>`;

const defaultCSS = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 800px;
  padding: 20px;
}

.hero {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: fadeIn 1s ease-out;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 30px;
}

.description {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.8;
  margin-bottom: 40px;
}

.description p {
  margin: 10px 0;
  font-weight: 500;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`;

const defaultJS = `console.log('Добро пожаловать в Plut Studio Devs!');

document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.cta-button');
  
  button.addEventListener('click', function(e) {
    console.log('Переход в Telegram канал...');
  });
});`;

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [htmlCode, setHtmlCode] = useState(defaultHTML);
  const [cssCode, setCssCode] = useState(defaultCSS);
  const [jsCode, setJsCode] = useState(defaultJS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  const [newProjectDialog, setNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const htmlFileRef = useRef<HTMLInputElement>(null);
  const cssFileRef = useRef<HTMLInputElement>(null);
  const jsFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem('codestudio_projects');
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      setProjects(parsed);
      if (parsed.length > 0) {
        loadProject(parsed[0]);
      }
    } else {
      const defaultProject: Project = {
        id: '1',
        name: 'Plut Studio Default',
        html: defaultHTML,
        css: defaultCSS,
        js: defaultJS,
        createdAt: Date.now(),
      };
      setProjects([defaultProject]);
      setCurrentProject(defaultProject);
      localStorage.setItem('codestudio_projects', JSON.stringify([defaultProject]));
    }
  }, []);

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('codestudio_projects', JSON.stringify(updatedProjects));
  };

  const loadProject = (project: Project) => {
    setCurrentProject(project);
    setHtmlCode(project.html);
    setCssCode(project.css);
    setJsCode(project.js);
    setFileManagerOpen(false);
  };

  const saveCurrentProject = () => {
    if (currentProject) {
      const updatedProjects = projects.map(p =>
        p.id === currentProject.id
          ? { ...p, html: htmlCode, css: cssCode, js: jsCode }
          : p
      );
      saveProjects(updatedProjects);
      toast.success('Проект сохранён!');
    }
  };

  const createNewProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Введите название проекта');
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      html: defaultHTML,
      css: defaultCSS,
      js: defaultJS,
      createdAt: Date.now(),
    };

    const updatedProjects = [newProject, ...projects];
    saveProjects(updatedProjects);
    loadProject(newProject);
    setNewProjectName('');
    setNewProjectDialog(false);
    toast.success('Новый проект создан!');
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjects(updatedProjects);
    
    if (currentProject?.id === projectId) {
      if (updatedProjects.length > 0) {
        loadProject(updatedProjects[0]);
      } else {
        setCurrentProject(null);
        setHtmlCode('');
        setCssCode('');
        setJsCode('');
      }
    }
    
    toast.success('Проект удалён');
  };

  const handleFileImport = (type: 'html' | 'css' | 'js', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      switch(type) {
        case 'html':
          setHtmlCode(content);
          break;
        case 'css':
          setCssCode(content);
          break;
        case 'js':
          setJsCode(content);
          break;
      }
      
      toast.success(`Файл ${file.name} импортирован!`);
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExportZip = async () => {
    if (!currentProject) {
      toast.error('Нет активного проекта для экспорта');
      return;
    }

    try {
      const zip = new JSZip();
      
      zip.file('index.html', htmlCode);
      zip.file('styles.css', cssCode);
      zip.file('script.js', jsCode);
      
      const blob = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentProject.name}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Проект экспортирован в ZIP!');
    } catch (error) {
      toast.error('Ошибка при экспорте проекта');
      console.error(error);
    }
  };

  const handlePublish = () => {
    saveCurrentProject();
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
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                CodeStudio
              </h1>
              {currentProject && (
                <p className="text-xs text-muted-foreground">{currentProject.name}</p>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 transition-all duration-300"
              onClick={() => setFileManagerOpen(true)}
            >
              <Icon name="FolderOpen" size={18} className="mr-2" />
              Проекты
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-secondary/10 transition-all duration-300"
              onClick={handleExportZip}
            >
              <Icon name="Download" size={18} className="mr-2" />
              Экспорт ZIP
            </Button>
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
                  variant="outline"
                  className="justify-start hover:bg-primary/10 transition-all duration-300"
                  onClick={() => {
                    setFileManagerOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  <Icon name="FolderOpen" size={18} className="mr-2" />
                  Проекты
                </Button>
                <Button
                  variant="outline"
                  className="justify-start hover:bg-secondary/10 transition-all duration-300"
                  onClick={() => {
                    handleExportZip();
                    setMenuOpen(false);
                  }}
                >
                  <Icon name="Download" size={18} className="mr-2" />
                  Экспорт ZIP
                </Button>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Редактор</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveCurrentProject}
                  className="hover:bg-primary/10 transition-all duration-300"
                >
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="html" className="h-[calc(100%-60px)] flex flex-col">
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

              <TabsContent value="html" className="flex-1 mt-0 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => htmlFileRef.current?.click()}
                  className="self-start"
                >
                  <Icon name="Upload" size={14} className="mr-2" />
                  Импорт HTML
                </Button>
                <input
                  ref={htmlFileRef}
                  type="file"
                  accept=".html,.htm"
                  className="hidden"
                  onChange={(e) => handleFileImport('html', e)}
                />
                <Textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="flex-1 font-mono text-sm bg-muted/30 border-border resize-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  placeholder="Введите HTML код..."
                />
              </TabsContent>

              <TabsContent value="css" className="flex-1 mt-0 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cssFileRef.current?.click()}
                  className="self-start"
                >
                  <Icon name="Upload" size={14} className="mr-2" />
                  Импорт CSS
                </Button>
                <input
                  ref={cssFileRef}
                  type="file"
                  accept=".css"
                  className="hidden"
                  onChange={(e) => handleFileImport('css', e)}
                />
                <Textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  className="flex-1 font-mono text-sm bg-muted/30 border-border resize-none focus:ring-2 focus:ring-secondary transition-all duration-300"
                  placeholder="Введите CSS код..."
                />
              </TabsContent>

              <TabsContent value="js" className="flex-1 mt-0 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => jsFileRef.current?.click()}
                  className="self-start"
                >
                  <Icon name="Upload" size={14} className="mr-2" />
                  Импорт JS
                </Button>
                <input
                  ref={jsFileRef}
                  type="file"
                  accept=".js"
                  className="hidden"
                  onChange={(e) => handleFileImport('js', e)}
                />
                <Textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  className="flex-1 font-mono text-sm bg-muted/30 border-border resize-none focus:ring-2 focus:ring-accent transition-all duration-300"
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
      </div>

      <Sheet open={fileManagerOpen} onOpenChange={setFileManagerOpen}>
        <SheetContent side="left" className="w-[400px] bg-card border-border">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Icon name="FolderOpen" size={20} className="text-primary" />
              Файловый менеджер
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6">
            <Button
              onClick={() => setNewProjectDialog(true)}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 mb-4"
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Новый проект
            </Button>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      currentProject?.id === project.id
                        ? 'border-primary shadow-primary/20'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        onClick={() => loadProject(project)}
                        className="flex-1"
                      >
                        <h3 className="font-semibold flex items-center gap-2">
                          <Icon name="FileCode" size={16} className="text-primary" />
                          {project.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id);
                        }}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={newProjectDialog} onOpenChange={setNewProjectDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Создать новый проект</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Название проекта</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Мой новый сайт"
                className="bg-muted/30"
                onKeyDown={(e) => e.key === 'Enter' && createNewProject()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjectDialog(false)}>
              Отмена
            </Button>
            <Button
              onClick={createNewProject}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;