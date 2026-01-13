# HMC Klok

Een digitale klok applicatie die de tijd weergeeft in verschillende tijdzones, samen met zonsopkomst- en zonsondergangtijden en maanfase-informatie.

## URL Parameters

De klok kan worden aangepast met de volgende URL parameters:

### Theme Parameter

| Parameter | Waarde | Beschrijving |
|-----------|--------|--------------|
| `theme` | `day` | Forceert het lichte (dag) thema |
| `theme` | `night` | Forceert het donkere (nacht) thema |

**Voorbeelden:**
- `https://jouw-domein.nl/?theme=day` - Toont altijd het dag-thema
- `https://jouw-domein.nl/?theme=night` - Toont altijd het nacht-thema

Zonder de `theme` parameter wordt het thema automatisch bepaald op basis van zonsopkomst en zonsondergang in Amsterdam.

### User Parameter

| Parameter | Waarde | Beschrijving |
|-----------|--------|--------------|
| `user` | `crisis` | Activeert de crisis-modus |

**Voorbeeld:**
- `https://jouw-domein.nl/?user=crisis` - Toont extra de AST (Atlantic Standard Time) tijdzone

### Timezone Emojis Parameter

| Parameter | Waarde | Beschrijving |
|-----------|--------|--------------|
| `timezone_emojis` | `true` | Toont emoji's/vlaggen naast de tijdzones |

**Voorbeeld:**
- `https://jouw-domein.nl/?timezone_emojis=true` - Toont vlaggen en emoji's naast elke tijdzone

Standaard worden de emoji's niet weergegeven.

### Gecombineerd gebruik

Parameters kunnen worden gecombineerd met `&`:

- `https://jouw-domein.nl/?theme=night&user=crisis` - Nacht-thema met crisis-modus
- `https://jouw-domein.nl/?timezone_emojis=true&theme=day` - Dag-thema met tijdzone emoji's
- `https://jouw-domein.nl/?user=crisis&timezone_emojis=true` - Crisis-modus met emoji's

## Weergegeven informatie

- **UTC** - Coordinated Universal Time
- **MET** - Midden-Europese Tijd (alleen tijdens zomertijd)
- **CET** - Centraal-Europese Tijd
- **AST** - Atlantic Standard Time (alleen in crisis-modus)
- **Zonsopkomst/Zonsondergang** - Tijden voor Amsterdam
- **Maanfase** - Huidige maanfase met percentage

---

## Project info

**URL**: https://lovable.dev/projects/c10f499f-4eb6-40cd-bd85-e3ba8de28557

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c10f499f-4eb6-40cd-bd85-e3ba8de28557) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c10f499f-4eb6-40cd-bd85-e3ba8de28557) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
