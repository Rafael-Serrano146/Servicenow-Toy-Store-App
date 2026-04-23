# Toy Store — ServiceNow App

Aplicação desenvolvida na plataforma **ServiceNow** simulando um catálogo de serviços de uma loja de brinquedos. O projeto contempla cadastro de categorias, solicitação de produtos com campos personalizados e automação de notificação por e-mail via Flow Designer.



# Funcionalidades

- Cadastro de novas categorias de brinquedos no Service Catalog
- Solicitação de brinquedos com produto, data de entrega, nome do solicitante, prioridade e comentários
- Marcação de urgência no cadastro de categoria
- Opção de receber retorno sobre a conclusão da solicitação
- Automação via **Flow Designer**: ao definir prioridade como **Crítica**, um e-mail de notificação é disparado automaticamente

---

# Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| ServiceNow Studio | Desenvolvimento da aplicação e estrutura do catálogo |
| Service Catalog | Criação dos itens e variáveis do formulário |
| Flow Designer | Automação de envio de e-mail por prioridade crítica |
| HTML / CSS / JS | Recriação estática da interface para portfólio |

---

# Estrutura do Repositório

```
toy-store/
├── update-sets/
│   ├── sys_remote_update_set_nova_categoria.xml
│   └── sys_remote_update_set_solicitar_brinquedo.xml
├── toy-store.html  ← interface recriada em HTML
└── README.md
```

---

# Automação — Flow Designer

O fluxo implementado funciona da seguinte forma:

1. Usuário abre uma solicitação de brinquedo
2. Sistema verifica se a **Prioridade = Crítica**
3. Se sim, dispara e-mail automático de notificação

---

# Como Importar no ServiceNow (PDI)

1. Acesse sua instância em `developer.servicenow.com`
2. Navegue até **System Update Sets → Retrieved Update Sets**
3. Clique em **Import Update Set from XML**
4. Faça upload dos arquivos `.xml` da pasta `update-sets/`
5. Abra cada update set e clique em **Preview** e depois **Commit**
6. Acesse **Service Catalog** para visualizar a aplicação

---

# Visualizar a Interface (sem ServiceNow)

Abra o arquivo `toy-store.html` diretamente no navegador ou acesse via GitHub Pages para visualizar a interface recriada com HTML, CSS e JavaScript puro, sem necessidade de conta ou instância ServiceNow.

---

# Objetivo

Projeto desenvolvido para prática e aprendizado da plataforma ServiceNow, explorando:

- Criação de aplicações com **Studio**
- Modelagem de formulários com variáveis no **Service Catalog**
- Automação de processos com **Flow Designer**
- Exportação e versionamento via **Update Sets**
