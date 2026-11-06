# Agenda de Tarefas — React Native + TypeScript

Aplicativo móvel desenvolvido a partir dos documentos de visão, requisitos, casos de uso, arquitetura e interface do projeto Agenda de Tarefas.

## Funcionalidades implementadas

- Cadastro de usuário com nome, e-mail e senha.
- Login e encerramento de sessão.
- Calendário mensal com indicação dos dias que possuem registros.
- Criação, visualização e edição de tarefas, lembretes e alertas.
- Personalização de nome, descrição, cor, formato, data, horário, som padrão/silencioso e ativação de notificação.
- Agendamento de notificações locais no dispositivo.
- Modelos predefinidos para ingestão de água e exercício físico.
- Compartilhamento de configurações e reutilização como cópias independentes.
- Menu lateral e tema claro/escuro.
- Persistência dos registros e perfis após fechar o aplicativo.

## Tecnologias

- React Native
- Expo SDK 58
- TypeScript
- AsyncStorage para persistência dos dados da agenda
- Expo SecureStore e Expo Crypto para armazenar a sessão e o hash da senha local
- Expo Notifications para notificações locais

## Como executar

É necessário ter Node.js compatível com o Expo SDK 58 instalado. A documentação do SDK informa Node.js 22.13 ou superior.

1. Extraia a pasta do projeto.
2. Abra um terminal dentro da pasta `agenda-tarefas-react-native`.
3. Instale as dependências:

```bash
npm install
npx expo install --fix
```

4. Inicie o Expo:

```bash
npx expo start
```

5. Abra o aplicativo em um emulador Android/iOS ou em um dispositivo compatível. Para executar especificamente no Android ou iOS, também é possível usar `npm run android` ou `npm run ios`.

Se o Expo solicitar a instalação ou atualização de algum pacote nativo, execute o comando indicado pelo próprio Expo.

## Organização do código

```text
agenda-tarefas-react-native/
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── components/
    │   ├── DrawerMenu.tsx
    │   ├── RecordCard.tsx
    │   └── ui.tsx
    ├── screens/
    │   ├── AuthScreen.tsx
    │   ├── CalendarScreen.tsx
    │   ├── RecordFormScreen.tsx
    │   ├── SettingsScreen.tsx
    │   └── SharedScreen.tsx
    ├── services/
    │   ├── authService.ts
    │   ├── database.ts
    │   ├── notificationService.ts
    │   └── recordsService.ts
    ├── types.ts
    ├── theme.ts
    └── utils/
        └── date.ts
```

### Responsabilidades principais

- `screens`: telas da interface — autenticação, calendário, formulário, compartilhamentos e configurações.
- `components`: elementos reutilizáveis, como menu lateral, cartões e campos.
- `services`: regras de aplicação, persistência, autenticação local, compartilhamento e notificações.
- `types.ts`: contratos e tipos usados entre as camadas.
- `theme.ts`: paletas de cores dos temas claro e escuro.
- `utils/date.ts`: funções de validação e manipulação de datas e horários locais.

## Limites desta versão demonstrativa

Os documentos originais não especificam servidor, API ou banco de dados remoto. Por isso, esta implementação utiliza dados locais:

- O cadastro e o login funcionam apenas na instalação em que a conta foi criada. A senha não é armazenada em texto puro, mas esta autenticação local não substitui um serviço de autenticação de produção.
- O compartilhamento funciona entre contas cadastradas na mesma instalação. Para compartilhar entre aparelhos e usuários pela internet, é necessário implementar backend, API e controle de acesso no servidor.
- Os registros são armazenados em AsyncStorage, que é persistente, mas não criptografado. Não armazene dados sensíveis nessa versão.
- As notificações são locais e pontuais, programadas para uma data e horário futuros. A entrega depende das permissões e das configurações do sistema operacional. No Android, o sistema pode aplicar restrições à pontualidade; teste em aparelho real.
- O formulário oferece som padrão ou silencioso. Sons personalizados exigem arquivos de áudio e configuração nativa adicional.
- O calendário mensal é a visualização inicial escolhida para esta implementação; os documentos de interface não fixam se a visualização deveria ser mensal, semanal ou diária.
- A personalização da interface foi concretizada como tema claro/escuro, pois os documentos não detalham quais elementos deveriam ser personalizáveis.

## Próximas etapas para uma versão de produção

1. Definir e implementar uma API/backend e banco de dados remoto.
2. Transferir autenticação, armazenamento de credenciais e autorização para o backend.
3. Implementar compartilhamento entre dispositivos com validação de propriedade e permissões no servidor.
4. Validar notificações em Android e iOS, incluindo permissões de alarmes exatos quando necessárias e comportamento com o aplicativo encerrado.
5. Definir política de recorrência, edição, exclusão e sincronização de notificações.
6. Detalhar as opções de personalização da interface e os formatos/sistemas de som desejados.

## Relação com os requisitos

| Requisito | Implementação nesta versão |
|---|---|
| RF-01 / RF-02 | `AuthScreen` e `authService.ts` |
| RF-03 | `CalendarScreen` |
| RF-04 / RF-05 / RF-06 | `RecordFormScreen` e `recordsService.ts` |
| RF-07 / RF-08 | `SharedScreen` e funções de compartilhamento em `recordsService.ts` |
| RF-09 | `notificationService.ts` |
| RF-10 | Modelos de ingestão de água e exercício físico em `RecordFormScreen` |
| RF-11 / RNF-03 | `DrawerMenu.tsx` |
| RNF-01 / RNF-02 | Formulários, retornos de validação e organização das telas |
| RNF-04 | Tema claro/escuro em `SettingsScreen` |
| RNF-05 | Persistência local em `database.ts` |
