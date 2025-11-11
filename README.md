# 🏋️ Academia FIT | Aplicativo de Acompanhamento de Treinos

Este é o repositório do aplicativo móvel de testes para acompanhamento de rotinas de treino, progresso e agenda. O projeto é desenvolvido com **Angular**, **Ionic** e compilado para plataformas nativas (Android/iOS) usando **Capacitor**.

# 🚀 Visão Geral do Projeto

O objetivo principal deste aplicativo é simular uma experiência de usuário completa para um sistema de gestão de treinos, incluindo autenticação de usuário e persistência de dados.

**Tecnologias Chave:**
- Frontend: Angular
- UI/Mobile: Ionic
- Compilador Nativo: Capacitor
- Banco de Dados/Autenticação: Firebase (Firestore / Auth)

# 📦 Como Instalar e Testar (Android APK)

Como este é um projeto de teste/desenvolvimento, ele requer a instalação de um arquivo APK assinado com a chave de debug.

**Você tem as seguintes soluções para efetuar o teste:**
---
#### a) Solução 1: Compilação Manual (Se Você Clonar o Código), para gerar um APK e testar diretamente no dispositivo móvel

Se você clonou o projeto e fez alterações, siga este fluxo para gerar o APK mais recente:

1. Instale Dependências:
```bash
npm install
```

2. Compile o Código Web:
```bash
npm run build
```

3. Copie o Web para o Nativo:
```bash
npx cap copy android
```

4. Gere o APK no Android Studio:
- Abra o Android Studio:
```bash
npx cap open android.
```
- Vá em **Build** (Construir) > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
- O arquivo gerado (app-debug.apk) estará em android/app/build/outputs/apk/debug/.

### ⚠️ Instruções de Instalação no Dispositivo Android

Para instalar o arquivo .apk diretamente no seu celular, você deve seguir este procedimento:

1. **Transferência**: Transfira o arquivo app-debug.apk para o seu celular (via USB, Drive, ou e-mail).
2. **Permissão**: No seu dispositivo Android, vá em **Configurações > Segurança/Privacidade** e habilite a opção para **"Instalar apps desconhecidos"** (permitindo a instalação do seu gerenciador de arquivos ou navegador).
3. **Instalação**: Localize o arquivo APK no seu celular e toque nele para iniciar a instalação.
---
#### b) Solução 2: Teste Rápido via Navegador (Web/WebView)

Se você precisa testar rapidamente a interface e a lógica do Angular/Ionic sem depender da compilação nativa (APK), use o servidor de desenvolvimento. Isso simula o ambiente WebView.

1. Inicie o Servidor:
```bash
ionic serve
```
- Nota: Se não estiver usando o CLI do Ionic, use ng serve ou npm start.
2. Acesse: Abra seu navegador em http://localhost:4200/ e use as ferramentas de desenvolvimento do navegador para simular dispositivos móveis.
Este método é ideal para desenvolvimento iterativo e depuração de componentes visuais e lógicas de negócios.

# ⚙️ Estrutura do Repositório (Controle de Versão)

O código-fonte nativo está incluso no repositório. O arquivo .gitignore está configurado para **ignorar** apenas arquivos grandes de cache e compilação, mantendo o repositório limpo:

**INCLUÍDO**: A pasta android (com as configurações nativas essenciais).
**IGNORADO**: Arquivos de cache e build (ex: android/app/build, .gradle/).
