# Interface — Agenda de Tarefas

## 1. Objetivo da interface

A interface da Agenda de Tarefas deve permitir que pessoas com pouca ou muita experiência em aplicativos de agenda organizem tarefas, lembretes e alertas em um calendário. A navegação deve ser simples, as funções devem ficar organizadas em um menu lateral e os registros devem oferecer opções amplas de personalização.

Este documento descreve a organização proposta para as telas a partir da visão do projeto, dos requisitos e dos casos de uso. Os documentos de origem não definem cores globais, tipografia, dimensões, identidade visual nem um framework de interface; esses detalhes deverão ser definidos na etapa de prototipação.

## 2. Estrutura geral

Após o login, a interface deve utilizar uma estrutura consistente, com:

- **Menu lateral:** acesso às áreas principais da aplicação.
- **Área principal:** exibição do calendário ou do conteúdo da área selecionada.
- **Ações contextuais:** opções para criar, visualizar, editar, personalizar e compartilhar registros, conforme a tela.
- **Mensagens de retorno:** confirmações de operações concluídas e avisos quando houver dados incorretos, campos obrigatórios vazios ou e-mail já cadastrado.

### 2.1 Menu lateral

O menu lateral deve organizar as funcionalidades da plataforma (RF-11 e RNF-03). A seguinte organização é uma proposta inicial baseada nas funcionalidades documentadas:

| Item | Função |
| --- | --- |
| Calendário | Consultar tarefas, lembretes e alertas por data e horário. |
| Criar registro | Iniciar o cadastro de uma tarefa, lembrete ou alerta. |
| Registros compartilhados | Consultar configurações compartilhadas por outros usuários e utilizá-las. |
| Configurações da interface | Acessar as opções de personalização da interface, a serem definidas no projeto visual. |
| Conta | Reunir as informações e ações relacionadas à conta do usuário, caso essa área seja implementada. |

Os itens “Configurações da interface” e “Conta” são sugestões de organização; os documentos de requisitos não especificam seus conteúdos nem exigem uma tela separada para cada um.

## 3. Telas e componentes

### 3.1 Cadastro de usuário

**Objetivo:** permitir a criação de uma conta.

**Campos:**
- Nome;
- E-mail;
- Senha.

**Ações e respostas do sistema:**
- Botão para confirmar o cadastro;
- Acesso à tela de login;
- Mensagem para preenchimento de campos obrigatórios;
- Mensagem quando o e-mail informado já estiver cadastrado;
- Confirmação após o cadastro ser concluído.

**Referência:** UC-01 e RF-01.

### 3.2 Login

**Objetivo:** autenticar um usuário cadastrado.

**Campos:**
- E-mail;
- Senha.

**Ações e respostas do sistema:**
- Botão para entrar;
- Acesso à tela de cadastro;
- Mensagem quando os dados informados não permitirem autenticação.

O calendário e as funcionalidades da agenda devem ser acessados após a autenticação.

**Referência:** UC-02 e RF-02.

### 3.3 Calendário

**Objetivo:** apresentar os registros do usuário nas respectivas datas e horários.

**Componentes previstos:**
- Calendário com os registros organizados por data e horário;
- Identificação visual dos tipos de registro, usando as cores e os formatos definidos para cada um;
- Ação para criar um registro;
- Acesso aos detalhes de um registro existente;
- Ação para editar um registro, quando selecionado.

A forma exata de apresentação do calendário — por exemplo, visualização mensal, semanal ou diária — não foi determinada nos documentos e deve ser definida no protótipo.

**Referência:** UC-03, UC-04, UC-06 e RF-03.

### 3.4 Criar e personalizar registro

**Objetivo:** permitir que o usuário crie uma tarefa, um lembrete ou um alerta e defina suas características.

**Informações e opções documentadas:**
- Tipo de registro: tarefa, lembrete ou alerta;
- Nome;
- Descrição;
- Cor;
- Formato;
- Data;
- Horário;
- Som emitido pelo alerta, conforme previsto na visão do projeto.

**Ações e respostas do sistema:**
- Confirmar a criação;
- Aplicar as opções selecionadas;
- Salvar as informações;
- Apresentar o novo registro no calendário;
- Avisar quando for necessário preencher informações obrigatórias.

