## Casos de Uso
UC-01 — Cadastrar usuário

Objetivo:
Permitir que uma pessoa crie uma conta no sistema para utilizar suas funcionalidades.

Ator principal: Usuário

Pré-condições:

O usuário não precisa possuir uma conta cadastrada.

Fluxo principal:

O usuário acessa a tela de cadastro.
O sistema solicita nome, e-mail e senha.
O usuário informa seus dados.
O usuário confirma o cadastro.
O sistema verifica os dados fornecidos.
O sistema armazena as informações do usuário.
O sistema confirma a realização do cadastro.

Fluxos alternativos:

Caso algum dado obrigatório não seja informado, o sistema solicita que o usuário complete os dados.
Caso o e-mail já esteja cadastrado, o sistema informa que já existe uma conta associada ao e-mail.

Pós-condição:
O usuário possui uma conta cadastrada e seus dados ficam armazenados para utilização posterior.

UC-02 — Realizar login

Objetivo:
Permitir que um usuário cadastrado acesse sua conta.

Ator principal: Usuário

Pré-condições:

O usuário deve possuir uma conta cadastrada.

Fluxo principal:

O usuário acessa a tela de login.
O sistema solicita e-mail e senha.
O usuário informa seus dados.
O sistema verifica os dados informados.
O sistema autentica o usuário.
O sistema permite o acesso às funcionalidades da agenda.

Fluxo alternativo:

Caso os dados estejam incorretos, o sistema informa que o login não pôde ser realizado.

Pós-condição:
O usuário está autenticado no sistema.

UC-03 — Visualizar calendário

Objetivo:
Permitir que o usuário visualize seus alertas, lembretes e tarefas organizados no calendário.

Ator principal: Usuário

Pré-condições:

O usuário deve estar autenticado.

Fluxo principal:

O usuário acessa o calendário.
O sistema recupera os registros pertencentes ao usuário.
O sistema apresenta os registros nas respectivas datas e horários.
O usuário visualiza suas tarefas, alertas e lembretes.

Pós-condição:
Os registros do usuário são apresentados no calendário.

UC-04 — Criar registro

Objetivo:
Permitir que o usuário crie uma nova tarefa, alerta ou lembrete.

Ator principal: Usuário

Pré-condições:

O usuário deve estar autenticado.

Fluxo principal:

O usuário seleciona a opção para criar um novo registro.
O sistema apresenta as opções de registro.
O usuário escolhe o tipo de registro.
O usuário informa os dados necessários.
O usuário confirma a criação.
O sistema salva o registro.
O registro passa a aparecer no calendário.

Pós-condição:
Um novo registro é armazenado na conta do usuário.

UC-05 — Personalizar registro

Objetivo:
Permitir que o usuário defina as características de um registro de acordo com suas preferências.

Ator principal: Usuário

Pré-condições:

O usuário deve possuir ou estar criando um registro.

Fluxo principal:

O usuário acessa as opções de personalização.
O sistema apresenta as configurações disponíveis.
O usuário define o nome do registro.
O usuário define a descrição.
O usuário define a cor.
O usuário define o formato.
O usuário define a data e o horário.
O usuário pode configurar outras opções disponíveis.
O sistema armazena as configurações definidas.

A visão do projeto também prevê personalização do som emitido pelos alertas, além de nome, descrição, cor, formato, data e horário.

Pós-condição:
O registro fica armazenado com as configurações escolhidas pelo usuário.

UC-06 — Editar registro

Objetivo:
Permitir que o usuário altere um registro que já foi criado.

Ator principal: Usuário

Pré-condições:

O usuário deve estar autenticado.
Deve existir um registro pertencente ao usuário.

Fluxo principal:

O usuário seleciona um registro existente.
O sistema apresenta as informações do registro.
O usuário seleciona a opção de edição.
O usuário altera as informações desejadas.
O usuário confirma as alterações.
O sistema atualiza o registro.
O sistema apresenta o registro atualizado.

Pós-condição:
As novas informações do registro são armazenadas.

UC-07 — Compartilhar registro

Objetivo:
Permitir que o usuário compartilhe uma configuração personalizada com outros usuários da plataforma.

Ator principal: Usuário

Pré-condições:

O usuário deve estar autenticado.
Deve existir um registro personalizado.

Fluxo principal:

O usuário seleciona um registro personalizado.
O usuário escolhe a opção de compartilhamento.
O sistema disponibiliza o registro para outros usuários.
O sistema confirma o compartilhamento.

A possibilidade de compartilhar configurações personalizadas entre usuários é uma das funcionalidades centrais apresentadas na visão do projeto.

Pós-condição:
O registro personalizado fica disponível para ser utilizado por outros usuários.

UC-08 — Utilizar registro compartilhado

Objetivo:
Permitir que um usuário utilize uma configuração de registro criada e compartilhada por outro usuário.

Ator principal: Usuário

Pré-condições:

O usuário deve estar autenticado.
Deve existir um registro compartilhado disponível.

Fluxo principal:

O usuário acessa os registros compartilhados.
O sistema apresenta os registros disponíveis.
O usuário seleciona um registro.
O usuário escolhe utilizá-lo.
O sistema adiciona o registro à agenda do usuário.
O registro passa a poder ser utilizado pelo usuário.

Pós-condição:
O usuário possui em sua agenda um registro baseado em uma configuração compartilhada.

UC-09 — Receber alerta

Objetivo:
Emitir um alerta para o usuário de acordo com as configurações de um registro.

Ator principal: Sistema
Ator secundário: Usuário

Pré-condições:

Deve existir um registro configurado para emitir um alerta.
A data e o horário do registro devem ser alcançados.

Fluxo principal:

O sistema verifica os registros agendados.
O sistema identifica que o horário de um alerta foi alcançado.
O sistema utiliza as configurações definidas para o registro.
O sistema emite o alerta no dispositivo do usuário.
O usuário recebe o alerta.

O requisito RF-09 determina que os alertas sejam apresentados no dispositivo com base na personalização realizada pelo usuário.

Pós-condição:
O usuário recebe o alerta correspondente ao registro configurado.

UC-10 — Utilizar configuração específica

Objetivo:
Permitir que o usuário utilize configurações pré-definidas para determinados tipos de alertas e lembretes.

Ator principal: Usuário

Pré-condições:

O usuário deve estar autenticado.
Deve existir uma configuração específica disponibilizada pelo sistema.

Fluxo principal:

O usuário acessa a criação de um novo registro.
O sistema apresenta as configurações específicas disponíveis.
O usuário seleciona uma configuração.
O sistema aplica as configurações correspondentes.
O usuário confirma a utilização.
O sistema cria o registro.

A visão cita como exemplos configurações para ingestão de água e exercício físico.

Pós-condição:
Um registro é criado utilizando uma configuração específica disponibilizada pelo sistema.

UC-11 — Navegar pelo menu

Objetivo:
Permitir que o usuário acesse as diferentes funcionalidades do sistema por meio do menu lateral.

Ator principal: Usuário

Pré-condições:

O sistema deve estar acessível ao usuário.

Fluxo principal:

O usuário acessa a barra lateral.
O sistema apresenta as opções disponíveis.
O usuário seleciona uma funcionalidade.
O sistema direciona o usuário para a funcionalidade escolhida.

Pós-condição:
O usuário acessa a funcionalidade selecionada.

O menu lateral é previsto tanto como requisito funcional quanto como requisito não funcional do projeto.