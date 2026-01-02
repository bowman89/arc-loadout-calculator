# Data workflow – arcraiders-data (submodule)

Denne guide beskriver det faste workflow, når data ændres i `arcraiders-data`,
som bruges som submodule i main-projektet.

---

## 1. Ret data

Redigér JSON-filer i:

data/arcraiders-data/...

yaml
Kopier kode

---

## 2. Commit data i data-repo’et

```powershell
cd data/arcraiders-data
git status
git add .
git commit -m "Describe data change"
git pull --rebase
git push
Hvis git push fejler med fetch first
powershell
Kopier kode
git pull --rebase
git push
3. Commit submodule-pointer i main repo
powershell
Kopier kode
cd ../..
git status
git add data/arcraiders-data
git commit -m "Update arcraiders-data submodule"
git push
4. (Valgfrit) Opret Pull Request
Hvis ændringen skal upstream til RaidTheory:

Gå til: https://github.com/bowman89/arcraiders-data

Klik Compare & pull request

Opret PR mod RaidTheory/main

Fejlfinding
403 ved push

Fork mangler eller push-remote peger ikke på din fork

fetch first

Kør git pull --rebase før git push

Ændringer vises ikke i app

Submodule-pointer er ikke committed i main repo




-----


ix 1 (anbefalet): Lad submodule pege på din fork (så Vercel kan hente dine commits)

Det her er den “det virker hver gang”-løsning mens du arbejder.

A) Ret submodule remote så origin både fetch’er og push’er til din fork

Kør i:

cd data/arcraiders-data
git remote -v


Sæt origin til din fork (begge retninger):

git remote set-url origin https://github.com/bowman89/arcraiders-data.git
git remote add upstream https://github.com/RaidTheory/arcraiders-data.git
git remote -v


Nu har du:

origin = din fork (fetch/push)

upstream = RaidTheory (kun som “kilde” du kan sync’e fra)