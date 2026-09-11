# 📚 StudyGroup

Aplicativo mobile de grupos de estudo focado em **produtividade e colaboração**, sem distrações de chat. Desenvolvido com React Native (Expo) e Node.js + Firebase.

---

## 🚀 Sobre o projeto

O StudyGroup permite que estudantes criem e participem de grupos de estudo com ferramentas pensadas para manter o foco:

- ⏱️ Cronômetro de sessões de estudo com ranking entre os membros
- 📝 Resumos compartilhados com comentários
- 📅 Agenda com eventos e lembretes
- 📢 Mural de recados e enquetes rápidas
- 📞 Chamadas de voz e vídeo integradas (Jitsi Meet)
- 🔔 Notificações em tempo real

---

## 🛠️ Tecnologias

### Frontend
- React Native + Expo
- Expo Router
- Firebase Authentication
- Axios
- React Native Calendars

### Backend
- Node.js + Express
- Firebase Admin SDK
- Firestore (banco de dados)
- Firebase Cloud Messaging (FCM)
- Jitsi Meet (chamadas)
- node-cron (agendamento)
- UUID

---
## 📁 Estrutura do projeto
```
StudyGroup/
├── backend/
│   └── src/
│       ├── config/         # Firebase Admin
│       ├── controllers/    # Lógica das requisições
│       ├── middlewares/    # Autenticação e permissões
│       ├── routes/         # Rotas da API
│       └── services/       # Regras de negócio
└── frontend/
    ├── app/                # Telas (Expo Router)
    └── services/           # Comunicação com API
```

## ⚙️ Como rodar

### Pré-requisitos
- Node.js instalado
- Expo Go no celular (Android ou iOS)

### Backend
```bash
cd backend
npm install
node server.js
```

> ⚠️ Adicione o arquivo `src/config/serviceAccountKey.json` com as credenciais do Firebase (não versionado por segurança).

### Frontend
```bash
cd frontend
npm install
npx expo start
```

Escaneie o QR code com o Expo Go.

> ⚠️ Atualize o `baseURL` em `services/api.ts` com o IP da sua máquina na rede local.

---

## 🗄️ Coleções do Firestore

| Coleção | Descrição |
|---|---|
| `groups` | Grupos de estudo |
| `groupMembers` | Membros de cada grupo |
| `joinRequests` | Solicitações de entrada |
| `invites` | Códigos de convite |
| `studySessions` | Sessões do cronômetro |
| `dailyStudyTime` | Tempo diário por usuário |
| `monthlyStudyTime` | Tempo mensal por usuário |
| `rankingHistory` | Histórico de posições |
| `summaries` | Resumos do grupo |
| `summaryComments` | Comentários nos resumos |
| `reminders` | Eventos da agenda |
| `groupMessages` | Recados e enquetes |
| `activeCalls` | Chamadas ativas |
| `notifications` | Notificações in-app |
| `userTokens` | Tokens FCM dos dispositivos |

---

## 📌 Status do projeto

🚧 Em desenvolvimento — versão de apresentação acadêmica.

## Participação
- | Monique Francielly | Backend — Cronômetro, Ranking, Resumos, Lembretes, Chamadas, Notificações e Integração Frontend |
- | Eduardo Duarte | Backend — Autenticação, Grupos, Firebase e Segurança |
- | Pietra Bezerra | Frontend — Telas e Design |