Os documentos não especificam quais formatos visuais estarão disponíveis nem quais sons serão oferecidos. Essas opções devem ser definidas durante o detalhamento da interface.

**Referência:** UC-04, UC-05, RF-04 e RF-05.

### 3.5 Visualizar e editar registro

**Objetivo:** permitir a consulta e a alteração de um registro existente.

Ao selecionar um registro no calendário, a interface deve apresentar suas informações salvas e disponibilizar a edição. O usuário poderá alterar as informações e confirmar a operação; depois disso, a interface deve exibir os dados atualizados.

A edição deve respeitar a associação do registro à conta do usuário autenticado.

**Referência:** UC-06 e RF-06.

### 3.6 Registros compartilhados

**Objetivo:** permitir que os usuários compartilhem configurações personalizadas e reutilizem configurações disponibilizadas por outros usuários.

**Componentes previstos:**
- Lista ou área de consulta de registros compartilhados;
- Visualização das informações de uma configuração selecionada;
- Ação para utilizar a configuração;
- Confirmação de que a configuração foi adicionada à agenda do usuário.

Na utilização de um registro compartilhado, o sistema deve criar um registro na agenda do usuário que o selecionou, conforme o caso de uso. Os documentos não determinam se a interface deve mostrar autor, data de compartilhamento, filtros ou busca; tais elementos não são considerados obrigatórios neste documento.

**Referência:** UC-07, UC-08, RF-07 e RF-08.

### 3.7 Configurações específicas

**Objetivo:** oferecer modelos predefinidos para necessidades específicas.

Na etapa de criação, o usuário deve poder escolher uma configuração disponibilizada pelo sistema. Os exemplos indicados são:

- Lembrete de ingestão de água;
- Lembrete de exercício físico.

Depois da seleção, o sistema deve aplicar a configuração correspondente e permitir a confirmação da criação do registro.

**Referência:** UC-10 e RF-10.

### 3.8 Exibição dos alertas

**Objetivo:** apresentar o alerta no dispositivo do usuário quando a data e o horário configurados forem alcançados.

O alerta deve seguir as configurações associadas ao registro, incluindo as opções de personalização previstas pelo projeto. A aparência exata da notificação depende da plataforma e da tecnologia de implementação, que ainda não foram especificadas nos documentos consultados.

**Referência:** UC-09 e RF-09.

## 4. Personalização da interface

O projeto prevê que certas partes da interface possam ser personalizadas (RNF-04). Os documentos não enumeram quais elementos poderão ser alterados. Assim, a tela de configurações da interface deve ser detalhada posteriormente, definindo quais opções serão realmente disponibilizadas.

Essa personalização da interface é diferente da personalização dos registros, que já inclui nome, descrição, cor, formato, data e horário, além do som dos alertas previsto na visão do projeto.

## 5. Diretrizes de usabilidade

A interface deve:

1. Utilizar rótulos claros para os campos, botões e itens do menu.
2. Manter as funcionalidades em locais consistentes e acessíveis pelo menu lateral.
3. Indicar quais campos são obrigatórios antes do envio de formulários.
4. Informar o resultado das ações, incluindo erros de cadastro e login.
5. Manter os registros visíveis no calendário após sua criação ou edição bem-sucedida.
6. Tornar as opções de personalização compreensíveis para usuários sem experiência com aplicativos de agenda.

Essas diretrizes operacionalizam os requisitos RNF-01 e RNF-02, sem definir elementos visuais ainda não estabelecidos.

## 6. Relação com os requisitos

| Requisito | Elementos de interface relacionados |
| --- | --- |
| RF-01 | Tela de cadastro de usuário |
| RF-02 | Tela de login |
| RF-03 | Calendário |
| RF-04 | Fluxo de criação de registro |
| RF-05 | Formulário e opções de personalização do registro |
| RF-06 | Visualização e edição de registro |
| RF-07 | Ação para compartilhar uma configuração personalizada |
| RF-08 | Área de registros compartilhados e ação para utilizá-los |
| RF-09 | Apresentação de alertas no dispositivo |
| RF-10 | Seleção de configurações específicas predefinidas |
| RF-11 / RNF-03 | Menu lateral |
| RNF-01 / RNF-02 | Clareza, consistência e facilidade de uso |
| RNF-04 | Opções de personalização da interface, a detalhar |
| RNF-05 | Persistência dos dados após o encerramento da sessão |
