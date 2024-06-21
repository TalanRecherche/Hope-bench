# Interface de saisi de CV

## Stack

- React
- Vite
- Typescript

Node 18

## Libs

- Bootstrap : librairie de composant UI
- React-Bootstrap : intégration de boostrap dans des composants React
- Formik : Librairie de gestion de formulaire (erreurs, liste d'input, ...)
- zod : librairie de validation de donnée
- ts-hook : librairie de hook react pour simplifier des use-cases standard

## Startup

```bash
npm install
npm run dev
```

## Good to note

### Formulaires

Pour éviter tout conflit ou soumission intempestive via 'Enter', il faut :

- ne pas mettre de callback `onSubmit` sur les balises `form` ou `Form`
- ne pas utiliser le composant `<Form/>` de `Formik`, mais celui de `React Bootstrap` ou la balise `form`
- ne pas mettre d'attribut `type="submit"` sur les boutons, mais mettre une callback `onClick`

exemple :

```tsx
import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";

const handleSave = (formData) => {/* do something with the data */
}
<Formik onSubmit={handleSave}>
	{({handleSubmit}) => (
		<Form>
			<CustomFormGroup label="Prénom" name="firstname" required/>
			<Button onClick={handleSubmit}>Valider</Button>
		</Form>
	)}
</Formik>
```

### Layout

Pour afficher les composants avec des espaces entre sans utiliser des classes dans tous les sens, on utilise le
composant `<Stack>`. Tous les composants à l'intérieur sont affichés en colonne et prennent toute la largeur. Pour
éviter d'avoir un bouton agrandi, il suffit de le mettre dans un `div`

```tsx
import { Button, Stack } from "react-bootstrap";

<Stack gap={3}>
	<CustomFormGroup label="Prénom" name="firstname" required/>
	<CustomFormGroup label="Nom" name="lastname" required/>
	<div>
		<Button>Valider</Button>
	</div>
</Stack>
```
